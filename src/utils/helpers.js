// Crea un error con código HTTP (lo recoge el errorHandler)
const httpError = (status, message) => Object.assign(new Error(message), { status });

// Envoltura para que los errores de funciones async lleguen al errorHandler
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

module.exports = { httpError, wrap };
