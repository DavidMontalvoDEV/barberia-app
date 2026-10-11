# Barbería App - API de agendamiento de citas

Evidencia GA8-220501096-AA1-EV02 · Node.js + Express + MySQL

## Instalación
1. `npm install`
2. Copiar `.env.example` a `.env` y completar los datos.
3. Ejecutar `database/schema.sql` en MySQL.
4. `npm run dev` (desarrollo) o `npm start`.
5. Probar: `GET http://localhost:3000/api/health`

## Endpoints (módulo Auth)
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | /api/auth/registro | Registra un cliente | No |
| POST | /api/auth/login | Devuelve token JWT | No |
| GET | /api/auth/perfil | Datos del usuario | Bearer token |

## Pruebas
`npm test`
