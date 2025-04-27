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

async function verDetalleMovimiento(req, res) {
  try {
    const idMov = req.params.id
    const movimientoDetalle = await dbMovimientos.obtenerDetalleMovimiento(
      idMov
    )

    if (movimientoDetalle.length === 0) {
      return res.status(404).send("Movimiento no encontrado")
    }

    res.render("detalleMovimiento", { movimientoDetalle })
  } catch (error) {
    console.error("Error al obtener detalle de movimiento:", error)
    res.status(500).send("Error al obtener detalle del movimiento")
  }
}

module.exports = {
  obtenerMovimientos,
  verDetalleMovimiento,
}
