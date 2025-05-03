import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateOrderDto } from './dtos/orders.create.dto';
import { UpdateStatusDto } from './dtos/orders.update.dto';
import { OrderStatus } from './enums/orders.enum';


@Injectable()
export class OrdersService {
  constructor(private readonly db: DatabaseService) {}

  async create(data: CreateOrderDto) {
    const query = `
      INSERT INTO "Order" (quantity, notes, status, "userId", "productId", client)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [
      data.quantity,
      data.notes,
      OrderStatus.PREPARING,
      data.userId,
      data.productId,
      data.client,
    ];

    const result = await this.db.query(query, values);
    return this.enrichOrderData(result.rows[0]);
  }

  async findAll() {
    const query = `
      SELECT o.*, 
             u.name as "userName", 
             p.name as "productName", 
             p.price as "productPrice"
      FROM "Order" o
      JOIN "User" u ON o."userId" = u.id
      JOIN "Product" p ON o."productId" = p.id
    `;
    const result = await this.db.query(query);
    return result.rows.map(this.enrichOrderData);
  }

  async updateStatus(id: number, data: UpdateStatusDto) {
    const query = `
      UPDATE "Order" 
      SET status = $1
      WHERE id = $2
      RETURNING *
    `;
    const result = await this.db.query(query, [data.status, id]);
    
    if (result.rows.length === 0) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    
    return this.enrichOrderData(result.rows[0]);
  }

  async findByStatus(status: OrderStatus) {
    const query = `
      SELECT o.*, 
             u.name as "userName", 
             p.name as "productName", 
             p.price as "productPrice"
      FROM "Order" o
      JOIN "User" u ON o."userId" = u.id
      JOIN "Product" p ON o."productId" = p.id
      WHERE o.status = $1
    `;
    const result = await this.db.query(query, [status]);
    return result.rows.map(this.enrichOrderData);
  }

  private enrichOrderData(order: any) {
    return {
      ...order,
      user: order.userName ? { name: order.userName } : null,
      product: order.productName ? { 
        name: order.productName, 
        price: order.productPrice 
      } : null,
    };
  }
}