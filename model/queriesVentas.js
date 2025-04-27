const pool = require("../model/pool")

async function insertarVenta({
  tipo_comprobante,
  cliente_nombre,
  cliente_dni,
  cliente_ruc,
  razon_social,
  direccion_cliente,
  correo_cliente,
  descripcion,
  total,
}) {
  const result = await pool.query(
    `INSERT INTO venta (
      tipo_comprobante, nombre_cliente, dni_cliente, ruc_cliente,
      razon_social, direccion_cliente, correo_cliente,
      descripcion, total
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id_venta`,
    [
      tipo_comprobante,
      cliente_nombre,
      cliente_dni,
      cliente_ruc,
      razon_social,
      direccion_cliente,
      correo_cliente,
      descripcion,
      total,
    ]
  )
  return result.rows[0].id_venta
}

async function generarDetalleVenta(id_venta, productos) {
  const promises = productos.map((p) => {
    return pool.query(
      "INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)",
      [id_venta, p.id, p.cantidad, p.precio_unitario]
    )
  })
  await Promise.all(promises)
}

async function obtenerVentas() {
  const { rows } = await pool.query(`SELECT * FROM venta ORDER BY id_venta ASC`)
  return rows
}

module.exports = {
  obtenerVentas,
  insertarVenta,
  generarDetalleVenta,
}
