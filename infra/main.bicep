targetScope = 'subscription'

@description('The location for all resources.')
param location string = 'eastus'

// Create the resource group
resource rg 'Microsoft.Resources/resourceGroups@2023-07-01' = {
  name: 'rg-dym-dev'
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
    aiserviceaccountname: 'dym-aoai-dev'
    customDomainName: 'dym-aoai-dev'
    modeldeploymentname: 'gpt-4o'
    model: 'gpt-4o'
    capacity: 30
    sku: 'S0'
  }
}

// Outputs
output resourceGroupName string = rg.name
output openAiEndpoint string = openai.outputs.endpoint
output openAiAccountId string = openai.outputs.aiServiceAccountId
output deploymentId string = openai.outputs.deploymentId 
