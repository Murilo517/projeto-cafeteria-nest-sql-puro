import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor(private configService: ConfigService) {
    const databaseUrl = this.configService.get<string>('DATABASE_URL');
    console.log('DATABASE_URL:', databaseUrl); 

    this.pool = new Pool({
      connectionString: databaseUrl,
    });
  }

  async query(text: string, params?: any[]) {
    return this.pool.query(text, params);
  }

  async onModuleInit() {
    await this.pool.query('SELECT 1');
    console.log('Database connected successfully');
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
