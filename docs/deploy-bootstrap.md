# DeckHub Deploy Bootstrap

This is the first-deploy order for a fresh AWS account and the `Enceladus-X/deckhub` GitHub repository.

## 1. Local prerequisites

```powershell
aws sts get-caller-identity
gh auth status
openssl version
```

The local AWS identity needs permission to create IAM roles, an IAM OIDC provider, S3 buckets, Secrets Manager secrets, and CloudFront public keys/key groups.

## 2. Create the GitHub OIDC deploy role

```powershell
.\scripts\setup-github-oidc-role.ps1 -SetGitHubSecrets
```

This creates:

- IAM OIDC provider for `https://token.actions.githubusercontent.com`, unless one already exists
- IAM deploy role trusted only by `repo:Enceladus-X/deckhub:ref:refs/heads/main`
- S3 bucket for SAM artifacts
- GitHub secrets/variables used by `.github/workflows/deploy.yml`

Without `-SetGitHubSecrets`, the script prints the values to set manually.

## 3. Create CloudFront signed URL keys

```powershell
.\scripts\create-cloudfront-signing-key.ps1 -SetGitHubSecrets
```

This creates:

- RSA 2048 private key in `.local/cloudfront-signing/`
- AWS Secrets Manager secret containing the private key
- CloudFront public key
- CloudFront key group
- GitHub secrets for the SAM deployment parameters

The local `.local/` directory is ignored by git. After confirming the private key is in Secrets Manager, keep the local copy somewhere secure or delete it.

## 4. First commit and deploy

```powershell
git add .
git commit -m "Initial DeckHub serverless scaffold"
git push -u origin main
```

The `deploy` workflow then:

1. Tests the backend.
2. Builds and deploys the SAM stack.
3. Reads stack outputs for the frontend bucket and CloudFront distribution.
4. Builds the Next.js static export.
5. Syncs `frontend/out` to S3.
6. Creates a CloudFront invalidation.
