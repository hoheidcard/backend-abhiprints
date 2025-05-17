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


@Controller() // Ensures the route is under `/api/v1`
export class AppController {
  @Get('health')
  checkHealth(): string {
    return 'API is running smoothly!';
  }
}

