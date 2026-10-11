const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');

const httpError = (status, message) => Object.assign(new Error(message), { status });

async function registrar({ nombre, email, telefono, password }) {
  const [existe] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
  if (existe.length) throw httpError(409, 'El correo ya está registrado');

  const hash = await bcrypt.hash(password, 10);
  // Todo registro público es "cliente". Barberos y admin los crea un admin.
  const [result] = await db.query(
    'INSERT INTO usuarios (nombre, email, telefono, password_hash, rol) VALUES (?, ?, ?, ?, ?)',
    [nombre, email, telefono || null, hash, 'cliente']
  );
  return { id: result.insertId, nombre, email, rol: 'cliente' };
}

async function login({ email, password }) {
  const [rows] = await db.query(
    'SELECT id, nombre, email, password_hash, rol, activo FROM usuarios WHERE email = ?',
    [email]
  );
  const usuario = rows[0];
  if (!usuario || !usuario.activo) throw httpError(401, 'Credenciales inválidas');

  const ok = await bcrypt.compare(password, usuario.password_hash);
  if (!ok) throw httpError(401, 'Credenciales inválidas');

  const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  });
  return { token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } };
}

async function perfil(id) {
  const [rows] = await db.query(
    'SELECT id, nombre, email, telefono, rol, creado_en FROM usuarios WHERE id = ?',
    [id]
  );
  if (!rows.length) throw httpError(404, 'Usuario no encontrado');
  return rows[0];
}

module.exports = { registrar, login, perfil };
