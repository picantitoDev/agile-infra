const dbOrdenes = require('../model/queriesOrdenes');
const dbProductos = require("../model/queriesProductos")
const dbProveedores = require("../model/queriesProveedores")
const dbIncidencias = require('../model/queriesIncidencias'); 

async function listarOrdenes(req, res) {
  try {
    const ordenes = await dbOrdenes.obtenerOrdenes();

    const productosBajoStock = await dbProductos.obtenerProductosCriticos();
    console.log(ordenes)
    res.render('ordenes', { ordenes, productosBajoStock, user: req.user });
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).send('Error al obtener órdenes');
  }
}

async function crearOrdenGet(req, res) {
  try {
    const productosTotales = await dbProductos.obtenerProductosParaOrden();
    console.log("Ejemplo producto:", productosTotales[0]);
    const proveedores     = await dbProveedores.obtenerProveedores();

    // Solo productos activados (ignoramos mayúsculas/minúsculas)
    const productos = productosTotales.filter(
      p => (p.estado || '').toLowerCase() === 'activado'
    );

    // IDs de proveedores con productos críticos (forzamos a Number)
    const proveedoresConStockBajo = new Set(
      productos
        .filter(p => Number(p.stock) < Number(p.cantidad_minima))
        .map(p => Number(p.id_proveedor))
    );

    // Marcamos cada proveedor
    const proveedoresMarcados = proveedores.map(p => ({
      ...p,
      tieneStockBajo: proveedoresConStockBajo.has(Number(p.id_proveedor))
    }));

  const productosEnCurso = await dbProductos.obtenerProductosEnOrdenesEnCurso();

  // console.log("Productos en curso: ")
  //   console.log(productosEnCurso)

    res.render('crearOrden', {
      proveedores: proveedoresMarcados,
      productos,
      productosEnCurso // <-- aquí pasamos la lista para el frontend
    });
    } catch (error) {
    console.error('Error al crear orden:', error);
    res.status(500).send('Error al crear orden');
  }
}



async function crearOrdenPost(req, res) {
  try {
    const proveedor = parseInt(req.body.proveedor);
    let productos = JSON.parse(req.body.productos);

    // Agregar el campo 'ingresado' a cada producto
    productos = productos.map(p => ({
      ...p,
      ingresado: 0
    }));

    const ahora = new Date();
    const fechaConOffset = new Date(ahora.getTime() + 5 * 60 * 60 * 1000);

    await dbOrdenes.crearOrden(proveedor, productos, fechaConOffset, 'en_curso');

    res.redirect("/ordenes");
  } catch (error) {
    console.error('Error al crear orden:', error);
    res.status(500).send('Error al crear orden');
  }
}


async function obtenerOrdenPorId(req, res) {
  try {
    const id_order = req.params.id;
    const orden = await dbOrdenes.obtenerOrdenPorId(id_order);

    if (!orden) {
      return res.status(404).json({ mensaje: 'Orden no encontrada' });
    }

    // 🔍 Buscar incidencias asociadas a la orden
    const incidencias = await dbIncidencias.obtenerIncidenciasPorOrden(id_order);

    // Incluir las incidencias en el JSON de respuesta
    console.log(orden)
    res.json({ ...orden, incidencias });

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