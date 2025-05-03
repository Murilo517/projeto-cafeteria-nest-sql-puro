import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/orders.create.dto';
import { UpdateStatusDto } from './dtos/orders.update.dto';
import { OrderStatus } from './enums/orders.enum';


@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number, 
    @Body() dto: UpdateStatusDto,
  ) {
    return this.orderService.updateStatus(id, dto);
  }

  @Get('filter/status')
  findByStatus(
    @Query('status', new ParseEnumPipe(OrderStatus)) status: OrderStatus,
  ) {
    return this.orderService.findByStatus(status);
  }
}
