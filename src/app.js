const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./modules/auth/auth.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// Salud del servicio (útil para pruebas y despliegue)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', servicio: 'barberia-api', fecha: new Date().toISOString() });
});

// ---- Módulos ----
app.use('/api/auth', authRoutes);
// app.use('/api/servicios', require('./modules/servicios/servicios.routes'));
// app.use('/api/barberos',  require('./modules/barberos/barberos.routes'));
// app.use('/api/citas',     require('./modules/citas/citas.routes'));

// 404
app.use((req, res) => {
  res.status(404).json({ ok: false, mensaje: 'Ruta no encontrada' });
});

app.use(errorHandler);

module.exports = app;
