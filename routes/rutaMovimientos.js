const express = require("express")
const router = express.Router()
const controladorMovimientos = require("../controllers/controladorMovimientos")

// Ruta para obtener todos los movimientos
router.get("/", controladorMovimientos.obtenerMovimientos)
router.get("/detalle/:id", controladorMovimientos.verDetalleMovimiento)

module.exports = router
