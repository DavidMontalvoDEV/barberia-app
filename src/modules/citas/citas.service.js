const db = require('../../config/db');
const { httpError } = require('../../utils/helpers');

const SELECT_CITA = `
  SELECT c.id, c.fecha_inicio, c.fecha_fin, c.estado, c.notas,
         cl.id AS cliente_id, cl.nombre AS cliente,
         b.id AS barbero_id, b.nombre AS barbero,
         s.id AS servicio_id, s.nombre AS servicio, s.precio
  FROM citas c
  JOIN usuarios cl ON cl.id = c.cliente_id
  JOIN usuarios b  ON b.id = c.barbero_id
  JOIN servicios s ON s.id = c.servicio_id`;

async function barberos() {
  const [rows] = await db.query(
    "SELECT id, nombre FROM usuarios WHERE rol = 'barbero' AND activo = 1 ORDER BY nombre"
  );
  return rows;
}

async function obtener(id) {
  const [rows] = await db.query(`${SELECT_CITA} WHERE c.id = ?`, [id]);
  if (!rows.length) throw httpError(404, 'Cita no encontrada');
  return rows[0];
}

// Cada rol ve lo suyo: cliente sus citas, barbero su agenda, admin todo
async function listar(usuario) {
  let where = '1 = 1';
  const params = [];
  if (usuario.rol === 'cliente') { where = 'c.cliente_id = ?'; params.push(usuario.id); }
  if (usuario.rol === 'barbero') { where = 'c.barbero_id = ?'; params.push(usuario.id); }
  const [rows] = await db.query(`${SELECT_CITA} WHERE ${where} ORDER BY c.fecha_inicio`, params);
  return rows;
}

async function crear(clienteId, { barbero_id, servicio_id, fecha_hora, notas }) {
  const [barb] = await db.query(
    "SELECT id FROM usuarios WHERE id = ? AND rol = 'barbero' AND activo = 1",
    [barbero_id]
  );
  if (!barb.length) throw httpError(404, 'Barbero no encontrado');

  // INTEGRACIÓN: la duración de la cita sale del módulo Servicios
  const [serv] = await db.query('SELECT duracion_min FROM servicios WHERE id = ? AND activo = 1', [servicio_id]);
  if (!serv.length) throw httpError(404, 'Servicio no encontrado');
  const duracion = serv[0].duracion_min;

  const [[f]] = await db.query(
    "SELECT STR_TO_DATE(?, '%Y-%m-%d %H:%i') AS inicio, STR_TO_DATE(?, '%Y-%m-%d %H:%i') > NOW() AS futura",
    [fecha_hora, fecha_hora]
  );
  if (!f.inicio) throw httpError(400, 'La fecha no es válida');
  if (!f.futura) throw httpError(400, 'La cita debe ser en una fecha y hora futura');

  // REGLA DE NEGOCIO: el barbero no puede tener dos citas que se crucen
  const [cruce] = await db.query(
    `SELECT id FROM citas
     WHERE barbero_id = ? AND estado IN ('pendiente','confirmada')
       AND fecha_inicio < DATE_ADD(?, INTERVAL ? MINUTE)
       AND fecha_fin > ?`,
    [barbero_id, f.inicio, duracion, f.inicio]
  );
  if (cruce.length) throw httpError(409, 'El barbero ya tiene una cita en ese horario');

  const [r] = await db.query(
    `INSERT INTO citas (cliente_id, barbero_id, servicio_id, fecha_inicio, fecha_fin, notas)
     VALUES (?, ?, ?, ?, DATE_ADD(?, INTERVAL ? MINUTE), ?)`,
    [clienteId, barbero_id, servicio_id, f.inicio, f.inicio, duracion, notas || null]
  );
  return obtener(r.insertId);
}

async function cancelar(id, usuario) {
  const cita = await obtener(id);
  const esDueno = cita.cliente_id === usuario.id || cita.barbero_id === usuario.id;
  if (usuario.rol !== 'admin' && !esDueno) throw httpError(403, 'No puedes cancelar esta cita');
  if (['cancelada', 'completada'].includes(cita.estado)) {
    throw httpError(409, `La cita ya está ${cita.estado}`);
  }
  await db.query("UPDATE citas SET estado = 'cancelada' WHERE id = ?", [id]);
  return obtener(id);
}

async function cambiarEstado(id, usuario, estado) {
  const cita = await obtener(id);
  if (usuario.rol === 'barbero' && cita.barbero_id !== usuario.id) {
    throw httpError(403, 'Esta cita no es de tu agenda');
  }
  if (cita.estado === 'cancelada') throw httpError(409, 'No se puede modificar una cita cancelada');
  await db.query('UPDATE citas SET estado = ? WHERE id = ?', [estado, id]);
  return obtener(id);
}

module.exports = { barberos, listar, crear, cancelar, cambiarEstado };
