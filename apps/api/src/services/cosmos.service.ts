import { Injectable, Logger } from '@nestjs/common';
import { CosmosClient, Container } from '@azure/cosmos';
import { DefaultAzureCredential } from '@azure/identity';

@Injectable()
export class CosmosService {
  private client: CosmosClient;
  private readonly logger = new Logger(CosmosService.name);

  constructor() {
    try {
      const credential = new DefaultAzureCredential();
      this.logger.log('Azure Default credential created successfully');

      this.client = new CosmosClient({
        endpoint: process.env.COSMOS_ENDPOINT,
        aadCredentials: credential,
      });
      this.logger.log(
        'Cosmos client initialized with endpoint:',
        process.env.COSMOS_ENDPOINT,
      );
    } catch (error) {
      this.logger.error('Failed to initialize Cosmos client:', error.message);
      throw error;
    }
  }

  private async getContainer(containerId: string): Promise<Container> {
    const database = this.client.database(process.env.COSMOS_DATABASE);
    const { container } = await database.containers.createIfNotExists({
      id: containerId,
      partitionKey: '/id',
    });
    return container;
  }

  async testConnection() {
    try {
      this.logger.log(
        'Testing connection to database:',
        process.env.COSMOS_DATABASE,
      );
      const database = this.client.database(process.env.COSMOS_DATABASE);
      await database.read();
      this.logger.log('Successfully connected to Cosmos DB');
      return 'Successfully connected to Cosmos DB';
    } catch (error) {
      this.logger.error('Connection test failed:', error.message);
      throw new Error(`Failed to connect: ${error.message}`);
    }
  }

  async createDummyData() {
    try {
      const container = await this.getContainer('azuredb');

      const dummyItem = {
        id: new Date().getTime().toString(),
        name: 'Test Item',
        description: 'This is a test item',
        createdAt: new Date().toISOString(),
      };

      const { resource } = await container.items.create(dummyItem);
      this.logger.log('Successfully created dummy data');
      return resource;
    } catch (error) {
      this.logger.error('Failed to create dummy data:', error.message);
      throw new Error(`Failed to create dummy data: ${error.message}`);
    }
  }

  async readDummyData() {
    try {
      const container = this.client
        .database(process.env.COSMOS_DATABASE)
        .container('azuredb');

      const { resources } = await container.items
        .query('SELECT * FROM c')
        .fetchAll();

      this.logger.log(`Successfully retrieved ${resources.length} items`);
      return resources;
    } catch (error) {
      this.logger.error('Failed to read data:', error.message);
      throw new Error(`Failed to read data: ${error.message}`);
    }
  }
}
