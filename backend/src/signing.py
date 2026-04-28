from __future__ import annotations

import os
from datetime import datetime, timezone
from functools import lru_cache
from urllib.parse import quote

import boto3
from botocore.signers import CloudFrontSigner
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding


class SigningNotConfigured(RuntimeError):
    pass


@lru_cache(maxsize=1)
def _private_key():
    private_key_pem = os.environ.get("CLOUDFRONT_PRIVATE_KEY_PEM")
    secret_arn = os.environ.get("CLOUDFRONT_PRIVATE_KEY_SECRET_ARN")

    if not private_key_pem and secret_arn:
        secret = boto3.client("secretsmanager").get_secret_value(SecretId=secret_arn)
        private_key_pem = secret.get("SecretString")

    if not private_key_pem:
        raise SigningNotConfigured("CloudFront private key is not configured.")

    private_key_pem = private_key_pem.replace("\\n", "\n").encode("utf-8")
    return serialization.load_pem_private_key(private_key_pem, password=None)


def _rsa_signer(message: bytes) -> bytes:
    return _private_key().sign(message, padding.PKCS1v15(), hashes.SHA1())


def build_cloudfront_signed_url(domain: str, s3_key: str, expires_at: int) -> str:
    key_pair_id = os.environ.get("CLOUDFRONT_KEY_PAIR_ID")
    if not key_pair_id:
        raise SigningNotConfigured("CloudFront key pair id is not configured.")

    clean_key = s3_key.lstrip("/")
    resource_url = f"https://{domain}/{quote(clean_key, safe='/._-')}"
    signer = CloudFrontSigner(key_pair_id, _rsa_signer)
    return signer.generate_presigned_url(
        resource_url,
        date_less_than=datetime.fromtimestamp(expires_at, tz=timezone.utc),
    )
