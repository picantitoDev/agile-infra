const dbMovimientos = require("../model/queriesMovimientos")

async function obtenerMovimientos(req, res) {
  try {
    const movimientos = await dbMovimientos.obtenerMovimientos()
    res.render("movimientos", { movimientos })
  } catch (error) {
    console.error("Error al obtener movimientos:", error)
    res.status(500).send("Error al obtener los movimientos")
  }
}

module.exports = {
  obtenerMovimientos,
}
