const pool = require("./pool")
const { DateTime } = require('luxon');

async function obtenerOrdenes(){
  const query = `
    SELECT 
      o.id_order, 
      p.razon_social AS proveedor, 
      o.products, 
      o.fecha,
      o.estado
    FROM orden_reabastecimiento o
    JOIN proveedor p ON o.id_proveedor = p.id_proveedor
    ORDER BY o.id_order DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};


async function crearOrden(id_proveedor, productos, fecha, estado = 'en_curso', id_usuario) {
  const client = await pool.connect();
  try {
    const productosJson = JSON.stringify(productos);

    const query = `
      INSERT INTO orden_reabastecimiento (id_proveedor, products, fecha, estado, id_usuario)
      VALUES ($1, $2::json, $3, $4, $5)
      RETURNING id_order
    `;

    const result = await client.query(query, [id_proveedor, productosJson, fecha, estado, id_usuario]);
    return result.rows[0].id_order;

  } finally {
    client.release();
  }
}

async function actualizarEstadoOrden(id_orden, nuevoEstado) {
  const query = `
    UPDATE orden_reabastecimiento
    SET estado = $1
    WHERE id_order = $2
  `;
  await pool.query(query, [nuevoEstado, id_orden]);
}


async function obtenerOrdenPorId(id_order) {
  const query = `
    SELECT 
      o.id_order,
      o.id_proveedor,
      p.razon_social AS proveedor,
      o.products,
      o.fecha,
      o.estado
    FROM orden_reabastecimiento o
    JOIN proveedor p ON o.id_proveedor = p.id_proveedor
    WHERE o.id_order = $1
  `;

  const result = await pool.query(query, [id_order]);
  return result.rows[0]; // solo una orden por id
}

async function actualizarProductosOrden(id_order, nuevosProductos) {
  const query = `
    UPDATE orden_reabastecimiento
    SET products = $1
    WHERE id_order = $2
  `;

  // Asegúrate de convertir el array de productos a JSON string si `products` es de tipo JSON o JSONB
  await pool.query(query, [JSON.stringify(nuevosProductos), id_order]);
}

async function buscarOrdenPorProductoEnCurso(idProducto) {
  const query = `
    SELECT
      o.id_order,
      o.fecha,
      o.estado,
      o.id_proveedor,
      p.razon_social AS proveedor,
      o.products
    FROM orden_reabastecimiento o
    JOIN proveedor p ON p.id_proveedor = o.id_proveedor
    WHERE o.estado = 'en_curso'
  `;

  try {
    const { rows } = await pool.query(query);

    for (const orden of rows) {
      const productos = orden.products;
      const contiene = productos.find(p => Number(p.id_producto) === idProducto);
      if (contiene) {
        return {
          id_orden: orden.id_order,
          fecha: orden.fecha,
          total: orden.total,
          proveedor: orden.proveedor,
          productos: productos
        };
      }
    }

    return null; // No encontrada
  } catch (error) {
    throw error;
  }
}

async function obtenerOrdenesUltimos30Dias() {
  const result = await pool.query(`
    SELECT id_order, fecha
    FROM orden_reabastecimiento
    WHERE fecha >= NOW() - INTERVAL '30 days'
  `);
  return result.rows;
}


async function obtenerDetalleOrdenesPorFecha(fechaLimaString) {
  // fecha = "2025-06-24"
  const inicioUTC = DateTime
    .fromISO(fechaLimaString, { zone: 'America/Lima' })
    .startOf('day')
    .toUTC()
    .toISO();

  const finUTC = DateTime
    .fromISO(fechaLimaString, { zone: 'America/Lima' })
    .endOf('day')
    .toUTC()
    .toISO();

  const { rows } = await pool.query(`
    SELECT 
      o.id_order,
      o.fecha,
      o.estado,
      o.products,
      pr.razon_social AS proveedor
    FROM orden_reabastecimiento o
    JOIN proveedor pr ON pr.id_proveedor = o.id_proveedor
    WHERE o.fecha BETWEEN $1 AND $2
  `, [inicioUTC, finUTC]);

  return rows;
}

async function cancelarOrden(idOrden){
  const query = `
    UPDATE orden_reabastecimiento
    SET estado = 'cancelada'
    WHERE id_order = $1
  `;
  await pool.query(query, [idOrden]);
};

module.exports = {
    obtenerOrdenes,
    crearOrden,
    obtenerOrdenPorId,
    actualizarEstadoOrden,
    actualizarProductosOrden,
    buscarOrdenPorProductoEnCurso,
    obtenerOrdenesUltimos30Dias,
    obtenerDetalleOrdenesPorFecha,
    cancelarOrden
}
