const pool = require("./pool")

async function obtenerCategorias() {
  const { rows } = await pool.query(`SELECT * FROM categoria ORDER BY id ASC`)
  return rows
}

async function crearCategoria(nombre) {
  await pool.query(`INSERT INTO categoria (nombre) VALUES ($1)`, [nombre])
}

module.exports = {
  obtenerCategorias,
  crearCategoria,
}
