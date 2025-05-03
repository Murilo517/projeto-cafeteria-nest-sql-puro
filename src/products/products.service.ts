import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateProductDto } from './dtos/products.create.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly db: DatabaseService) {}

  async create(data: CreateProductDto) {
    const query = `
      INSERT INTO "Product" (name, description, price) 
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [data.name, data.description, data.price];
    
    try {
      const result = await this.db.query(query, values);
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('Product name must be unique');
      }
      throw error;
    }
  }

  async findAll() {
    const query = 'SELECT * FROM "Product" ORDER BY name';
    const result = await this.db.query(query);
    return result.rows;
  }

  // Método adicional útil
  async findById(id: number) {
    const query = 'SELECT * FROM "Product" WHERE id = $1';
    const result = await this.db.query(query, [id]);
    if (result.rows.length === 0) {
      throw new Error('Product not found');
    }
    return result.rows[0];
  }
}