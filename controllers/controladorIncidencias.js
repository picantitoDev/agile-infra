const dbIncidencias = require("../model/queriesIncidencias")

async function obtenerIncidencias(req, res) {
  try {
    const incidencias = await dbIncidencias.obtenerIncidencias()
    res.render("incidencias", { incidencias, title: "Incidencias" })
  } catch (error) {
    console.error("Error al obtener categorias:", error)
    res.status(500).send("Error al obtener las categorias")
  }
}


module.exports = {
obtenerIncidencias
}