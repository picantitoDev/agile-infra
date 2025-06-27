const dbProveedores = require("../model/queriesProveedores")

async function obtenerProveedores(req, res) {
  try {
    const proveedores = await dbProveedores.obtenerProveedores()
    res.render("proveedores", { proveedores })
  } catch (error) {
    console.error("Error al obtener proveedores:", error)
    res.status(500).send("Error al obtener los proveedores")
  }
}

async function nuevoProveedorGet(req, res) {
  try {
    const proveedores = await dbProveedores.obtenerProveedores()
    res.render("nuevoProveedor", { proveedores })
  } catch (error) {
    console.error("Error al cargar registro de proveedores:", error)
    res.status(500).send("Error al cargar registro de proveedores")
  }
}

async function nuevoProveedorPost(req, res) {
  const { razon_social, ruc, numero_telefono, correo, direccion } = req.body

  try {
    await dbProveedores.insertarProveedor({
      razon_social,
      ruc,
      numero_telefono,
      correo,
      direccion,
    })
    res.redirect("/proveedores")
  } catch (error) {
    console.error("Error al cargar registro de proveedores:", error)
    res.status(500).send("Error al cargar registro de proveedores")
  }
}

async function editarProveedorGet(req, res){
  const id = req.params.id;
  const proveedor = await dbProveedores.obtenerProveedorPorId(id); // función en queries
  const proveedores = await dbProveedores.obtenerProveedores()
  res.render('detalleProveedor', { proveedor, proveedores });
};

async function editarProveedorPut(req, res){
  const id = req.params.id;
  const datos = req.body;
  await dbProveedores.actualizarProveedor(id, datos);
  res.redirect('/proveedores');
};

module.exports = {
  obtenerProveedores,
  nuevoProveedorGet,
  nuevoProveedorPost,
  editarProveedorGet,
  editarProveedorPut
}
