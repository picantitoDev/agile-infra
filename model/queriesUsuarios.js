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

module.exports = {
  buscarUsuarioPorNombre,
  buscarUsuarioPorId,
  crearUsuario,
  obtenerUsuarios,
  buscarUsuarioPorNombreOCorreo,
  buscarUsuarioPorEmail,
}
