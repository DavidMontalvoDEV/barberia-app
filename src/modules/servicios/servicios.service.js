const db = require('../../config/db');
const { httpError } = require('../../utils/helpers');

async function listar() {
  const [rows] = await db.query(
    'SELECT id, nombre, descripcion, precio, duracion_min FROM servicios WHERE activo = 1 ORDER BY nombre'
  );
  return rows;
}

async function obtener(id) {
  const [rows] = await db.query(
    'SELECT id, nombre, descripcion, precio, duracion_min FROM servicios WHERE id = ? AND activo = 1',
    [id]
  );
  if (!rows.length) throw httpError(404, 'Servicio no encontrado');
  return rows[0];
}

async function crear({ nombre, descripcion, precio, duracion_min }) {
  try {
    const [r] = await db.query(
      'INSERT INTO servicios (nombre, descripcion, precio, duracion_min) VALUES (?, ?, ?, ?)',
      [nombre, descripcion || null, precio, duracion_min]
    );
    return obtener(r.insertId);
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') throw httpError(409, 'Ya existe un servicio con ese nombre');
    throw e;
  }
}

async function actualizar(id, { nombre, descripcion, precio, duracion_min }) {
  await obtener(id); // lanza 404 si no existe
  try {
    await db.query(
      `UPDATE servicios SET
         nombre = COALESCE(?, nombre),
         descripcion = COALESCE(?, descripcion),
         precio = COALESCE(?, precio),
         duracion_min = COALESCE(?, duracion_min)
       WHERE id = ?`,
      [nombre ?? null, descripcion ?? null, precio ?? null, duracion_min ?? null, id]
    );
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') throw httpError(409, 'Ya existe un servicio con ese nombre');
    throw e;
  }
  return obtener(id);
}

// "Borrado suave": no se elimina, se marca inactivo (así no se pierde el historial de citas)
async function desactivar(id) {
  await obtener(id);
  await db.query('UPDATE servicios SET activo = 0 WHERE id = ?', [id]);
}

module.exports = { listar, obtener, crear, actualizar, desactivar };
