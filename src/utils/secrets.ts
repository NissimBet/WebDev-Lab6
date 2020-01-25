import dotenv from 'dotenv';
import fs from 'fs';

if (fs.existsSync('.env')) {
  dotenv.config({ path: '.env' });
}

export const SESSION_SECRET = process.env['SESSION_SECRET'];
export const MONGODB_URI = process.env['MONGO_URI'];
export const MONGO_USER = process.env['MONGO_USER'];
export const MONGO_PASS = process.env['MONGO_PASS'];
export const MONGO_DATABASE = process.env['MONGO_DATABASE'];
