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

async function buscarPorDNI(dni) {
  const result = await pool.query(
    "SELECT * FROM cliente WHERE dni_cliente = $1",
    [dni]
  )
  return result.rows[0] // o undefined si no hay
}

async function buscarPorRUC(ruc) {
  const result = await pool.query(
    "SELECT * FROM cliente WHERE ruc_cliente = $1",
    [ruc]
  )
  return result.rows[0] // o undefined si no hay
}

module.exports = {
  registrarCliente,
  buscarPorDNI,
  buscarPorRUC,
}
