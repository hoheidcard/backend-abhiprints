import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductVariantDto } from "./dto/product-variant.dto";
import { ProductVariant } from "./entities/product-variant.entity";

@Injectable()
export class ProductVariantsService {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly repo: Repository<ProductVariant>
  ) {}

  async create(dto: ProductVariantDto[]) {
    if(dto.length>0){
      await this.repo
      .createQueryBuilder()
      .delete()
      .from(ProductVariant)
      .where("idCardsStockId = :idCardsStockId", {
        idCardsStockId: dto[0].idCardsStockId,
      })
      .execute();
    }
    return this.repo.save(dto);
  }
}
