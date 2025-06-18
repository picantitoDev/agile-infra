const pool = require("./pool")

async function obtenerCategorias() {
  const { rows } = await pool.query(
    `SELECT * FROM categoria ORDER BY id_categoria ASC`
  )
  return rows
}

async function obtenerCategoriasActivas() {
  const { rows } = await pool.query(
    `SELECT * FROM categoria WHERE estado = 'activa' ORDER BY id_categoria ASC`
  )
  return rows
}

async function crearCategoria(nombre) {
  await pool.query(`INSERT INTO categoria (nombre) VALUES ($1)`, [nombre])
}

async function renombrarCategoria(id, nuevoNombre) {
  await pool.query(
    `UPDATE categoria SET nombre = $1 WHERE id_categoria = $2`,
    [nuevoNombre, id]
  )
}

async function cambiarEstadoCategoria(id, nuevoEstado) {
  await pool.query(
    `UPDATE categoria SET estado = $1 WHERE id_categoria = $2`,
    [nuevoEstado, id]
  )
}

module.exports = {
  obtenerCategorias,
  crearCategoria,
  renombrarCategoria,
  cambiarEstadoCategoria,
  obtenerCategoriasActivas
}
