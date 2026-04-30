param(
  [string]$GitHubOrg = "Enceladus-X",
  [string]$RepositoryName = "deckhub",
  [string]$BranchName = "main",
  [string]$AwsRegion = "ap-northeast-2",
  [string]$SamStackName = "deckhub",
  [string]$OidcStackName = "deckhub-github-oidc",
  [string]$RoleName = "deckhub-github-actions-deploy",
  [switch]$SetGitHubSecrets
)

$ErrorActionPreference = "Stop"

function Require-Command($Name) {
  if (!(Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Required command '$Name' was not found on PATH."
  }
}

Require-Command aws

$accountId = aws sts get-caller-identity --query Account --output text
if (!$accountId) {
  throw "Unable to resolve AWS account id. Check your AWS CLI credentials."
}

$providerArn = "arn:aws:iam::$accountId:oidc-provider/token.actions.githubusercontent.com"
$existingProviderArn = aws iam list-open-id-connect-providers `
  --query "OpenIDConnectProviderList[?Arn=='$providerArn'].Arn | [0]" `
  --output text
$createProvider = if ($existingProviderArn -and $existingProviderArn -ne "None") { "false" } else { "true" }

Write-Host "Deploying GitHub OIDC role stack..."
Write-Host "AWS account: $accountId"
Write-Host "OIDC provider exists: $($createProvider -eq 'false')"
Write-Host "Trusted GitHub subject: repo:$GitHubOrg/$RepositoryName`:ref:refs/heads/$BranchName"

aws cloudformation deploy `
  --template-file "infrastructure/github-oidc-role.yaml" `
  --stack-name $OidcStackName `
  --region $AwsRegion `
  --capabilities CAPABILITY_NAMED_IAM `
  --parameter-overrides `
    GitHubOrg=$GitHubOrg `
    RepositoryName=$RepositoryName `
    BranchName=$BranchName `
    SamStackName=$SamStackName `
    RoleName=$RoleName `
    CreateOidcProvider=$createProvider

$deployRoleArn = aws cloudformation describe-stacks `
  --stack-name $OidcStackName `
  --region $AwsRegion `
  --query "Stacks[0].Outputs[?OutputKey=='DeployRoleArn'].OutputValue | [0]" `
  --output text

$artifactBucket = aws cloudformation describe-stacks `
  --stack-name $OidcStackName `
  --region $AwsRegion `
  --query "Stacks[0].Outputs[?OutputKey=='SamArtifactBucketName'].OutputValue | [0]" `
  --output text

Write-Host ""
Write-Host "GitHub Actions deploy role:"
Write-Host $deployRoleArn
Write-Host ""
Write-Host "SAM artifact bucket:"
Write-Host $artifactBucket

if ($SetGitHubSecrets) {
  Require-Command gh
  $repo = "$GitHubOrg/$RepositoryName"
  gh secret set AWS_DEPLOY_ROLE_ARN --repo $repo --body $deployRoleArn
  gh secret set SAM_ARTIFACT_BUCKET --repo $repo --body $artifactBucket
  gh variable set AWS_REGION --repo $repo --body $AwsRegion
  gh variable set SAM_STACK_NAME --repo $repo --body $SamStackName
  gh variable set STAGE_NAME --repo $repo --body "prod"
  Write-Host "GitHub repository secrets and variables were updated for $repo."
} else {
  Write-Host ""
  Write-Host "Set these in GitHub before the first deploy:"
  Write-Host "  Secret AWS_DEPLOY_ROLE_ARN=$deployRoleArn"
  Write-Host "  Secret SAM_ARTIFACT_BUCKET=$artifactBucket"
  Write-Host "  Variable AWS_REGION=$AwsRegion"
  Write-Host "  Variable SAM_STACK_NAME=$SamStackName"
  Write-Host "  Variable STAGE_NAME=prod"
}
