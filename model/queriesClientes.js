const pool = require("./pool")

async function registrarCliente({
  nombre_cliente,
  razon_social,
  dni_cliente,
  ruc_cliente,
  direccion_cliente,
  correo_cliente,
}) {
  const result = await pool.query(
    `INSERT INTO cliente 
       (nombre_cliente, razon_social, dni_cliente, ruc_cliente, direccion_cliente, correo_cliente)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id_cliente`,
    [
      nombre_cliente,
      razon_social,
      dni_cliente,
      ruc_cliente,
      direccion_cliente,
      correo_cliente,
    ]
  )

  return result.rows[0].id_cliente
}

module.exports = {
  registrarCliente,
}
