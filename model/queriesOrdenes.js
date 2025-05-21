const pool = require("./pool")

async function obtenerOrdenes(){
  const query = `
    SELECT 
      o.id_order, 
      p.razon_social AS proveedor, 
      o.products, 
      o.fecha
    FROM orden_reabastecimiento o
    JOIN proveedor p ON o.id_proveedor = p.id_proveedor
    ORDER BY o.id_order DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};



async function crearOrden(id_proveedor, productos, fecha) {
  const client = await pool.connect();
  try {
    const productosJson = JSON.stringify(productos);

    const query = `
      INSERT INTO orden_reabastecimiento (id_proveedor, products, fecha)
      VALUES ($1, $2::json, $3)
    `;
    await client.query(query, [id_proveedor, productosJson, fecha]);
  } finally {
    client.release();
  }
}


async function obtenerOrdenPorId(id_order) {
  const query = `
    SELECT 
      o.id_order,
      o.id_proveedor,
      p.razon_social AS proveedor,
      o.products,
      o.fecha
    FROM orden_reabastecimiento o
    JOIN proveedor p ON o.id_proveedor = p.id_proveedor
    WHERE o.id_order = $1
  `;

  const result = await pool.query(query, [id_order]);
  return result.rows[0]; // solo una orden por id
}
module.exports = {
    obtenerOrdenes,
    crearOrden,
    obtenerOrdenPorId
}
