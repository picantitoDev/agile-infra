// queriesIncidencias.js
const pool = require("./pool")

/**
 * Registra una incidencia asociada a un movimiento.
 * 
 * @param {Object} incidencia
 * @param {number} incidencia.id_movimiento - ID del movimiento relacionado
 * @param {string|null} incidencia.descripcion_general - Descripción general de la incidencia (opcional)
 * @param {Array} incidencia.detalle_productos - Lista de productos con incidencia (JSON serializable)
 */
async function registrarIncidencia({ id_movimiento, descripcion_general, detalle_productos, id_orden = null }) {
  const query = `
    INSERT INTO incidencia (id_movimiento, descripcion_general, detalle_productos, id_orden)
    VALUES ($1, $2, $3, $4)
  `
  const values = [
    id_movimiento,
    descripcion_general || null,
    JSON.stringify(detalle_productos),
    id_orden
  ]

  try {
    await pool.query(query, values)
  } catch (error) {
    console.error("Error al registrar incidencia:", error)
    throw error
  }
}


async function obtenerIncidencias() {
  const query = `
    SELECT 
      i.id_incidencia,
      i.id_movimiento,
      i.id_orden,
      i.descripcion_general,
      i.detalle_productos,
      i.fecha_registro,
      m.fecha,
      m.descripcion,
      u.username AS usuario
    FROM incidencia i
    JOIN movimiento m ON i.id_movimiento = m.id_movimiento
    JOIN usuarios u ON m.id_usuario = u.id
    ORDER BY i.fecha_registro DESC
  `

  try {
    const result = await pool.query(query)
    return result.rows
  } catch (error) {
    console.error("Error al obtener incidencias:", error)
    throw error
  }
}


module.exports = {
  registrarIncidencia,
  obtenerIncidencias,
}
