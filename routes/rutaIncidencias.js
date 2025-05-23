const express = require("express")
const router = express.Router()
const controladorIncidencias = require("../controllers/controladorIncidencias")

router.get("/", controladorIncidencias.obtenerIncidencias)

module.exports = router