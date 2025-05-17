// import { Controller, Get } from '@nestjs/common';
// import { AppService } from './app.service';

// @Controller()
// export class AppController {
//   constructor(private readonly appService: AppService) {}

//   @Get()
//   getHello(): string {
//     return this.appService.getHello();
//   }
// }



import { Controller, Get } from '@nestjs/common';

@Controller('api/v1') // Ensures all routes are under `/api/v1`
export class AppController {
  @Get()
  getHello(): string {
    return 'Hello Nest!';
  }

  @Get('health')
  checkHealth(): string {
    return 'API is running smoothly!';
  }
}
