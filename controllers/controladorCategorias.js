const dbCategorias = require("../model/queriesCategorias")

async function obtenerCategorias(req, res) {
  try {
    const categorias = await dbCategorias.obtenerCategorias()
    res.render("categorias", { categorias })
  } catch (error) {
    console.error("Error al obtener categorias:", error)
    res.status(500).send("Error al obtener las categorias")
  }
}

async function crearCategoria(req, res) {
  const { nombre } = req.body
  try {
    await dbCategorias.crearCategoria(nombre)
    res.redirect("/categorias")
  } catch (error) {
    console.error("Error al crear categoría:", error)
    res.status(500).send("Error al crear la categoría")
  }
}

module.exports = {
  obtenerCategorias,
  crearCategoria,
}
