const pool = require("./pool")

async function obtenerCategorias() {
  const { rows } = await pool.query(
    `SELECT * FROM categoria ORDER BY id_categoria ASC`
  )
  return rows
}

async function obtenerCategoriasActivas() {
  const { rows } = await pool.query(
    `SELECT * FROM categoria WHERE estado = 'activa' ORDER BY id_categoria ASC`
  )
  return rows
}

async function crearCategoria(nombre) {
  await pool.query(`INSERT INTO categoria (nombre) VALUES ($1)`, [nombre])
}

async function renombrarCategoria(id, nuevoNombre) {
  await pool.query(
    `UPDATE categoria SET nombre = $1 WHERE id_categoria = $2`,
    [nuevoNombre, id]
  )
}

async function cambiarEstadoCategoria(id, nuevoEstado) {
  try {
    // Si se va a desactivar la categoría, primero verificar si hay productos activos con stock
    if (nuevoEstado === 'inactiva') {
      const { rows } = await pool.query(
        `SELECT COUNT(*) AS total
         FROM producto
         WHERE id_categoria = $1 AND estado = 'Activado' AND stock > 0`,
        [id]
      )

      const total = parseInt(rows[0].total, 10)

      if (total > 0) {
        throw new Error(`No se puede desactivar la categoría porque hay ${total} producto(s) activos con stock.`)
      }

      // Actualizar estado de productos a 'Desactivado'
      await pool.query(
        `UPDATE producto SET estado = 'Desactivado' WHERE id_categoria = $1`,
        [id]
      )
    }

    // Cambiar el estado de la categoría
    await pool.query(
      `UPDATE categoria SET estado = $1 WHERE id_categoria = $2`,
      [nuevoEstado, id]
    )

  } catch (error) {
    console.error("Error al cambiar estado de categoría:", error)
    throw error
  }
}

module.exports = {
  obtenerCategorias,
  crearCategoria,
  renombrarCategoria,
  cambiarEstadoCategoria,
  obtenerCategoriasActivas
}
