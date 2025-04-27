const express = require("express")
const router = express.Router()
const controladorUsuarios = require("../controllers/controladorUsuarios")

router.get("/", controladorUsuarios.obtenerUsuarios)
router.get("/nuevo", controladorUsuarios.crearUsuarioGet)
router.post("/nuevo", controladorUsuarios.crearUsuarioPost)

module.exports = router
