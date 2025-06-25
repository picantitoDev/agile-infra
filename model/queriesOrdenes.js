const pool = require("./pool")

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


async function crearOrden(id_proveedor, productos, fecha, estado = 'en_curso') {
  const client = await pool.connect();
  try {
    const productosJson = JSON.stringify(productos);

    const query = `
      INSERT INTO orden_reabastecimiento (id_proveedor, products, fecha, estado)
      VALUES ($1, $2::json, $3, $4)
      RETURNING id_order
    `;

    const result = await client.query(query, [id_proveedor, productosJson, fecha, estado]);
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

async function obtenerResumenOrdenes30Dias() {
  try {
    const query = `
      SELECT 
        DATE(fecha AT TIME ZONE 'UTC' AT TIME ZONE 'America/Lima') as fecha_peru,
        COUNT(*) as numero_ordenes
      FROM orden_reabastecimiento 
      WHERE (fecha AT TIME ZONE 'UTC' AT TIME ZONE 'America/Lima')::DATE >= (CURRENT_DATE - INTERVAL '30 days')
      GROUP BY DATE(fecha AT TIME ZONE 'UTC' AT TIME ZONE 'America/Lima')
      ORDER BY fecha_peru DESC
    `;
    
    const result = await pool.query(query);
    
    const resumen = result.rows.map(row => ({
      fecha: row.fecha_peru.toISOString().split('T')[0],
      numeroOrdenes: parseInt(row.numero_ordenes)
    }));
    
    return resumen;
    
  } catch (error) {
    console.error('Error al obtener resumen de órdenes:', error);
    throw error;
  }
}
async function obtenerDetalleOrdenesPorFecha(fecha) {
  const fechaInicio = `${fecha}T00:00:00.000Z`;
  const fechaFin = `${fecha}T23:59:59.999Z`;

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
  `, [fechaInicio, fechaFin]);

  return rows;
}

module.exports = {
    obtenerOrdenes,
    crearOrden,
    obtenerOrdenPorId,
    actualizarEstadoOrden,
    actualizarProductosOrden,
    buscarOrdenPorProductoEnCurso,
    obtenerResumenOrdenes30Dias,
    obtenerDetalleOrdenesPorFecha
}
