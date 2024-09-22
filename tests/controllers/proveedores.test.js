const express = require("express");
const router = express.Router();
const dbProveedores = require("../model/queriesProveedores");

// ---------- GET /proveedores ----------
router.get("/", async (req, res) => {
  try {
    const proveedores = await dbProveedores.obtenerProveedores();

    // Normalización por si la DB devuelve otras columnas
    const normalizados = proveedores.map(p => ({
      id: p.id ?? p.id_proveedor,
      razon_social: p.razon_social ?? p.nombre,
    }));

    res.render("proveedores", { proveedores: normalizados });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener los proveedores");
  }
});

// ---------- GET /proveedores/nuevo ----------
router.get("/nuevo", async (req, res) => {
  try {
    const proveedores = await dbProveedores.obtenerProveedores();

    const normalizados = proveedores.map(p => ({
      id: p.id ?? p.id_proveedor,
      razon_social: p.razon_social ?? p.nombre,
    }));

    res.render("nuevoProveedor", { proveedores: normalizados });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al cargar registro de proveedores");
  }
});

// ---------- POST /proveedores/nuevo ----------
router.post("/nuevo", async (req, res) => {
  try {
    const nuevoProveedor = {
      razon_social: req.body.razon_social,
      ruc: req.body.ruc,
      numero_telefono: req.body.numero_telefono,
      correo: req.body.correo,
      direccion: req.body.direccion,
    };

    await dbProveedores.insertarProveedor(nuevoProveedor);
    res.redirect("/proveedores");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al cargar registro de proveedores");
  }
});

// ---------- GET /proveedores/editar/:id ----------
router.get("/editar/:id", async (req, res) => {
  try {
    const proveedor = await dbProveedores.obtenerProveedorPorId(req.params.id);
    const proveedores = await dbProveedores.obtenerProveedores();

    const normalizados = proveedores.map(p => ({
      id: p.id ?? p.id_proveedor,
      razon_social: p.razon_social ?? p.nombre,
    }));

    res.render("detalleProveedor", { proveedor, proveedores: normalizados });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener proveedor para edición");
  }
});

// ---------- PUT /proveedores/:id ----------
router.put("/:id", async (req, res) => {
  try {
    await dbProveedores.actualizarProveedor(req.params.id, req.body);
    res.redirect("/proveedores");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al actualizar proveedor");
  }
});

module.exports = router;
