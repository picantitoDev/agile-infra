const pool = require("./pool")

async function registrarAuditoriaProducto({ id_producto, id_usuario, accion, campos_modificados, fecha }) {
  await pool.query(
    `INSERT INTO auditoria_producto 
     (id_producto, id_usuario, accion, campos_modificados, fecha) 
     VALUES ($1, $2, $3, $4, $5)`,
    [id_producto, id_usuario, accion, campos_modificados, fecha]
  );
}


async function obtenerAuditoriasConUsuarios() {
  const result = await pool.query(`
    SELECT 
      a.id_auditoria,
      a.id_producto,
      p.nombre AS nombre_producto,
      a.id_usuario,
      u.username,
      a.accion,
      a.campos_modificados,
      a.fecha
    FROM auditoria_producto a
    JOIN usuarios u ON a.id_usuario = u.id
    JOIN producto p ON a.id_producto = p.id_producto
    ORDER BY a.fecha DESC
  `)
  return result.rows
}


module.exports = {
registrarAuditoriaProducto,
obtenerAuditoriasConUsuarios
}