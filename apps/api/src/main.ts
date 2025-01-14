import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { azureConfig } from './config/azure.config';
import { DefaultAzureCredential } from '@azure/identity';
import { CosmosClient } from '@azure/cosmos';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);

  // Initialize Cosmos DB client with Managed Identity
  const cosmosClient = new CosmosClient({
    endpoint: process.env.COSMOS_ENDPOINT,
    aadCredentials: new DefaultAzureCredential(),
  });

  // Verify connection
  try {
    const database = cosmosClient.database(process.env.COSMOS_DATABASE);
    await database.read(); // This will verify if we can access the database
    console.log('Successfully connected to Cosmos DB');
  } catch (error) {
    console.error('Failed to connect to Cosmos DB:', error);
  }

  await app.listen(process.env.port ?? 3000);
  console.log(`Server is running on port ${process.env.port ?? 3000}`);
  console.log(`Cosmos DB endpoint: ${process.env.COSMOS_ENDPOINT}`);
  console.log(`Cosmos DB database: ${process.env.COSMOS_DATABASE}`);
}

bootstrap();
