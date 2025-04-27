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

module.exports = {
  obtenerProveedores,
}
