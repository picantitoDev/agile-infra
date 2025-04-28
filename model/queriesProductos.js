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
    `SELECT 
       p.id_producto,
       p.nombre,
       p.stock,
       p.precio_unitario,
       p.cantidad_minima,
       p.estado,
       p.id_categoria,
       c.nombre AS categoria_nombre,
       p.id_proveedor,
       pr.razon_social AS proveedor_nombre
     FROM producto p
     JOIN categoria c ON p.id_categoria = c.id_categoria
     JOIN proveedor pr ON p.id_proveedor = pr.id_proveedor
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

async function obtenerIdProductoPorNombre(nombre) {
  const resultado = await pool.query(
    `SELECT id_producto FROM producto WHERE nombre = $1 LIMIT 1`,
    [nombre]
  )
  return resultado.rows[0] ? resultado.rows[0].id_producto : null
}

async function actualizarProducto(id, producto) {
  const query = `
    UPDATE producto
    SET nombre = $1,
        stock = $2,
        precio_unitario = $3,
        id_categoria = $4,
        id_proveedor = $5,
        cantidad_minima = $6,
        estado = $7
    WHERE id_producto = $8
  `

  const valores = [
    producto.nombre,
    producto.stock,
    producto.precio_unitario,
    producto.id_categoria,
    producto.id_proveedor,
    producto.cantidad_minima,
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
  obtenerIdProductoPorNombre,
}
