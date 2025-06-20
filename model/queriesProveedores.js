const pool = require("./pool")

async function obtenerProveedores() {
  const { rows } = await pool.query(
    `SELECT * FROM proveedor ORDER BY id_proveedor ASC`
  )
  return rows
}

async function insertarProveedor({
  razon_social,
  ruc,
  numero_telefono,
  correo,
  direccion,
}) {
  await pool.query(
    `INSERT INTO proveedor (razon_social, ruc, numero_telefono, correo, direccion)
     VALUES ($1, $2, $3, $4, $5)`,
    [razon_social, ruc, numero_telefono, correo, direccion]
  )
}

const obtenerProveedorPorId = async (id) => {
  const result = await pool.query('SELECT * FROM proveedor WHERE id_proveedor = $1', [id]);
  return result.rows[0];
};

const actualizarProveedor = async (id, datos) => {
  const { razon_social, ruc, numero_telefono, correo, direccion } = datos;
  await pool.query(`
    UPDATE proveedor SET 
      razon_social = $1,
      ruc = $2,
      numero_telefono = $3,
      correo = $4,
      direccion = $5
    WHERE id_proveedor = $6
  `, [razon_social, ruc, numero_telefono, correo, direccion, id]);
};

module.exports = {
  obtenerProveedores,
  insertarProveedor,
  obtenerProveedorPorId,
  actualizarProveedor
}
