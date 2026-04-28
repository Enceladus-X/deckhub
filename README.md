# DeckHub

Certification Deck Hub for Anki.

DeckHub is a serverless Anki deck distribution platform built around immutable deck versions and signed CDN downloads.

## Architecture

- `frontend/`: Next.js static export, TypeScript, Tailwind CSS
- `backend/`: AWS Lambda native Python handler, Pydantic, DynamoDB access
- `infrastructure/`: AWS SAM template for API Gateway, Lambda, DynamoDB, S3, CloudFront OAC

## Bootstrap

```powershell
.\scripts\bootstrap.ps1
```

The frontend was created with:

```powershell
npx create-next-app@latest frontend --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
```

Static export is enabled in `frontend/next.config.js`.

## Local Development

```powershell
npm --prefix frontend run dev
```

```powershell
python -m venv backend/.venv
backend/.venv/Scripts/python.exe -m pip install -r backend/requirements-dev.txt
backend/.venv/Scripts/python.exe -m pytest backend
```

## SAM

```powershell
sam validate --template-file infrastructure/template.yaml
sam build --template-file infrastructure/template.yaml
sam deploy --guided --template-file infrastructure/template.yaml
```

For production download protection, create a CloudFront public key/key group and pass `CloudFrontTrustedKeyGroupId`, `CloudFrontKeyPairId`, and `CloudFrontPrivateKeySecretArn` during deployment.

## AWS Deploy Bootstrap

Create the GitHub Actions OIDC role and SAM artifact bucket:

```powershell
.\scripts\setup-github-oidc-role.ps1 -SetGitHubSecrets
```

Create the CloudFront signed URL key pair, register the public key/key group, and store the private key in AWS Secrets Manager:

```powershell
.\scripts\create-cloudfront-signing-key.ps1 -SetGitHubSecrets
```

After those scripts run, pushes to `main` use `.github/workflows/deploy.yml` to deploy the SAM stack, build the static frontend, upload it to S3, and invalidate CloudFront.
