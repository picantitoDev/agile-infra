const pool = require("./pool")

async function obtenerProductos() {
  const { rows } = await pool.query(`
    SELECT 
      p.id_producto,
      p.nombre,
      p.stock,
      p.precio_unitario,
      p.cantidad_minima,
      p.estado,
      c.nombre AS categoria,
      pr.razon_social AS proveedor
    FROM producto p
    JOIN categoria c ON p.id_categoria = c.id_categoria
    JOIN proveedor pr ON p.id_proveedor = pr.id_proveedor
    ORDER BY p.nombre ASC
  `)
  return rows
}

async function obtenerProductoPorId(id) {
  const { rows } = await pool.query(
    `SELECT p.*, c.nombre AS categoria
     FROM producto p
     JOIN categoria c ON p.categoria = c.id_categoria
     WHERE p.id_producto = $1`,
    [id]
  )
  return rows[0]
}

async function crearProducto(
  nombre,
  stock,
  precio_unitario,
  id_categoria,
  id_proveedor,
  cantidad_minima
) {
  await pool.query(
    `INSERT INTO producto 
     (nombre, id_proveedor, id_categoria, cantidad_minima, stock, estado, precio_unitario) 
     VALUES ($1, $2, $3, $4, $5, 'Activado', $6)`,
    [
      nombre,
      id_proveedor,
      id_categoria,
      cantidad_minima,
      stock,
      precio_unitario,
    ]
  )
}

async function actualizarProducto(id, producto) {
  const query = `
    UPDATE producto
    SET nombre = $1,
        sku = $2,
        stock = $3,
        precio_unitario = $4,
        categoria = $5,
        unidad_medida = $6,
        estado = $7
    WHERE id_producto = $8
  `

  const valores = [
    producto.nombre,
    producto.sku,
    producto.stock,
    producto.precio_unitario,
    producto.categoria_id,
    producto.unidad_medida,
    producto.estado,
    id,
  ]

  await pool.query(query, valores)
}

module.exports = {
  obtenerProductos,
  crearProducto,
  obtenerProductoPorId,
  actualizarProducto,
}
