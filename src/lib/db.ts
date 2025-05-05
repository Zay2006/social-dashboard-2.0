import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: '127.0.0.1',      // Hardcoded for local development
  user: 'root',           // Default MySQL user
  password: 'Password$123', // Your MySQL password
  database: 'social_dashboard'
};

console.log('Using database configuration:', {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database
});

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
