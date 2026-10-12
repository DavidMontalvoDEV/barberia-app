// Ejecuta archivos .sql en una base de datos remota (por ejemplo Aiven).
// Uso: node database/aplicar.js '<URI de conexion>' archivo1.sql archivo2.sql
const fs = require('fs');
const mysql = require('mysql2/promise');

async function main() {
  const [uri, ...archivos] = process.argv.slice(2);
  if (!uri || archivos.length === 0) {
    console.log("Uso: node database/aplicar.js '<URI>' archivo1.sql [archivo2.sql ...]");
    process.exit(1);
  }

  const u = new URL(uri);
  const conn = await mysql.createConnection({
    host: u.hostname,
    port: Number(u.port) || 3306,
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.replace('/', '') || undefined,
    ssl: { rejectUnauthorized: false },
    multipleStatements: true,
  });

  for (const archivo of archivos) {
    let sql = fs.readFileSync(archivo, 'utf8');
    // En la nube la base de datos ya viene creada: se quitan CREATE DATABASE y USE
    sql = sql.replace(/^\s*(USE\s+\S+|CREATE\s+DATABASE[^;]*);\s*$/gim, '');
    await conn.query(sql);
    console.log('Aplicado correctamente:', archivo);
  }
  await conn.end();
}

main().catch((e) => {
  console.error('ERROR:', e.message);
  process.exit(1);
});
