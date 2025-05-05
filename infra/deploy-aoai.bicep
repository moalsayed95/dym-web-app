@description('This is the name of your AI Service Account')
param aiserviceaccountname string = 'dym-aoai-dev'

@description('Custom domain name for the endpoint')
param customDomainName string = 'dym-aoai-dev.cognitiveservices.azure.com'

@description('Name of the deployment')
param modeldeploymentname string = 'gpt-4o'

@description('The model being deployed')
param model string = 'gpt-4o'

@description('Capacity for specific model used')
param capacity int = 80

@description('Location for all resources.')
param location string

@allowed([
  'S0'
])
param sku string = 'S0'

// Cognitive Services Account
resource cognitiveServices 'Microsoft.CognitiveServices/accounts@2023-05-01' = {
  name: aiserviceaccountname
  location: location
  kind: 'OpenAI'
  sku: {
    name: sku
  }
  properties: {
    customSubDomainName: customDomainName
    publicNetworkAccess: 'Enabled'
  }
}

// Model Deployment
resource modelDeployment 'Microsoft.CognitiveServices/accounts/deployments@2023-05-01' = {
  parent: cognitiveServices
  name: modeldeploymentname
  sku: {
    name: 'Standard'
    capacity: capacity
  }
  properties: {
    model: {
      format: 'OpenAI'
      name: model
    }
    raiPolicyName: 'Microsoft.Default'
  }
}

// Outputs
output endpoint string = cognitiveServices.properties.endpoint
output aiServiceAccountId string = cognitiveServices.id
output deploymentId string = modelDeployment.id

