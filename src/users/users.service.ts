import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dtos/users.create.dto';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async create(data: CreateUserDto) {
    try {
      const result = await this.db.query(
        `INSERT INTO "User" (name, email) VALUES ($1, $2) RETURNING *`,
        [data.name, data.email]
      );
      return result.rows[0];
    } catch (error) {
      // Tratamento específico para violação de email único
      if (error.code === '23505') {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  async findAll() {
    const result = await this.db.query('SELECT * FROM "User"');
    return result.rows;
  }

  // Método adicional útil para validação
  async findByEmail(email: string) {
    const result = await this.db.query('SELECT * FROM "User" WHERE email = $1', [email]);
    return result.rows[0];
  }
}