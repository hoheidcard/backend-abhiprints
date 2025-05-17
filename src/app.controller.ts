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



import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api/v1') // Now explicitly routes under `/api/v1`
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    try {
      return this.appService.getHello();
    } catch (error) {
      throw new HttpException('Error fetching data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('health')
  checkHealth(): string {
    return 'API is running smoothly!';
  }
}

