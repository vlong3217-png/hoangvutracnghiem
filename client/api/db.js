import pg from 'pg';

const { Pool } = pg;

// Kết nối trực tiếp tới Neon PostgreSQL thông qua biến môi trường hoặc connection string dự phòng
const connectionString = process.env.DATABASE_URL || 
  "postgresql://neondb_owner:npg_gLQvr8aCNUE0@ep-little-sky-aogy4dnb-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

let pool;

export function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }
  return pool;
}

