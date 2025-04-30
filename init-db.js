const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres', // Connect to default database first
  password: 'pheobeparis',
  port: 5432,
});

async function initializeDatabase() {
  const client = await pool.connect();
  try {
    // Create database if it doesn't exist
    await client.query('CREATE DATABASE globe_dater');
    console.log('Database created successfully');
  } catch (err) {
    if (err.code === '42P04') { // Database already exists
      console.log('Database already exists');
    } else {
      console.error('Error creating database:', err);
      process.exit(1);
    }
  } finally {
    client.release();
  }

  // Connect to the new database
  const dbPool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'globe_dater',
    password: 'pheobeparis',
    port: 5432,
  });

  const dbClient = await dbPool.connect();
  try {
    // Create table
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS fact (
        fact_id INT PRIMARY KEY,
        question VARCHAR(256),
        start_date DATE,
        end_date DATE,
        picture_path VARCHAR(256)
      )
    `);
    console.log('Table created successfully');

    // Read and execute the data.sql file
    const dataSql = fs.readFileSync(path.join(__dirname, 'data.sql'), 'utf8');
    await dbClient.query(dataSql);
    console.log('Data imported successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  } finally {
    dbClient.release();
    dbPool.end();
  }
}

initializeDatabase().catch(console.error); 