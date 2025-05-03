import { Body, Controller, Get, Post, HttpException, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/products.create.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post()
  async create(@Body() dto: CreateProductDto) {
    try {
      return await this.productService.create(dto);
    } catch (error) {
      if (error.message === 'Product name must be unique') {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  async findAll() {
    return await this.productService.findAll();
  }
}