const express = require("express")
const router = express.Router()
const controladorVentas = require("../controllers/controladorVentas")
const pool = require("../model/pool")

router.get("/", controladorVentas.obtenerVentas)
router.get("/nueva-venta", controladorVentas.crearVentaGet)
router.post("/nueva-venta", controladorVentas.crearVentaPost)
router.get("/:id_venta", controladorVentas.obtenerDetalleVenta)
module.exports = router
