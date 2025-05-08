targetScope = 'subscription'

@description('The location for all resources.')
param location string = 'swedencentral'

// Create the resource group
resource rg 'Microsoft.Resources/resourceGroups@2023-07-01' = {
  name: 'rg-dym-dev2'
  location: location
  tags: {
    environment: 'development'
    project: 'dym'
  }
}

// Deploy Azure OpenAI resources
module openai 'deploy-aoai.bicep' = {
  scope: rg
  name: 'openai-deployment'
  params: {
    location: location
    aiserviceaccountname: 'dym-aoai-dev66'
    customDomainName: 'dym-aoai-dev'
    modeldeploymentname: 'gpt-4o'
    model: 'gpt-4o'
    capacity: 10
    sku: 'S0'
  }
}

// Deploy Azure Container Registry
module acr 'deploy-acr.bicep' = {
  scope: rg
  name: 'acr-deployment'
  params: {
    location: location
    acrName: 'dymacrdev66'
    acrSku: 'Basic'
    adminUserEnabled: true
  }
}

// Outputs
output resourceGroupName string = rg.name
output openAiEndpoint string = openai.outputs.endpoint
output openAiAccountId string = openai.outputs.aiServiceAccountId
output deploymentId string = openai.outputs.deploymentId
output acrLoginServer string = acr.outputs.acrLoginServer
output acrName string = acr.outputs.acrName 
