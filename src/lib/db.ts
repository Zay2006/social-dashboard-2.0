import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

let pool: mysql.Pool | null = null;

export async function connectToDatabase() {
  if (pool) {
    console.log('🟢 Using existing database connection pool');
    return pool;
  }

  try {
    pool = mysql.createPool(dbConfig);
    
    // Test the connection
    const connection = await pool.getConnection();
    console.log('🟢 Database connected successfully');
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
