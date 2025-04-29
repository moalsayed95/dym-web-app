from azure.cosmos import CosmosClient, PartitionKey
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

class CosmosFlatListingService:
    def __init__(self, endpoint=None, key=None, database_name=None, container_name=None):
        # Initialize Cosmos DB client with environment variables or passed parameters
        self.endpoint = endpoint or os.getenv('COSMOS_ENDPOINT')
        self.key = key or os.getenv('COSMOS_KEY')
        self.database_name = database_name or os.getenv('DATABASE_NAME')
        self.container_name = container_name or os.getenv('CONTAINER_NAME')

        if not all([self.endpoint, self.key, self.database_name, self.container_name]):
            raise ValueError("Missing required Cosmos DB configuration. Please check environment variables.")

        # Initialize Cosmos DB client
        self.client = CosmosClient(self.endpoint, credential=self.key)

        # Get or create database
        self.database = self.client.create_database_if_not_exists(id=self.database_name)

        # Get or create container with partition key
        self.container = self.database.create_container_if_not_exists(
            id=self.container_name,
            partition_key=PartitionKey(path="/location")
        )

    def save_flat_listing(self, listing_data):
        # Insert a new listing or update if it exists
        response = self.container.upsert_item(body=listing_data)
        return response

    def query_flat_listings(self, location):
        # Query listings by location (partition key)
        query = f"SELECT * FROM c WHERE c.location = @location"
        parameters = [{"name": "@location", "value": location}]
        items = list(self.container.query_items(
            query=query,
            parameters=parameters,
            enable_cross_partition_query=False  # Ensure efficient partitioned queries
        ))
        return items

# Example usage
if __name__ == "__main__":
    # Sample data
    sample_listing = {
        "id": "1",
        "title": "Cozy Studio in City Center",
        "description": "A cozy studio apartment in the heart of Vienna...",
        "location": "Innere Stadt",  # Partition key value
        "lat": 48.2082,
        "lng": 16.3738,
        "contact": "studio.central@mail.com",
        "price": 850,
        "rooms": 1,
        "size": 35,
        "floor": 3,
        "availability": "Available",
        "furnished": True,
        "pets_allowed": False,
        "smoking_allowed": False,
        "elevator": True,
        "balcony": False,
        "deposit": 2000
    }

    # Initialize the service using environment variables
    service = CosmosFlatListingService()

    # Save the listing
    created_item = service.save_flat_listing(sample_listing)
    print("Item created:", created_item)

    # Query listings
    location_query = "Innere Stadt"
    results = service.query_flat_listings(location_query)
    print("Listings in location:", results) 