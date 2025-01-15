import { Controller, Get, Post } from '@nestjs/common';
import { CosmosService } from './services/cosmos.service';

@Controller()
export class ApiController {
  constructor(private readonly cosmosService: CosmosService) {}

  @Get('test-cosmos')
  async testCosmosConnection() {
    return await this.cosmosService.testConnection();
  }

  @Get('read-dummy')
  async readDummyData() {
    return await this.cosmosService.readDummyData();
  }

  @Post('create-dummy')
  async createDummyData() {
    return await this.cosmosService.createDummyData();
  }
}
