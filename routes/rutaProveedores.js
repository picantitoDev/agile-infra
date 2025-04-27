const express = require("express")
const router = express.Router()
const controladorProveedores = require("../controllers/controladorProveedores")

router.get("/", controladorProveedores.obtenerProveedores)

module.exports = router
