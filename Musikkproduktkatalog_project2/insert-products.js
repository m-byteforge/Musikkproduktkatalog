//insert-products.js

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
    { name: 'Jet Guitars JT-300 Blonde Left hand', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', images_name: '1194644', price: 32950.00 },
    { name: 'Jet Guitars JT-300 Sonic Blue R', description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', images_name: '1194643', price: 30895 },
    { name: 'Jet Guitars JT-300 Blonde', description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', images_name: '1194642', price: 4917 },
    { name: 'Jet Guitars JS-850 RLC (Reliced) Red', description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', images_name: '1194641', price: 16907 },
    { name: 'Jet Guitars JS-800 RLC (Reliced) Black', description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', images_name: '1194640', price: 25195 },
    { name: 'Jet Guitars JS-700 Red', description: 'Nunc interdum augue id magna semper, a ultrices purus blandit.', images_name: '1194639', price: 25195 },
    { name: 'Jet Guitars JS-700 Matt Black', description: 'Vivamus eu sem nec libero efficitur tristique id eu orci.', images_name: '1194638', price: 22695 },
    { name: 'Jet Guitars JS-700 Copper', description: 'Fusce vestibulum justo vel metus cursus, id blandit turpis varius.', images_name: '1194637', price: 22695 },
    { name: 'Jet Guitars JS-600 Trans Red', description: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.', images_name: '1194636', price: 777.5 },
    { name: 'Jet Guitars JS-600 Sunburst', description: 'Maecenas vel justo vel libero auctor iaculis non at tellus.', images_name: '1194635', price: 30895 },
    { name: 'Jet Guitars JS-500 Silver Sparkle', description: 'Curabitur in erat vel velit rhoncus laoreet non nec elit.', images_name: '1194634', price: 4917 },
  
];

const insertProducts = async () => {
    const client = await pool.connect();
  
    try {
      await client.query('BEGIN'); // Start a transaction
  
      for (const product of products) {
        // Check if product already exists in the database
        const existingProduct = await client.query('SELECT * FROM products WHERE name = $1', [product.name]);
        
        if (existingProduct.rows.length === 0) {
          // If product doesn't exist, insert it into the database
          const queryText = `
            INSERT INTO products (name, description, images_name, price)
            VALUES ($1, $2, $3, $4)
          `;
          const values = [product.name, product.description, product.images_name, product.price];
          await client.query(queryText, values);
        } else {
          // If product already exists, update its details
          const existingProductId = existingProduct.rows[0].id;
          const queryText = `
            UPDATE products 
            SET description = $1, images_name = $2, price = $3
            WHERE id = $4
          `;
          const values = [product.description, product.images_name, product.price, existingProductId];
          await client.query(queryText, values);
        }
      }
  
      await client.query('COMMIT'); 
      console.log('Products inserted or updated successfully.');
    } catch (err) {
      await client.query('ROLLBACK'); 
      console.error('Error inserting/updating products:', err);
    } finally {
      client.release(); 
      pool.end(); 
    }
  };
  
  insertProducts();