const pool = require("./pool")

async function obtenerProveedores() {
  const { rows } = await pool.query(
    `SELECT * FROM proveedor ORDER BY razon_social ASC`
  )
  return rows
}

module.exports = {
  obtenerProveedores,
}
