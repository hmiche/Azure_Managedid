import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { CosmosService } from './services/cosmos.service';
import { ConfigModule } from '@nestjs/config';
import { azureConfig } from './config/azure.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [azureConfig],
      envFilePath: ['apps/api/src/.env'],
    }),
  ],
  controllers: [ApiController],
  providers: [CosmosService],
})
export class ApiModule {}
