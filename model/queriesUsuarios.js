const pool = require("./pool")

const buscarUsuarioPorNombre = async (nombre) => {
  const { rows } = await pool.query(
    "SELECT * FROM usuarios WHERE username = $1",
    [nombre]
  )
  return rows[0]
}

async function buscarUsuarioPorEmail(email) {
  const { rows } = await pool.query(`SELECT * FROM usuarios WHERE email = $1`, [
    email,
  ])
  return rows[0]
}

async function obtenerUsuarios() {
  const { rows } = await pool.query(`SELECT * FROM usuarios ORDER BY id ASC`)
  return rows
}

const buscarUsuarioPorNombreOCorreo = async (input) => {
  const { rows } = await pool.query(
    `SELECT * FROM usuarios WHERE username = $1 OR email = $1`,
    [input]
  )
  return rows[0]
}

const buscarUsuarioPorId = async (id) => {
  const { rows } = await pool.query("SELECT * FROM usuarios WHERE id = $1", [
    id,
  ])
  return rows[0]
}

const crearUsuario = async ({ username, password, email, rol }) => {
  await pool.query(
    "INSERT INTO usuarios (username, password, email, rol) VALUES ($1, $2, $3, $4)",
    [username, password, email, rol]
  )
}

async function actualizarUsuario(id, { username, email, rol, estado }) {
  const query = `
    UPDATE usuarios
    SET username = $1, email = $2, rol = $3, estado = $4
    WHERE id = $5
  `;
  await pool.query(query, [username, email, rol, estado, id]);
}

// Guardar token y expiración
const guardarTokenDeReset = async (id, token, expires) => {
  await pool.query(
    "UPDATE usuarios SET reset_token = $1, reset_token_expires = $2 WHERE id = $3",
    [token, expires, id]
  );
};

// Buscar usuario por token válido (aún no vencido)
const buscarUsuarioPorToken = async (token) => {
  const { rows } = await pool.query(
    `SELECT * FROM usuarios WHERE reset_token = $1 AND reset_token_expires > NOW()`,
    [token]
  );
  return rows[0];
};

// Restablecer contraseña y limpiar token
const actualizarPasswordYLimpiarToken = async (id, newPassword) => {
  await pool.query(
    `UPDATE usuarios 
     SET password = $1, reset_token = NULL, reset_token_expires = NULL 
     WHERE id = $2`,
    [newPassword, id]
  );
};


module.exports = {
  buscarUsuarioPorNombre,
  buscarUsuarioPorId,
  crearUsuario,
  obtenerUsuarios,
  buscarUsuarioPorNombreOCorreo,
  buscarUsuarioPorEmail,
  guardarTokenDeReset,
  buscarUsuarioPorToken,
  actualizarPasswordYLimpiarToken,
  actualizarUsuario
}
