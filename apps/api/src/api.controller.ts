import { Controller, Get } from '@nestjs/common';
import { CosmosService } from './services/cosmos.service';

@Controller()
export class ApiController {
  constructor(private readonly cosmosService: CosmosService) {}

  @Get('test-cosmos')
  async testCosmosConnection() {
    return await this.cosmosService.testConnection();
  }
}
