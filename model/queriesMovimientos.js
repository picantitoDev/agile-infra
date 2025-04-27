const pool = require("./pool")

async function obtenerMovimientos() {
  const { rows } = await pool.query(`
      SELECT * FROM movimiento `)
  return rows
}

module.exports = {
  obtenerMovimientos,
}
