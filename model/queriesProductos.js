const pool = require("./pool")

async function obtenerProductos() {
  // Fetch products along with their category name by joining the 'producto' table with the 'categoria' table
  const { rows } = await pool.query(
    `SELECT 
       p.id_producto AS id,
       p.nombre,
       p.stock,
       p.precio_unitario,
       p.unidad_medida,
       p.estado,
       p.sku,
       c.nombre AS categoria
     FROM producto p
     JOIN categoria c ON p.categoria = c.id
     ORDER BY p.nombre ASC`
  )
  return rows
}

async function obtenerProductoPorId(id) {
  // Fetch a single product and its category name by joining the 'producto' table with the 'categoria' table
  const { rows } = await pool.query(
    `SELECT p.*, c.nombre AS categoria
     FROM producto p
     JOIN categoria c ON p.categoria = c.id
     WHERE p.id_producto = $1`,
    [id]
  )
  return rows[0]
}

async function crearProducto(
  nombre,
  sku,
  stock,
  precio_unitario,
  categoria_id,
  unidad_medida
) {
  // Insert a new product into the 'producto' table
  await pool.query(
    `INSERT INTO producto 
     (nombre, sku, stock, estado, precio_unitario, categoria, unidad_medida) 
     VALUES ($1, $2, $3, 'Activado', $4, $5, $6)`,
    [nombre, sku, stock, precio_unitario, categoria_id, unidad_medida]
  )
}

async function actualizarProducto(id, producto) {
  // Update product details in the 'producto' table
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
