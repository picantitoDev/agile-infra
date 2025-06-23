const express = require("express")
const router = express.Router()
const controladorIncidencias = require("../controllers/controladorIncidencias")

router.get("/", controladorIncidencias.obtenerIncidencias)
router.get("/:id_incidencia", controladorIncidencias.descargarPDFIncidencia);

module.exports = router