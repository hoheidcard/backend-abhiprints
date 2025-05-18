import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { ContactUsService } from './contact-us.service';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import { ContactUsPaginationDto } from './dto/update-contact-us.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../enum';

@Controller('contact-us')
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Post()
  create(@Body() dto: CreateContactUsDto) {
    return this.contactUsService.create(dto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll(@Query() dto: ContactUsPaginationDto) {
    return this.contactUsService.findAll(dto);
  }
}
