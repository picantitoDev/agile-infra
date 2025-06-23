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
async function registrarIncidencia({ id_movimiento, descripcion_general, detalle_productos, id_orden = null, fecha = new Date() }) {
  const query = `
    INSERT INTO incidencia (id_movimiento, descripcion_general, detalle_productos, id_orden, fecha)
    VALUES ($1, $2, $3, $4, $5)
  `;
  const values = [
    id_movimiento,
    descripcion_general || null,
    JSON.stringify(detalle_productos),
    id_orden,
    fecha
  ];

  try {
    await pool.query(query, values);
  } catch (error) {
    console.error("Error al registrar incidencia:", error);
    throw error;
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

async function obtenerIncidenciasPorOrden(id_orden) {
  const query = `
    SELECT id_incidencia, id_movimiento, id_orden, detalle_productos, fecha
    FROM incidencia
    WHERE id_orden = $1
    ORDER BY id_incidencia ASC
  `;
  const { rows } = await pool.query(query, [id_orden]);

  return rows.map(row => ({
    id_incidencia: row.id_incidencia,
    id_movimiento: row.id_movimiento,
    detalle_productos: row.detalle_productos, // esto ya es JSON si la columna es tipo JSONB o text convertido
    fecha: row.fecha
  }));
}

async function obtenerIncidenciaPorId(id_incidencia){
  const query = `
    SELECT 
      id_incidencia, 
      id_movimiento, 
      descripcion_general, 
      detalle_productos, 
      fecha_registro, 
      id_orden,
      fecha
    FROM incidencia
    WHERE id_incidencia = $1
  `;

  const result = await pool.query(query, [id_incidencia]);
  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  // Asegurarse que detalle_productos sea un array (si no lo es)
  row.detalle_productos = Array.isArray(row.detalle_productos) ? row.detalle_productos : [];
  return row;
}


module.exports = {
  registrarIncidencia,
  obtenerIncidencias,
  obtenerIncidenciasPorOrden,
  obtenerIncidenciaPorId
}
