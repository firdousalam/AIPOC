import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate, IsOptional, Min } from 'class-validator';

export class CreateSaleDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty()
  @IsString()
  productName: string;

  @ApiProperty({ minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ minimum: 0 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ minimum: 0 })
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @ApiProperty({ example: '2024-01-15T00:00:00.000Z' })
  @IsDate()
  saleDate: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

