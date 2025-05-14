import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubPartnerDetailsService } from './sub-partner-details.service';
import { CreateSubPartnerDetailDto } from './dto/create-sub-partner-detail.dto';
import { UpdateSubPartnerDetailDto } from './dto/update-sub-partner-detail.dto';

@Controller('sub-partner-details')
export class SubPartnerDetailsController {
  constructor(private readonly subPartnerDetailsService: SubPartnerDetailsService) {}

  @Post()
  create(@Body() createSubPartnerDetailDto: CreateSubPartnerDetailDto) {
    return this.subPartnerDetailsService.create(createSubPartnerDetailDto);
  }

  @Get()
  findAll() {
    return this.subPartnerDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subPartnerDetailsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubPartnerDetailDto: UpdateSubPartnerDetailDto) {
    return this.subPartnerDetailsService.update(+id, updateSubPartnerDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subPartnerDetailsService.remove(+id);
  }
}
