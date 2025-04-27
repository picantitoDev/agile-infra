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

module.exports = {
  obtenerMovimientos,
  obtenerDetalleMovimiento,
}
