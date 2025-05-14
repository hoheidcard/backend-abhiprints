import { Controller } from "@nestjs/common";
import { ProductVariantsService } from "./product-variants.service";

@Controller("product-variants")
export class ProductVariantsController {
  constructor(
    private readonly productVariantsService: ProductVariantsService
  ) {}

  // @Delete(":id")
  // @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  // @Roles(...Object.values(UserRole))
  // @CheckPermissions([PermissionAction.DELETE, "id_cards_stock"])
  // remove(@Param("id") id: string) {
  //   return this.productVariantsService.remove(id);
  // }
}
