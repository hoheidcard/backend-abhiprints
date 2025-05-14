import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';
import { BookCategory } from 'src/book-category/entities/book-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, BookCategory]),
    AuthModule,
    MulterModule.register(),
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
