const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Set up the PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Array of products to insert
const products = [
  
  { name: 'Jet Guitars JT-300 Blonde Left hand', description: 'Description 1', images_name: '1194644', price: 32950.00 },
  { name: 'Jet Guitars JT-300 Sonic Blue R', description: 'Description 2', images_name: '1194643', price: 30895 },
  { name: 'Jet Guitars JT-300 Blonde', description: 'Description 3', images_name: '1194642', price: 4917 },
  { name: 'Jet Guitars JS-850 RLC (Reliced) Red', description: 'Description 4', images_name: '1194641', price: 16907 },
  { name: 'Jet Guitars JS-800 RLC (Reliced) Black', description: 'Description 5', images_name: '1194640', price: 25195 },
  { name: 'Jet Guitars JS-700 Red', description: 'Description 6', images_name: '1194639', price: 25195 },
  { name: 'Jet Guitars JS-700 Matt Black', description: 'Description 7', images_name: '1194638', price: 22695 },
  { name: 'Jet Guitars JS-700 Copper', description: 'Description 8', images_name: '1194637', price: 22695 },
  { name: 'Jet Guitars JS-600 Trans Red', description: 'Description 9', images_name: '1194636', price: 777.5 },
  { name: 'Jet Guitars JS-600 Sunburst', description: 'Description 10', images_name: '1194635', price: 30895 },
  { name: 'Jet Guitars JS-500 Silver Sparkle', description: 'Description 11', images_name: '1194634', price: 4917 },
];

// Function to insert products into the database
const insertProducts = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Start a transaction

    for (const product of products) {
      const queryText = `
        INSERT INTO products (name, description, images_name, price)
        VALUES ($1, $2, $3, $4)
      `;
      const values = [product.name, product.description, product.images_name, product.price];

      await client.query(queryText, values);
    }

    await client.query('COMMIT'); // Commit the transaction
    console.log('Products inserted successfully.');
  } catch (err) {
    await client.query('ROLLBACK'); // Rollback the transaction if an error occurs
    console.error('Error inserting products:', err);
  } finally {
    client.release(); // Release the client back to the pool
    pool.end(); // Close the pool (optional, depends on your application)
  }
};

insertProducts();
