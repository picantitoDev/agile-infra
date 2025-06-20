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


module.exports = {
    obtenerOrdenes,
    crearOrden,
    obtenerOrdenPorId,
    actualizarEstadoOrden,
    actualizarProductosOrden
}
