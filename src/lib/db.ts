import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Password$123',
  database: process.env.DB_DATABASE || 'social_dashboard',
  ssl: process.env.DB_SSL ? { rejectUnauthorized: false } : undefined
};

// Log connection attempt without exposing sensitive info
console.log(`🔌 Attempting to connect to database at ${dbConfig.host}...`);

let pool: mysql.Pool | null = null;

export async function connectToDatabase() {
  if (pool) {

    return pool;
  }

  try {
    pool = mysql.createPool(dbConfig);
    
    // Test the connection
    const connection = await pool.getConnection();

    connection.release();
    
    return pool;
  } catch (error) {
    console.error('❌ Error connecting to database:', error);
    throw error;
  }
}

// Get a connection from the pool
export async function getConnection() {
  const pool = await connectToDatabase();
  return pool.getConnection();
}
