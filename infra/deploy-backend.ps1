# Script to deploy Backend Container App

# Configuration
$ResourceGroupName = "rg-dym-dev1" # Must match the resource group created in main.bicep
$AcrName = "dymacrdev55" # Must match the ACR name in the bicep file
$BackendImageName = "dym-backend"
$FrontendImageName = "dym-frontend" # Added frontend image name
$ImageTag = "latest"
$DeploymentTimeout = 900 # 15 minutes timeout

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

# Verify ACR exists
Write-Host "Verifying ACR exists..." -ForegroundColor Blue
$acrExists = az acr show --name $AcrName --query name -o tsv 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Azure Container Registry '$AcrName' not found. Please verify the name." -ForegroundColor Red
    exit 1
}

# Verify ACR admin is enabled
Write-Host "Verifying ACR admin user is enabled..." -ForegroundColor Blue
$adminEnabled = az acr show --name $AcrName --query adminUserEnabled -o tsv
if ($adminEnabled -eq "false") {
    Write-Host "Enabling admin user for ACR..." -ForegroundColor Yellow
    az acr update --name $AcrName --admin-enabled true
}

# Verify backend image exists in ACR
Write-Host "Verifying backend image exists in ACR..." -ForegroundColor Blue
$imageExists = az acr repository show --name $AcrName --repository $BackendImageName 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Image '$BackendImageName' not found in ACR. Please build and push the image first." -ForegroundColor Red
    exit 1
}

# Construct path to Bicep template relative to this script
$templateFilePath = Join-Path $PSScriptRoot "deploy-container-apps.bicep"

# Deploy Container Apps Environment and Backend App
Write-Host "Deploying Container Apps Environment and Backend App..." -ForegroundColor Blue
Write-Host "This might take several minutes. Please be patient..." -ForegroundColor Yellow

$deployment = az deployment group create `
    --resource-group $ResourceGroupName `
    --template-file $templateFilePath `
    --parameters acrName=$AcrName backendImageName=$BackendImageName frontendImageName=$FrontendImageName imageTag=$ImageTag `
    --query "properties.outputs" `
    --no-wait `
    -o none

# Monitor deployment progress
$startTime = Get-Date
$deploymentName = "deploy-container-apps"
$status = ""

Write-Host "Monitoring deployment progress..." -ForegroundColor Blue
while ($status -ne "Succeeded" -and $status -ne "Failed" -and $status -ne "Canceled") {
    Start-Sleep -Seconds 10
    
    $deployment = az deployment group show --resource-group $ResourceGroupName --name $deploymentName 2>$null
    if ($deployment) {
        $deploymentObject = $deployment | ConvertFrom-Json
        $status = $deploymentObject.properties.provisioningState
        Write-Host "Deployment status: $status" -ForegroundColor Blue
    }
    
    $currentTime = Get-Date
    $elapsedTime = ($currentTime - $startTime).TotalSeconds
    
    if ($elapsedTime -gt $DeploymentTimeout) {
        Write-Host "Deployment timed out after $($DeploymentTimeout/60) minutes." -ForegroundColor Red
        Write-Host "Please check the Azure Portal for more details." -ForegroundColor Yellow
        exit 1
    }
}

if ($status -ne "Succeeded") {
    Write-Host "Deployment failed. Please check the Azure Portal for details." -ForegroundColor Red
    exit 1
}

# Get the outputs
$outputs = az deployment group show --resource-group $ResourceGroupName --name $deploymentName --query "properties.outputs" -o json | ConvertFrom-Json
$environmentName = $outputs.environmentName.value
$environmentDefaultDomain = $outputs.environmentDefaultDomain.value
$backendFqdn = $outputs.backendFqdn.value
$frontendFqdn = $outputs.frontendFqdn.value # Added frontend FQDN retrieval

# Display results
Write-Host "Container Apps deployed successfully!" -ForegroundColor Green
Write-Host "Environment Name: $environmentName" -ForegroundColor Blue
Write-Host "Environment Default Domain: $environmentDefaultDomain" -ForegroundColor Blue
Write-Host "Backend URL: https://$backendFqdn" -ForegroundColor Blue
Write-Host "Frontend URL: https://$frontendFqdn" -ForegroundColor Blue # Added frontend URL display

# Test backend health check endpoint
Write-Host "Testing backend API (this may take a moment for the container to start)..." -ForegroundColor Blue
Write-Host "Waiting for 60 seconds before checking health endpoint..." -ForegroundColor Yellow
Start-Sleep -Seconds 60 # Give the container more time to start

try {
    $response = Invoke-RestMethod -Uri "https://$backendFqdn/health" -Method Get -TimeoutSec 60
    Write-Host "Backend API is responding!" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json -Compress)" -ForegroundColor Blue
} catch {
    Write-Host "Warning: Could not connect to backend API. It may still be starting up." -ForegroundColor Yellow
    Write-Host "You can manually check the backend at: https://$backendFqdn/health" -ForegroundColor Yellow
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Verify backend functionality manually by visiting: https://$backendFqdn/health" -ForegroundColor Yellow
Write-Host "2. Add frontend Container App and configure networking between containers" -ForegroundColor Yellow
Write-Host "3. Access the frontend application at: https://$frontendFqdn" -ForegroundColor Yellow # Added next step for frontend 