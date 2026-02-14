import { IsString, IsNumber, IsDate, IsOptional, Min } from 'class-validator';

export class CreateSaleDto {
  @IsString()
  productId: string;

  @IsString()
  productName: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  totalAmount: number;

  @IsDate()
  saleDate: Date;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

