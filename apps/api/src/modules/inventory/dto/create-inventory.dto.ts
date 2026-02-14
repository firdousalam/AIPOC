import { IsString, IsNumber, Min } from 'class-validator';

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
  reorderLevel: number;
}

