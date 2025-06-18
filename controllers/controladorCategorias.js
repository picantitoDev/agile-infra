const dbCategorias = require("../model/queriesCategorias")

async function obtenerCategorias(req, res) {
  try {
    const categorias = await dbCategorias.obtenerCategorias()
    res.render("categorias", { categorias, title: "Categorías" })
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

async function renombrarCategoria(req, res) {
  const { id } = req.params
  const { nombre } = req.body

  if (!nombre || !nombre.trim()) {
    return res.status(400).send("El nombre no puede estar vacío.")
  }

  try {
    await dbCategorias.renombrarCategoria(id, nombre.trim())
    res.sendStatus(200)
  } catch (error) {
    console.error("Error al renombrar categoría:", error)
    res.status(500).send("Error al renombrar la categoría")
  }
}

async function cambiarEstadoCategoria(req, res) {
  const { id } = req.params
  const { estado } = req.body

  if (!["activa", "inactiva"].includes(estado)) {
    return res.status(400).send("Estado inválido.")
  }

  try {
    await dbCategorias.cambiarEstadoCategoria(id, estado)
    res.sendStatus(200)
  } catch (error) {
    console.error("Error al cambiar estado de categoría:", error)
    res.status(500).send("Error al cambiar el estado de la categoría")
  }
}

module.exports = {
  obtenerCategorias,
  crearCategoria,
  renombrarCategoria,
  cambiarEstadoCategoria,
}