# DeckHub Infrastructure

AWS SAM template for the DeckHub serverless stack.

## Resources

- GitHub Actions OIDC deploy role bootstrap template
- API Gateway HTTP API
- Lambda API function
- DynamoDB `decks` table
- DynamoDB `deck_versions` table
- Private S3 frontend bucket
- Private S3 deck file bucket
- CloudFront distributions with Origin Access Control

## Commands

```powershell
sam validate --template-file template.yaml
sam build --template-file template.yaml
sam deploy --guided --template-file template.yaml
```

For signed downloads, create a CloudFront public key and key group, then deploy with:

```powershell
sam deploy --guided --parameter-overrides CloudFrontTrustedKeyGroupId=... CloudFrontKeyPairId=... CloudFrontPrivateKeySecretArn=...
```

## GitHub Actions OIDC

```powershell
.\scripts\setup-github-oidc-role.ps1 -SetGitHubSecrets
```

The role trust policy allows only:

```text
repo:Enceladus-X/deckhub:ref:refs/heads/main
```

## CloudFront Signing Keys

```powershell
.\scripts\create-cloudfront-signing-key.ps1 -SetGitHubSecrets
```

The public key is registered in CloudFront, the key group is passed into the SAM stack, and the private key is stored in AWS Secrets Manager for Lambda runtime signing.
