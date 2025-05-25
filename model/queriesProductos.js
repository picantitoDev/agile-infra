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

async function obtenerProductosParaOrden() {
  const { rows } = await pool.query(`
    SELECT 
      p.id_producto,
      p.nombre,
      p.stock,
      p.precio_unitario,
      p.cantidad_minima,
      p.estado,
      c.nombre AS categoria,
      pr.razon_social AS proveedor,
      p.id_proveedor
    FROM producto p
    JOIN categoria c ON p.id_categoria = c.id_categoria
    JOIN proveedor pr ON p.id_proveedor = pr.id_proveedor
    ORDER BY p.nombre ASC
  `)
  return rows
}

async function obtenerProductosCriticos() {
  const query = `
    SELECT COUNT(*) AS total
    FROM producto pr
    WHERE pr.stock < pr.cantidad_minima
      AND pr.estado = 'Activado'
      AND NOT EXISTS (
        SELECT 1
        FROM orden_reabastecimiento o
        WHERE o.estado = 'en_curso'
          AND (
            o.products::jsonb @> to_jsonb(json_build_array(json_build_object('id_producto', pr.id_producto)))
          )
      )
  `;
  const result = await pool.query(query);
  return parseInt(result.rows[0].total, 10);
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

// SUMAR al stock de un producto
async function aumentarStock(id_producto, cantidad) {
  const query = `
    UPDATE producto
    SET stock = stock + $1
    WHERE id_producto = $2
  `
  await pool.query(query, [cantidad, id_producto])
}

// RESTAR al stock de un producto
async function disminuirStock(id_producto, cantidad) {
  const query = `
    UPDATE producto
    SET stock = stock - $1
    WHERE id_producto = $2
  `
  await pool.query(query, [cantidad, id_producto])
}

module.exports = {
  obtenerProductos,
  crearProducto,
  obtenerProductoPorId,
  actualizarProducto,
  obtenerIdProductoPorNombre,
  aumentarStock,
  disminuirStock,
  obtenerProductosCriticos,
  obtenerProductosParaOrden
}
