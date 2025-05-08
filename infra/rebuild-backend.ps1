# Script to rebuild and redeploy the backend container app

# Configuration
$ResourceGroupName = "rg-dym-dev1" # Must match the resource group created in main.bicep
$AcrName = "dymacrdev55" # Must match the ACR name in the bicep file
$BackendImageName = "dym-backend"
$ImageTag = "latest"
$DeploymentTimeout = 900 # 15 minutes timeout
$DeploymentName = "deploy-container-apps"
$scriptPath = $PSScriptRoot
$projectRoot = Split-Path $scriptPath -Parent

# Ensure we're in the right directory
Set-Location $projectRoot

Write-Host "Starting backend rebuild and redeployment process..." -ForegroundColor Blue
Write-Host "Project root: $projectRoot" -ForegroundColor Blue

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

# Login to Azure Container Registry
Write-Host "Logging into Azure Container Registry..." -ForegroundColor Blue
az acr login --name $AcrName

# Build and push backend container
Write-Host "Building backend container image..." -ForegroundColor Blue
$backendPath = Join-Path $projectRoot "app/backend"

# Create .env.docker file from backend/.env
$backendEnvPath = Join-Path $backendPath ".env"
$backendEnvDockerPath = Join-Path $backendPath ".env.docker"

if (Test-Path $backendEnvPath) {
    Write-Host "Found backend .env file. Creating Docker secret..." -ForegroundColor Blue
    Get-Content $backendEnvPath | Where-Object { $_ -match '\S' -and $_ -notmatch '^#' } | Set-Content $backendEnvDockerPath
} else {
    Write-Host "Warning: No .env file found for backend at $backendEnvPath" -ForegroundColor Yellow
    # Create an empty .env.docker file
    New-Item -Path $backendEnvDockerPath -ItemType File -Force
}

# Build the backend container
Write-Host "Building backend container..." -ForegroundColor Blue
docker build -t "$AcrName.azurecr.io/$BackendImageName`:$ImageTag" -f "$backendPath/Dockerfile" $backendPath
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error building backend container" -ForegroundColor Red
    exit 1
}

# Push the backend container
Write-Host "Pushing backend container to ACR..." -ForegroundColor Blue
docker push "$AcrName.azurecr.io/$BackendImageName`:$ImageTag"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error pushing backend container" -ForegroundColor Red
    exit 1
}

# Clean up temporary env file
Remove-Item -Path $backendEnvDockerPath -Force -ErrorAction SilentlyContinue

# Cancel any existing deployments
Write-Host "Checking for active deployments..." -ForegroundColor Blue
$activeDeployment = az deployment group show --resource-group $ResourceGroupName --name $DeploymentName 2>$null
if ($activeDeployment) {
    $deploymentObject = $activeDeployment | ConvertFrom-Json
    $status = $deploymentObject.properties.provisioningState
    
    if ($status -eq "Running") {
        Write-Host "Found active deployment. Attempting to cancel..." -ForegroundColor Yellow
        az deployment group cancel --resource-group $ResourceGroupName --name $DeploymentName
        Start-Sleep -Seconds 10 # Give Azure some time to cancel the deployment
    }
}

# Deploy Container Apps Environment and Backend App
Write-Host "Deploying Container Apps Environment and Backend App..." -ForegroundColor Blue
Write-Host "This might take several minutes. Please be patient..." -ForegroundColor Yellow

# Change to infra directory for bicep file
Set-Location $scriptPath

$deployment = az deployment group create `
    --resource-group $ResourceGroupName `
    --template-file "deploy-container-apps.bicep" `
    --name $DeploymentName `
    --parameters acrName=$AcrName backendImageName=$BackendImageName imageTag=$ImageTag `
    --query "properties.outputs" `
    --no-wait `
    -o none

# Monitor deployment progress
$startTime = Get-Date
$status = ""

Write-Host "Monitoring deployment progress..." -ForegroundColor Blue
while ($status -ne "Succeeded" -and $status -ne "Failed" -and $status -ne "Canceled") {
    Start-Sleep -Seconds 10
    
    $deployment = az deployment group show --resource-group $ResourceGroupName --name $DeploymentName 2>$null
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
$outputs = az deployment group show --resource-group $ResourceGroupName --name $DeploymentName --query "properties.outputs" -o json | ConvertFrom-Json
$environmentName = $outputs.environmentName.value
$environmentDefaultDomain = $outputs.environmentDefaultDomain.value
$backendFqdn = $outputs.backendFqdn.value

# Display results
Write-Host "Container Apps deployed successfully!" -ForegroundColor Green
Write-Host "Environment Name: $environmentName" -ForegroundColor Blue
Write-Host "Environment Default Domain: $environmentDefaultDomain" -ForegroundColor Blue
Write-Host "Backend URL: https://$backendFqdn" -ForegroundColor Blue

# Test backend health check endpoint
Write-Host "Testing backend API (this may take a moment for the container to start)..." -ForegroundColor Blue
Write-Host "Waiting for 120 seconds before checking health endpoint..." -ForegroundColor Yellow
Start-Sleep -Seconds 120 # Give the container more time to start

try {
    $response = Invoke-RestMethod -Uri "https://$backendFqdn/health" -Method Get -TimeoutSec 120
    Write-Host "Backend API is responding!" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json -Compress)" -ForegroundColor Blue
} catch {
    Write-Host "Warning: Could not connect to backend API. It may still be starting up." -ForegroundColor Yellow
    Write-Host "You can manually check the backend at: https://$backendFqdn/health" -ForegroundColor Yellow
    Write-Host "Error: $_" -ForegroundColor Red
}

# Check container app logs
Write-Host "Checking container app logs..." -ForegroundColor Blue
az containerapp logs show --name dym-backend --resource-group $ResourceGroupName --tail 20

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Verify backend functionality manually by visiting: https://$backendFqdn/health" -ForegroundColor Yellow
Write-Host "2. Add frontend Container App and configure networking between containers" -ForegroundColor Yellow 