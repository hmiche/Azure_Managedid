import { Injectable, Logger } from '@nestjs/common';
import { CosmosClient } from '@azure/cosmos';
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
}
