# Script to deploy Container Apps Environment

# Configuration
$ResourceGroupName = "rg-dym-dev1" # Must match the resource group created in main.bicep

# Ensure Azure CLI is logged in
Write-Host "Checking Azure CLI login status..." -ForegroundColor Blue
$loginStatus = az account show --query name -o tsv 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Not logged in to Azure CLI. Please login." -ForegroundColor Yellow
    az login
}

# Verify resource group exists
Write-Host "Verifying resource group exists..." -ForegroundColor Blue
$rgExists = az group exists --name $ResourceGroupName
if ($rgExists -eq "false") {
    Write-Host "Resource group '$ResourceGroupName' does not exist. Please run main.bicep first." -ForegroundColor Red
    exit 1
}

# Deploy Container Apps Environment
Write-Host "Deploying Container Apps Environment..." -ForegroundColor Blue
$deployment = az deployment group create `
    --resource-group $ResourceGroupName `
    --template-file "deploy-container-apps.bicep" `
    --query "properties.outputs" `
    -o json

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to deploy Container Apps Environment. See error details above." -ForegroundColor Red
    exit 1
}

# Parse the deployment outputs
$outputs = $deployment | ConvertFrom-Json
$environmentName = $outputs.environmentName.value
$environmentDefaultDomain = $outputs.environmentDefaultDomain.value

# Display results
Write-Host "Container Apps Environment deployed successfully!" -ForegroundColor Green
Write-Host "Environment Name: $environmentName" -ForegroundColor Blue
Write-Host "Environment Default Domain: $environmentDefaultDomain" -ForegroundColor Blue
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Add Container Apps for backend and frontend" -ForegroundColor Yellow
Write-Host "2. Configure networking between containers" -ForegroundColor Yellow 