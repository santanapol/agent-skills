import dotenv from 'dotenv';

process.env.NODE_ENV = 'test';
dotenv.config();

if (!process.env.DB_NAME) {
  process.env.DB_NAME = 'items_test';
}
