const dbOrdenes = require('../model/queriesOrdenes');
const dbProductos = require("../model/queriesProductos")
const dbProveedores = require("../model/queriesProveedores")
const dbIncidencias = require('../model/queriesIncidencias'); 
const pdfUtil = require("../utils/pdfGenerator")
const nodemailer = require("nodemailer");

async function listarOrdenes(req, res) {
  try {
    const ordenes = await dbOrdenes.obtenerOrdenes();

    const productosBajoStock = await dbProductos.obtenerProductosCriticos();
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
    const proveedorId = parseInt(req.body.proveedor);
    let productos = JSON.parse(req.body.productos);

    productos = productos.map(p => ({
      ...p,
      ingresado: 0,
    }));

const fechaLima = DateTime.now().setZone('America/Lima').toJSDate();


    // Crear orden y obtener ID
    const idOrden = await dbOrdenes.crearOrden(proveedorId, productos, fechaLima, 'en_curso');

    // Obtener datos completos para generar PDF
    const orden = await dbOrdenes.obtenerOrdenPorId(idOrden);

    // Generar PDF
    const pdfBuffer = await pdfUtil.generarOrdenPDF(orden);

    // Obtener datos del proveedor (correo)
    const proveedor = await dbProveedores.obtenerProveedorPorId(proveedorId);
    const correoDestino = proveedor.correo;

    // Configurar transporte (misma config que recuperación)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'stockcloud.soporte@gmail.com',
        pass: 'ktte cwnu eojo eaxt', // contraseña de aplicación
      },
    });

    // Enviar correo con PDF adjunto
    await transporter.sendMail({
      from: 'stockcloud.soporte@gmail.com',
      to: correoDestino,
      subject: `Nueva Orden de Reabastecimiento N.º ${idOrden}`,
      html: `
        <p>Estimado proveedor,</p>
        <p>Adjunto encontrará los detalles de la orden de reabastecimiento número <strong>${idOrden}</strong>.</p>
        <p>Saludos,<br>Equipo de StockCloud</p>
      `,
      attachments: [
        {
          filename: `orden_${idOrden}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    res.redirect("/ordenes");
  } catch (error) {
    console.error('Error al crear orden y enviar PDF:', error);
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

async function detalleOrden(req, res){
    try {
    const id_order = req.params.id;
    const orden = await dbOrdenes.obtenerOrdenPorId(id_order);

    if (!orden) {
      return res.status(404).json({ mensaje: 'Orden no encontrada' });
    }
    const incidencias = await dbIncidencias.obtenerIncidenciasPorOrden(id_order);

    res.render('detalleOrden', { orden, incidencias});

  } catch (error) {
    console.error('Error al obtener la orden por ID:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}

async function generarOrdenPDF(req, res) {
  try {
    const id_order = req.params.id;

    const orden = await dbOrdenes.obtenerOrdenPorId(id_order);

    if (!orden) {
      return res.status(404).send("Orden no encontrada");
    }

    // Llamar a la función que genera el PDF
    const pdfBuffer = await pdfUtil.generarOrdenPDF(orden);

    // Configurar encabezados y enviar el PDF al navegador
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=orden_${id_order}.pdf`);
    res.send(pdfBuffer);

  } catch (err) {
    console.error("Error al generar PDF de orden:", err);
    res.status(500).send("Error al generar el PDF");
  }
}

async function obtenerOrdenPorProducto(req, res) {
  const idProducto = parseInt(req.params.idProducto);
  console.log("🧪 Producto recibido:", idProducto);

  try {
    const orden = await dbOrdenes.buscarOrdenPorProductoEnCurso(idProducto);

    if (orden) {
      res.json(orden);
    } else {
      res.status(404).json({ error: 'Orden no encontrada para este producto' });
    }
  } catch (error) {
    console.error('Error al buscar orden por producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function detalleOrdenPorFecha(req, res){
  try {
    const { fecha } = req.params;
    const detalle = await dbOrdenes.obtenerDetalleOrdenesPorFecha(fecha);
    res.json(detalle);
  } catch (error) {
    console.error('Error al obtener detalle de órdenes por fecha:', error);
    res.status(500).json({ error: 'Error interno al obtener detalle de órdenes' });
  }
};

module.exports = {
    listarOrdenes,
    crearOrdenGet,
    crearOrdenPost,
    obtenerOrdenPorId,
    detalleOrden,
    generarOrdenPDF,
    obtenerOrdenPorProducto,
    detalleOrdenPorFecha
}