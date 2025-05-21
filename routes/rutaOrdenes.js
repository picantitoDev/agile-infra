const express = require('express');
const router = express.Router();
const controladorOrdenes = require('../controllers/controladorOrdenes');

// Ruta para listar órdenes
router.get('/', controladorOrdenes.listarOrdenes);
router.get("/nueva", controladorOrdenes.crearOrdenGet);
router.post("/nueva", controladorOrdenes.crearOrdenPost)
router.get('/:id', controladorOrdenes.obtenerOrdenPorId);
module.exports = router;