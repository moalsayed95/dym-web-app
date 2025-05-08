# DYM Web App - Azure Deployment

This directory contains the infrastructure as code (IaC) and deployment scripts for deploying the DYM Web App to Azure.

## Deployment Architecture

The application is deployed using Azure Container Apps, with separate container apps for the frontend and backend, both pulling container images from Azure Container Registry.

## Files Overview

### Bicep Templates

- `main.bicep` - Main entry point that creates the resource group and calls other modules
- `deploy-acr.bicep` - Deploys Azure Container Registry for storing container images
- `deploy-aoai.bicep` - Deploys Azure OpenAI resources
- `deploy-container-apps.bicep` - Deploys Container Apps Environment and container apps

### PowerShell Scripts

- `deploy-containers.ps1` - Builds and pushes container images to ACR
- `deploy-env.ps1` - Deploys just the Container Apps Environment
- `deploy-backend.ps1` - Deploys the Container Apps Environment and backend container

## Deployment Steps

Follow these steps in order to deploy the application:

### 1. Deploy Azure Infrastructure

Deploy the base Azure resources (Resource Group, ACR, Azure OpenAI):

```powershell
# Login to Azure
az login

# Deploy at subscription level
az deployment sub create --location <region> --template-file main.bicep
```

This creates:
- Resource group: `rg-dym-dev1`
- Azure Container Registry: `dymacrdev55`
- Azure OpenAI instance: `dym-aoai-dev55`

### 2. Build and Push Containers

Build your local containers and push them to ACR:

```powershell
# From the project root
./infra/deploy-containers.ps1
```

This script:
- Verifies ACR exists
- Logs into ACR
- Builds frontend and backend containers
- Pushes both to ACR

### 3. Deploy Container Apps Environment

Deploy the foundational environment for Container Apps:

```powershell
# From the infra directory
cd infra
./deploy-env.ps1
```

This script:
- Deploys a Log Analytics workspace
- Creates a Container Apps Environment
- Sets up logging and monitoring

### 4. Deploy Backend Container App

Deploy the backend API as a Container App:

```powershell
# From the infra directory
cd infra
./deploy-backend.ps1
```

This script:
- Verifies prerequisites (resource group, ACR, container image)
- Deploys the Container Apps Environment (if not already deployed)
- Deploys the backend container app with:
  - External ingress on port 8765
  - System-assigned identity for ACR access
  - Auto-scaling configuration

### Next Steps

After completing these steps, you'll have a working backend container app deployed to Azure Container Apps. The next step would be to deploy the frontend container app and configure networking between them.

## Troubleshooting

- If the backend health check fails, it might still be starting up. Wait a few minutes and try again.
- Verify your container images in ACR: `az acr repository list --name dymacrdev55 --output table`
- Check Container App logs in the Azure Portal or via: `az containerapp logs show --name dym-backend --resource-group rg-dym-dev` 