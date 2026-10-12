const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./modules/auth/auth.routes');
const serviciosRoutes = require('./modules/servicios/servicios.routes');
const citasRoutes = require('./modules/citas/citas.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', servicio: 'barberia-api', fecha: new Date().toISOString() });
});

// ---- Módulos ----
app.use('/api/auth', authRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/citas', citasRoutes);

app.use((req, res) => {
  res.status(404).json({ ok: false, mensaje: 'Ruta no encontrada' });
});

app.use(errorHandler);

module.exports = app;
