const dbIncidencias = require("../model/queriesIncidencias")

async function obtenerIncidencias(req, res) {
  try {
    const incidencias = await dbIncidencias.obtenerIncidencias()

    const procesadas = incidencias.map(inc => ({
      ...inc,
      detalle_productos: Array.isArray(inc.detalle_productos)
        ? inc.detalle_productos
        : JSON.parse(inc.detalle_productos)
    }));

    console.log(procesadas)

    res.render("incidencias", { incidencias: procesadas, title: "Incidencias" })
  } catch (error) {
    console.error("Error al obtener categorias:", error)
    res.status(500).send("Error al obtener las categorias")
  }
}


module.exports = {
obtenerIncidencias
}