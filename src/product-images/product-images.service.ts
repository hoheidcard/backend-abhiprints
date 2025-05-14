import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductFileType } from "src/enum";
import { Repository } from "typeorm";
import { ProductImage } from "./entities/product-image.entity";

@Injectable()
export class ProductImagesService {
  constructor(
    @InjectRepository(ProductImage)
    private readonly repo: Repository<ProductImage>
  ) {}

  async create(idCardsStockId: string, image: string, type: ProductFileType) {
    const obj = Object.create({
      idCardsStockId,
      file: process.env.HOC_CDN_LINK + image,
      fileName: image,
      type: type,
    });
    return this.repo.save(obj);
  }

  async findOne(id: string) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException("Image not found!");
    }
    return result;
  }

  async find(id: string) {
    return this.repo.count({ where: { idCardsStockId:id } });
  }

  async remove(id: string) {
    const result = await this.repo.findOne({ where: { id: id } });
    if (!result) {
      throw new NotFoundException("Image not found!");
    }
    return this.repo.remove(result);
  }
}
