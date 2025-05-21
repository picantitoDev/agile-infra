const dbOrdenes = require('../model/queriesOrdenes');
const dbProductos = require("../model/queriesProductos")
const dbProveedores = require("../model/queriesProveedores")
async function listarOrdenes (req, res) {
  try {
    const ordenes = await dbOrdenes.obtenerOrdenes();
    ordenes.map(orden => ({
  ...orden,
  fecha: new Date(orden.fecha).toISOString() 
    }));
    console.log(ordenes)
    res.render('ordenes', { ordenes, user: req.user });
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).send('Error al obtener órdenes');
  }
};

async function crearOrdenGet(req, res){
  try{
    const productosTotales = await dbProductos.obtenerProductos()
    const proveedores = await dbProveedores.obtenerProveedores()
    const productos = productosTotales.filter((p) => p.estado === "Activado")
    res.render("crearOrden", {proveedores, productos})
  }
catch(error){
      console.error('Error al crear orden:', error);
      res.status(500).send('Error al crear orden');
  }
}

async function crearOrdenPost(req, res) {
  try {
    // 1. Extraer y parsear los datos del body
    const proveedor = parseInt(req.body.proveedor);
    const productos = JSON.parse(req.body.productos); // Convertir el string JSON a array de objetos

    // 2. Crear la fecha actual con 5 horas más
    const ahora = new Date();
    const fechaConOffset = new Date(ahora.getTime() + 5 * 60 * 60 * 1000); // suma 5 horas

    // 3. Insertar la orden en la base de datos
    await dbOrdenes.crearOrden(proveedor, productos, fechaConOffset);

    // 4. Redireccionar
    res.redirect("/ordenes");
  } catch (error) {
    console.error('Error al crear orden:', error);
    res.status(500).send('Error al crear orden');
  }
}

async function obtenerOrdenPorId(req, res) {
  try {
    const id_order = req.params.id; // tomamos el id de la URL
    const orden = await dbOrdenes.obtenerOrdenPorId(id_order);

    if (!orden) {
      return res.status(404).json({ mensaje: 'Orden no encontrada' });
    }

    res.json(orden);
    console.log(orden);
  } catch (error) {
    console.error('Error al obtener la orden por ID:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}

module.exports = {
    listarOrdenes,
    crearOrdenGet,
    crearOrdenPost,
    obtenerOrdenPorId
}