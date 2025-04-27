const pool = require("./pool")

async function obtenerMovimientos() {
  const { rows } = await pool.query(`
      SELECT * FROM movimiento `)
  return rows
}

async function obtenerDetalleMovimiento(idMov) {
  const { rows } = await pool.query(
    `
      SELECT 
        m.id_movimiento,
        m.fecha,
        m.tipo,
        m.descripcion,
        u.username AS usuario,
        -- Datos de movimiento venta
        mv.nombre_cliente,
        mv.razon_social,
        mv.dni_cliente,
        mv.ruc_cliente,
        mv.correo_cliente,
        mv.direccion_cliente,
        mv.tipo_comprobante,
        mv.total AS total_venta,
        -- Datos de movimiento compra
        me.id_proveedor,
        me.total AS total_compra,
        -- Datos de movimiento ajuste
        ma.tipo_ajuste,
        ma.motivo,
        -- Productos involucrados
        p.nombre AS producto,
        pm.cantidad,
        pm.precio_unitario,
        pm.subtotal
      FROM 
        movimiento m
      JOIN 
        usuarios u ON m.id_usuario = u.id
      LEFT JOIN 
        movimiento_venta mv ON m.id_movimiento = mv.id_movimiento
      LEFT JOIN 
        movimiento_entrada me ON m.id_movimiento = me.id_movimiento
      LEFT JOIN 
        movimiento_ajuste ma ON m.id_movimiento = ma.id_movimiento
      LEFT JOIN 
        producto_movimiento pm ON m.id_movimiento = pm.id_movimiento
      LEFT JOIN 
        producto p ON pm.id_producto = p.id_producto
      WHERE 
        m.id_movimiento = $1
    `,
    [idMov]
  )

  return rows
}

async function registrarMovimiento({ id_usuario, tipo, fecha, descripcion }) {
  const query = `
      INSERT INTO movimiento (id_usuario, tipo, fecha, descripcion) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id_movimiento
    `
  const values = [id_usuario, tipo, fecha, descripcion]

  try {
    const result = await pool.query(query, values)
    return result.rows[0].id_movimiento // Regresa el id_movimiento generado
  } catch (error) {
    console.error("Error al insertar movimiento:", error)
    throw error
  }
}

async function registrarMovimientoVenta({
  id_movimiento,
  nombre_cliente,
  razon_social,
  dni_cliente,
  ruc_cliente,
  correo_cliente,
  direccion_cliente,
  tipo_comprobante,
  total,
}) {
  const query = `
      INSERT INTO movimiento_venta (id_movimiento, nombre_cliente, razon_social, dni_cliente, ruc_cliente, correo_cliente, direccion_cliente, tipo_comprobante, total)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `

  const values = [
    id_movimiento,
    nombre_cliente,
    razon_social,
    dni_cliente,
    ruc_cliente,
    correo_cliente,
    direccion_cliente,
    tipo_comprobante,
    total,
  ]

  try {
    await pool.query(query, values)
  } catch (error) {
    console.error("Error al insertar movimiento venta:", error)
    throw error
  }
}

async function registrarMovimientoCompra({
  id_movimiento,
  id_proveedor,
  total,
}) {
  const query = `
      INSERT INTO movimiento_entrada (id_movimiento, id_proveedor, total)
      VALUES ($1, $2, $3)
    `

  const values = [id_movimiento, id_proveedor, total]

  try {
    await pool.query(query, values)
  } catch (error) {
    console.error("Error al insertar movimiento compra:", error)
    throw error
  }
}

async function registrarProductoMovimiento({
  id_producto,
  id_movimiento,
  cantidad,
  precio_unitario,
  subtotal,
}) {
  const query = `
      INSERT INTO producto_movimiento (id_producto, id_movimiento, cantidad, precio_unitario, subtotal) 
      VALUES ($1, $2, $3, $4, $5)
    `

  const values = [
    id_producto,
    id_movimiento,
    cantidad,
    precio_unitario,
    subtotal,
  ]

  try {
    await pool.query(query, values)
  } catch (error) {
    console.error("Error al insertar producto movimiento:", error)
    throw error
  }
}

module.exports = {
  obtenerMovimientos,
  obtenerDetalleMovimiento,
  registrarMovimiento,
  registrarMovimientoVenta,
  registrarMovimientoCompra,
  registrarProductoMovimiento,
}
