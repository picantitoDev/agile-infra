const pool = require("./pool")

async function obtenerProveedores() {
  const { rows } = await pool.query(
    `SELECT * FROM proveedor ORDER BY id_proveedor ASC`
  )
  return rows
}

async function insertarProveedor({
  razon_social,
  ruc,
  numero_telefono,
  correo,
  direccion,
}) {
  await pool.query(
    `INSERT INTO proveedor (razon_social, ruc, numero_telefono, correo, direccion)
     VALUES ($1, $2, $3, $4, $5)`,
    [razon_social, ruc, numero_telefono, correo, direccion]
  )
}

module.exports = {
  obtenerProveedores,
  insertarProveedor,
}
