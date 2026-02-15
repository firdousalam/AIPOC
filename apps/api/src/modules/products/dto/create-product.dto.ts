import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { VALIDATION_MESSAGES, VALIDATION_CONSTRAINTS } from '../../../utils/constants';

export class CreateProductDto {
  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.PRODUCT.NAME_INVALID })
  name?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.PRODUCT.DESCRIPTION_INVALID })
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: VALIDATION_MESSAGES.PRODUCT.PRICE_INVALID })
  @Min(VALIDATION_CONSTRAINTS.PRODUCT.PRICE_MIN, {
    message: VALIDATION_MESSAGES.PRODUCT.PRICE_MIN
  })
  price?: number;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.PRODUCT.CATEGORY_INVALID })
  category?: string;

  @IsOptional()
  @IsNumber({}, { message: VALIDATION_MESSAGES.PRODUCT.STOCK_INVALID })
  @Min(VALIDATION_CONSTRAINTS.PRODUCT.STOCK_MIN, {
    message: VALIDATION_MESSAGES.PRODUCT.STOCK_MIN
  })
  stock?: number;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.PRODUCT.DISTRIBUTOR_INVALID })
  distributor?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.PRODUCT.COMPANY_INVALID })
  company?: string;

  @IsOptional()
  @IsNumber({}, { message: VALIDATION_MESSAGES.PRODUCT.MRP_INVALID })
  @Min(VALIDATION_CONSTRAINTS.PRODUCT.PRICE_MIN, {
    message: VALIDATION_MESSAGES.PRODUCT.MRP_MIN
  })
  mrp?: number;

  @IsOptional()
  @IsNumber({}, { message: VALIDATION_MESSAGES.PRODUCT.SALE_PRICE_INVALID })
  @Min(VALIDATION_CONSTRAINTS.PRODUCT.PRICE_MIN, {
    message: VALIDATION_MESSAGES.PRODUCT.SALE_PRICE_MIN
  })
  salePrice?: number;

  @IsOptional()
  @IsNumber({}, { message: VALIDATION_MESSAGES.PRODUCT.DISCOUNT_INVALID })
  @Min(VALIDATION_CONSTRAINTS.PRODUCT.DISCOUNT_MIN, {
    message: VALIDATION_MESSAGES.PRODUCT.DISCOUNT_MIN
  })
  @Max(VALIDATION_CONSTRAINTS.PRODUCT.DISCOUNT_MAX, {
    message: VALIDATION_MESSAGES.PRODUCT.DISCOUNT_MAX
  })
  discount?: number;
}

