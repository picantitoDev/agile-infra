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
        -- Datos de cliente (obtenidos a través de movimiento_venta)
        mv.id_cliente,
        c.nombre_cliente,
        c.razon_social,
        c.dni_cliente,
        c.ruc_cliente,
        c.correo_cliente,
        c.direccion_cliente,
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
        cliente c ON mv.id_cliente = c.id_cliente -- Relacionamos con la tabla cliente
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
  id_cliente,
  tipo_comprobante,
  total,
}) {
  const query = `
    INSERT INTO movimiento_venta (id_movimiento, id_cliente, tipo_comprobante, total)
    VALUES ($1, $2, $3, $4)
  `

  const values = [id_movimiento, id_cliente, tipo_comprobante, total]

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

async function registrarMovimientoAjuste({
  id_movimiento,
  tipo_ajuste,
  motivo,
}) {
  const query = `
      INSERT INTO movimiento_ajuste (id_movimiento, tipo_ajuste, motivo)
      VALUES ($1, $2, $3)
    `

  const values = [id_movimiento, tipo_ajuste, motivo]

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
  registrarMovimientoAjuste,
  registrarProductoMovimiento,
}
