import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() // 👈 no need to add 'api/v1' here
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
