import { IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class OrderDto {
  @IsNotEmpty()
  client: string;

  @IsInt()
  quantity: number;

  @IsOptional()
  notes?: string;

  @IsInt()
  userId: number;

  @IsInt()
  productId: number;
}
