const express = require("express")
const router = express.Router()
const controladorCategorias = require("../controllers/controladorCategorias")

// Mostrar lista de categorías
router.get("/", controladorCategorias.obtenerCategorias)

// Crear una nueva categoría (POST)
router.post("/", controladorCategorias.crearCategoria)

module.exports = router
