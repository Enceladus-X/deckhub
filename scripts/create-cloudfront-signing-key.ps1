param(
  [string]$NamePrefix = "deckhub-prod",
  [string]$AwsRegion = "ap-northeast-2",
  [string]$SecretName = "/deckhub/cloudfront/private-key",
  [string]$OutputDirectory = ".local/cloudfront-signing",
  [switch]$RotateLocalKey,
  [switch]$SetGitHubSecrets,
  [string]$GitHubOrg = "Enceladus-X",
  [string]$RepositoryName = "deckhub"
)

$ErrorActionPreference = "Stop"

function Require-Command($Name) {
  if (!(Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Required command '$Name' was not found on PATH."
  }
}

function Write-JsonFile($Path, $Value) {
  $json = $Value | ConvertTo-Json -Depth 10
  [System.IO.File]::WriteAllText($Path, $json, [System.Text.UTF8Encoding]::new($false))
}

function To-AwsFileUri($Path) {
  $resolved = (Resolve-Path -LiteralPath $Path).Path
  return "file://$resolved"
}

Require-Command aws
Require-Command openssl

$outputPath = Join-Path (Resolve-Path -LiteralPath ".").Path $OutputDirectory
New-Item -ItemType Directory -Force -Path $outputPath | Out-Null

$privateKeyPath = Join-Path $outputPath "cloudfront_private_key.pem"
$publicKeyPath = Join-Path $outputPath "cloudfront_public_key.pem"

if ($RotateLocalKey -or !(Test-Path -LiteralPath $privateKeyPath)) {
  Write-Host "Generating RSA 2048 private key..."
  openssl genrsa -out $privateKeyPath 2048
}

Write-Host "Deriving public key..."
openssl rsa -pubout -in $privateKeyPath -out $publicKeyPath

Write-Host "Storing private key in AWS Secrets Manager..."
$privateKeyPem = Get-Content -LiteralPath $privateKeyPath -Raw
$existingSecretArn = aws secretsmanager list-secrets `
  --filters Key=name,Values=$SecretName `
  --region $AwsRegion `
  --query "SecretList[0].ARN" `
  --output text

if ($existingSecretArn -and $existingSecretArn -ne "None") {
  aws secretsmanager put-secret-value `
    --secret-id $SecretName `
    --secret-string $privateKeyPem `
    --region $AwsRegion | Out-Null
} else {
  aws secretsmanager create-secret `
    --name $SecretName `
    --secret-string $privateKeyPem `
    --region $AwsRegion `
    --description "DeckHub CloudFront signed URL private key" | Out-Null
}

$secretArn = aws secretsmanager describe-secret `
  --secret-id $SecretName `
  --region $AwsRegion `
  --query ARN `
  --output text

$publicKeyName = "$NamePrefix-public-key"
$keyGroupName = "$NamePrefix-key-group"

$publicKeyId = aws cloudfront list-public-keys `
  --query "PublicKeyList.Items[?Name=='$publicKeyName'].Id | [0]" `
  --output text

if (!$publicKeyId -or $publicKeyId -eq "None") {
  Write-Host "Registering CloudFront public key..."
  $publicKeyConfigPath = Join-Path $outputPath "public-key-config.json"
  Write-JsonFile $publicKeyConfigPath @{
    CallerReference = "$publicKeyName-$(Get-Date -Format yyyyMMddHHmmss)"
    Name = $publicKeyName
    EncodedKey = (Get-Content -LiteralPath $publicKeyPath -Raw)
    Comment = "DeckHub signed URL public key"
  }

  $publicKeyId = aws cloudfront create-public-key `
    --public-key-config (To-AwsFileUri $publicKeyConfigPath) `
    --query "PublicKey.Id" `
    --output text
} else {
  Write-Host "CloudFront public key already exists: $publicKeyId"
}

$keyGroupId = aws cloudfront list-key-groups `
  --query "KeyGroupList.Items[?KeyGroup.KeyGroupConfig.Name=='$keyGroupName'].KeyGroup.Id | [0]" `
  --output text

if (!$keyGroupId -or $keyGroupId -eq "None") {
  Write-Host "Creating CloudFront key group..."
  $keyGroupConfigPath = Join-Path $outputPath "key-group-config.json"
  Write-JsonFile $keyGroupConfigPath @{
    Name = $keyGroupName
    Items = @($publicKeyId)
    Comment = "DeckHub signed URL key group"
  }

  $keyGroupId = aws cloudfront create-key-group `
    --key-group-config (To-AwsFileUri $keyGroupConfigPath) `
    --query "KeyGroup.Id" `
    --output text
} else {
  Write-Host "CloudFront key group already exists: $keyGroupId"
}

Write-Host ""
Write-Host "CloudFront key group id:"
Write-Host $keyGroupId
Write-Host ""
Write-Host "CloudFront public key id. Use this as CLOUDFRONT_KEY_PAIR_ID for signed URLs:"
Write-Host $publicKeyId
Write-Host ""
Write-Host "Private key secret ARN:"
Write-Host $secretArn

if ($SetGitHubSecrets) {
  Require-Command gh
  $repo = "$GitHubOrg/$RepositoryName"
  gh secret set CLOUDFRONT_KEY_GROUP_ID --repo $repo --body $keyGroupId
  gh secret set CLOUDFRONT_KEY_PAIR_ID --repo $repo --body $publicKeyId
  gh secret set CLOUDFRONT_PRIVATE_KEY_SECRET_ARN --repo $repo --body $secretArn
  Write-Host "GitHub repository secrets were updated for $repo."
} else {
  Write-Host ""
  Write-Host "Set these GitHub secrets before deploying signed downloads:"
  Write-Host "  CLOUDFRONT_KEY_GROUP_ID=$keyGroupId"
  Write-Host "  CLOUDFRONT_KEY_PAIR_ID=$publicKeyId"
  Write-Host "  CLOUDFRONT_PRIVATE_KEY_SECRET_ARN=$secretArn"
}

Write-Host ""
Write-Host "Local PEM files are in $outputPath and are ignored by git. Keep them private or delete them after confirming Secrets Manager storage."
