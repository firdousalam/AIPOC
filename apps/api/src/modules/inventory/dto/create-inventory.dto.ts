import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateInventoryDto {
  @IsString()
  productId: string;

  @IsString()
  productName: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  reorderLevel?: number;

  @IsString()
  @IsOptional()
  location?: string;
}

