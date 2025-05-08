# Configuration
$ACR_NAME = "dymacrdev55"
$ACR_LOGIN_SERVER = "$ACR_NAME.azurecr.io"
$BACKEND_IMAGE_NAME = "dym-backend"
$FRONTEND_IMAGE_NAME = "dym-frontend"
$TAG = "latest"

# Ensure we're in the right directory
$scriptPath = $PSScriptRoot
$projectRoot = Split-Path $scriptPath -Parent

# Change to project root directory
Set-Location $projectRoot

Write-Host "Starting deployment process..." -ForegroundColor Blue
Write-Host "Project root: $projectRoot" -ForegroundColor Blue

# Verify directories exist
if (-not (Test-Path "app/backend")) {
    Write-Host "Error: Backend directory not found at $projectRoot/app/backend" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "app/frontend")) {
    Write-Host "Error: Frontend directory not found at $projectRoot/app/frontend" -ForegroundColor Red
    exit 1
}

# Verify ACR exists
try {
    Write-Host "Verifying ACR exists..." -ForegroundColor Blue
    $acr = az acr show --name $ACR_NAME --query name -o tsv 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Azure Container Registry '$ACR_NAME' not found. Please verify the name." -ForegroundColor Red
        Write-Host "Available ACRs in your subscription:" -ForegroundColor Yellow
        az acr list --query "[].name" -o tsv
        exit 1
    }
} catch {
    Write-Host "Error accessing Azure Container Registry. Please ensure you're logged into Azure CLI." -ForegroundColor Red
    exit 1
}

# Login to Azure Container Registry
Write-Host "Logging into Azure Container Registry..." -ForegroundColor Blue
az acr login --name $ACR_NAME

# Function to build and push an image
function Build-And-Push {
    param(
        [string]$ServiceName,
        [string]$DockerfilePath,
        [string]$BuildContext
    )
    
    if (-not (Test-Path $DockerfilePath)) {
        Write-Host "Error: Dockerfile not found at $DockerfilePath" -ForegroundColor Red
        return $false
    }

    Write-Host "Building $ServiceName image..." -ForegroundColor Blue
    docker build -t "$ACR_LOGIN_SERVER/$ServiceName`:$TAG" -f $DockerfilePath $BuildContext
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error building $ServiceName image" -ForegroundColor Red
        return $false
    }
    
    Write-Host "Pushing $ServiceName image to ACR..." -ForegroundColor Blue
    docker push "$ACR_LOGIN_SERVER/$ServiceName`:$TAG"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error pushing $ServiceName image" -ForegroundColor Red
        return $false
    }
    
    Write-Host "Successfully pushed $ServiceName image to ACR" -ForegroundColor Green
    return $true
}

# Process backend
Write-Host "Processing backend..." -ForegroundColor Blue
$backendEnvPath = Join-Path $projectRoot "app/backend/.env"
$backendEnvDockerPath = Join-Path $projectRoot "app/backend/.env.docker"

if (Test-Path $backendEnvPath) {
    Write-Host "Found backend .env file. Creating Docker secret..." -ForegroundColor Blue
    Get-Content $backendEnvPath | Where-Object { $_ -match '\S' -and $_ -notmatch '^#' } | Set-Content $backendEnvDockerPath
} else {
    Write-Host "Warning: No .env file found for backend at $backendEnvPath" -ForegroundColor Yellow
    New-Item -Path $backendEnvDockerPath -ItemType File -Force
}

$backendSuccess = Build-And-Push -ServiceName $BACKEND_IMAGE_NAME `
                                -DockerfilePath (Join-Path $projectRoot "app/backend/Dockerfile") `
                                -BuildContext (Join-Path $projectRoot "app/backend")

# Clean up temporary env file
Remove-Item -Path $backendEnvDockerPath -Force -ErrorAction SilentlyContinue

# Process frontend
Write-Host "Processing frontend..." -ForegroundColor Blue
$frontendSuccess = Build-And-Push -ServiceName $FRONTEND_IMAGE_NAME `
                                 -DockerfilePath (Join-Path $projectRoot "app/frontend/Dockerfile") `
                                 -BuildContext (Join-Path $projectRoot "app/frontend")

if ($backendSuccess -and $frontendSuccess) {
    Write-Host "Deployment completed successfully!" -ForegroundColor Green
    Write-Host "Your images are available at:" -ForegroundColor Blue
    Write-Host "Backend: $ACR_LOGIN_SERVER/$BACKEND_IMAGE_NAME`:$TAG"
    Write-Host "Frontend: $ACR_LOGIN_SERVER/$FRONTEND_IMAGE_NAME`:$TAG"
} else {
    Write-Host "Deployment completed with errors. Please check the logs above." -ForegroundColor Red
    exit 1
} 