require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true,     // las fechas llegan como texto "2026-10-20 10:00:00"
  decimalNumbers: true,  // los precios llegan como número y no como texto
  // En la nube (Aiven) la conexión exige SSL. En tu PC (XAMPP) no se usa.
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

module.exports = pool;
