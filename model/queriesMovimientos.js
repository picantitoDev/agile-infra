const pool = require("./pool")

async function obtenerMovimientos() {
  const { rows } = await pool.query(`
      SELECT * FROM movimiento ORDER BY id_movimiento DESC`)
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
        mv.serie,
        mv.correlativo,
        mv.total AS total_venta,
        -- Datos de movimiento compra
        me.id_proveedor,
        me.total AS total_compra,
        -- Datos de movimiento ajuste
        ma.tipo_ajuste,
        ma.motivo,
        -- Productos involucrados
        p.id_producto,
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
        cliente c ON mv.id_cliente = c.id_cliente
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

async function obtenerMovimientosVentas(fechaInicio, fechaFin) {
  const query = `
    SELECT
      m.id_movimiento,
      m.fecha,
      m.descripcion,
      u.username AS usuario,
      mv.tipo_comprobante,
      mv.serie,
      mv.correlativo,
      mv.total AS total_venta,
      c.nombre_cliente,
      c.razon_social,
      c.ruc_cliente,
      c.dni_cliente,
      c.direccion_cliente,
      c.correo_cliente,
      p.id_producto,
      p.nombre AS producto,
      pm.cantidad,
      pm.precio_unitario,
      pm.subtotal
    FROM movimiento m
    JOIN movimiento_venta mv ON m.id_movimiento = mv.id_movimiento
    JOIN usuarios u ON m.id_usuario = u.id
    JOIN cliente c ON mv.id_cliente = c.id_cliente
    JOIN producto_movimiento pm ON m.id_movimiento = pm.id_movimiento
    JOIN producto p ON pm.id_producto = p.id_producto
    WHERE m.tipo = 'Venta'
     AND m.fecha::date BETWEEN $1 AND $2
    ORDER BY m.fecha DESC, m.id_movimiento
  `;

  const { rows } = await pool.query(query, [fechaInicio, fechaFin]);
  return rows;
}


async function obtenerMovimientosMermas(fechaInicio, fechaFin) {
  const query = `
    SELECT
      m.id_movimiento,
      m.fecha,
      m.descripcion,
      u.username AS usuario,
      ma.motivo,
      p.id_producto,
      p.nombre AS producto,
      pm.cantidad,
      pm.precio_unitario,
      pm.subtotal
    FROM movimiento m
    JOIN movimiento_ajuste ma ON m.id_movimiento = ma.id_movimiento
    JOIN usuarios u ON m.id_usuario = u.id
    JOIN producto_movimiento pm ON m.id_movimiento = pm.id_movimiento
    JOIN producto p ON pm.id_producto = p.id_producto
    WHERE m.tipo = 'Merma'
      AND ma.tipo_ajuste = 'Merma'
      AND m.fecha::date BETWEEN $1 AND $2
    ORDER BY m.fecha DESC, m.id_movimiento
  `;

  const { rows } = await pool.query(query, [fechaInicio, fechaFin]);
  return rows;
}


async function obtenerMovimientosEntradas(fechaInicio, fechaFin) {
  const query = `
    SELECT
      m.id_movimiento,
      m.fecha,
      m.descripcion,
      u.username AS usuario,
      me.total AS total_entrada,
      me.id_orden,
      pr.razon_social,
      pr.ruc,
      pr.direccion,
      pr.correo,
      p.id_producto,
      p.nombre AS producto,
      pm.cantidad,
      pm.precio_unitario,
      pm.subtotal
    FROM movimiento m
    JOIN movimiento_entrada me ON m.id_movimiento = me.id_movimiento
    JOIN usuarios u ON m.id_usuario = u.id
    JOIN proveedor pr ON me.id_proveedor = pr.id_proveedor
    JOIN producto_movimiento pm ON m.id_movimiento = pm.id_movimiento
    JOIN producto p ON pm.id_producto = p.id_producto
    WHERE m.tipo = 'Compra'
      AND m.fecha::date BETWEEN $1 AND $2
    ORDER BY m.fecha DESC, m.id_movimiento
  `;
  const { rows } = await pool.query(query, [fechaInicio, fechaFin]);
  return rows;
}

async function obtenerMovimientosSobrantes(fechaInicio, fechaFin) {
  const query = `
    SELECT
      m.id_movimiento,
      m.fecha,
      m.descripcion,
      u.username AS usuario,
      ma.motivo,
      p.id_producto,
      p.nombre AS producto,
      pm.cantidad,
      pm.precio_unitario,
      pm.subtotal
    FROM movimiento m
    JOIN movimiento_ajuste ma ON m.id_movimiento = ma.id_movimiento
    JOIN usuarios u ON m.id_usuario = u.id
    JOIN producto_movimiento pm ON m.id_movimiento = pm.id_movimiento
    JOIN producto p ON pm.id_producto = p.id_producto
    WHERE m.tipo = 'Sobrante'
      AND ma.tipo_ajuste = 'Sobrante'
      AND m.fecha::date BETWEEN $1 AND $2
    ORDER BY m.fecha DESC, m.id_movimiento
  `;

  const { rows } = await pool.query(query, [fechaInicio, fechaFin]);
  return rows;
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
  try {
    // Definir la serie según el tipo de comprobante
    const serie = tipo_comprobante === "boleta" ? "B001" : "F001"

    // Obtener el correlativo actual
    const correlativoQuery = `
    SELECT COALESCE(MAX(correlativo), 0) + 1 AS nuevo_correlativo
    FROM movimiento_venta
    WHERE tipo_comprobante = $1
  `
    const correlativoResult = await pool.query(correlativoQuery, [
      tipo_comprobante,
    ])
    const correlativo = correlativoResult.rows[0].nuevo_correlativo

    // Insertar el movimiento de venta con serie y correlativo
    const insertQuery = `
      INSERT INTO movimiento_venta (
        id_movimiento, id_cliente, tipo_comprobante, serie, correlativo, total
      )
      VALUES ($1, $2, $3, $4, $5, $6)
    `
    const values = [
      id_movimiento,
      id_cliente,
      tipo_comprobante,
      serie,
      correlativo,
      total,
    ]

    await pool.query(insertQuery, values)
  } catch (error) {
    console.error("Error al insertar movimiento venta:", error)
    throw error
  }
}

async function registrarMovimientoCompra({
  id_movimiento,
  id_proveedor,
  total,
  id_orden,
}) {
  const query = `
    INSERT INTO movimiento_entrada (id_movimiento, id_proveedor, total, id_orden)
    VALUES ($1, $2, $3, $4)
  `;

  const values = [id_movimiento, id_proveedor, total, id_orden];

  try {
    await pool.query(query, values);
  } catch (error) {
    console.error("Error al insertar movimiento compra:", error);
    throw error;
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

async function obtenerResumenVentas30Dias() {
  const result = await pool.query(`
    SELECT 
      (m.fecha AT TIME ZONE 'UTC' AT TIME ZONE 'America/Lima')::DATE AS fecha,
      SUM(v.total) AS total
    FROM movimiento m
    JOIN movimiento_venta v ON m.id_movimiento = v.id_movimiento
    WHERE m.tipo = 'Venta'
      AND m.fecha >= NOW() - INTERVAL '30 days'
    GROUP BY 1
    ORDER BY 1;
  `);
  console.log('FECHAS DE VENTAS:', result.rows);
  return result.rows;
}

async function obtenerDetalleVentaPorFecha(fecha) {
  const fechaInicio = `${fecha}T00:00:00.000Z`;
  const fechaFin = `${fecha}T23:59:59.999Z`;

  const { rows } = await pool.query(`
    SELECT 
      p.nombre,
      pm.cantidad,
      pm.subtotal
    FROM producto_movimiento pm
    JOIN producto p ON p.id_producto = pm.id_producto
    JOIN movimiento m ON m.id_movimiento = pm.id_movimiento
    WHERE m.tipo = 'Venta'
      AND m.fecha BETWEEN $1 AND $2
  `, [fechaInicio, fechaFin]);

  return rows;
}

async function obtenerMermasUltimos30Dias() {
  const { rows } = await pool.query(`
    SELECT fecha
    FROM movimiento
    WHERE tipo = 'Merma' AND fecha >= NOW() - INTERVAL '30 days'
  `);
  return rows;
}

async function obtenerSobrantesUltimos30Dias() {
  const { rows } = await pool.query(`
    SELECT fecha
    FROM movimiento
    WHERE tipo = 'Sobrante' AND fecha >= NOW() - INTERVAL '30 days'
  `);
  return rows;
}

module.exports = {
  obtenerMovimientos,
  obtenerDetalleMovimiento,
  registrarMovimiento,
  registrarMovimientoVenta,
  registrarMovimientoCompra,
  registrarMovimientoAjuste,
  registrarProductoMovimiento,
  obtenerMovimientosVentas,
  obtenerMovimientosEntradas,
  obtenerMovimientosMermas,
  obtenerMovimientosSobrantes,
  obtenerResumenVentas30Dias,
  obtenerDetalleVentaPorFecha,
  obtenerMermasUltimos30Dias,
  obtenerSobrantesUltimos30Dias
}
