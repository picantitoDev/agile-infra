const dbMovimientos = require("../model/queriesMovimientos")
const dbProductos = require("../model/queriesProductos")
const dbProveedores = require("../model/queriesProveedores")
const dbIncidencias = require("../model/queriesIncidencias")
const dbUsuarios = require("../model/queriesUsuarios")
const dbClientes = require("../model/queriesClientes")
const dbOrdenes = require("../model/queriesOrdenes")
const pdfUtils = require("../utils/pdfGenerator")
const excelUtils = require("../utils/excelGenerator")

const { DateTime } = require("luxon")

async function obtenerMovimientos(req, res) {
  try {
    const movimientos = await dbMovimientos.obtenerMovimientos()
    const usuarios = await dbUsuarios.obtenerUsuarios()
    res.render("movimientos", { movimientos, usuarios })
  } catch (error) {
    console.error("Error al obtener movimientos:", error)
    res.status(500).send("Error al obtener los movimientos")
  }
}

async function exportarReporteExcel(req, res) {
  try {
    const { tipo, desde, hasta } = req.query;
    console.log(req.query);

    // Validar que se reciban los parámetros necesarios
    if (!tipo) {
      return res.status(400).send("El parámetro 'tipo' es obligatorio");
    }
    if (!desde || !hasta) {
      return res.status(400).send("Debe especificar los parámetros 'desde' y 'hasta'");
    }

    let buffer;

    switch (tipo) {
      case 'Venta':
        buffer = await excelUtils.generarExcelVentas(desde, hasta);
        break;
      case 'Compra':
        buffer = await excelUtils.generarExcelEntradas(desde, hasta);
        break;
      case 'Merma':
        buffer = await excelUtils.generarExcelMermas(desde, hasta);
        break;
      case 'Sobrante':
        buffer = await excelUtils.generarExcelSobrantes(desde, hasta);
        break;
      case 'Todos':
        buffer = await excelUtils.generarExcelTodos(desde, hasta);
        break;
      default:
        return res.status(400).send("Tipo de reporte no válido. Debe ser uno de: ventas, entradas, mermas, sobrantes, todos.");
    }

    // Configurar headers para que el navegador descargue el archivo
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Nombre del archivo con fecha para mejor orden
    const fechaDesde = new Date(desde).toISOString().split('T')[0];
    const fechaHasta = new Date(hasta).toISOString().split('T')[0];
    const nombreArchivo = `Reporte_${tipo}_${fechaDesde}_a_${fechaHasta}.xlsx`;

    res.setHeader('Content-Disposition', `attachment; filename=${nombreArchivo}`);

    // Enviar buffer
    res.send(buffer);

  } catch (error) {
    console.error("Error exportando Excel:", error);
    res.status(500).send("Error generando el reporte");
  }
}

async function verDetalleMovimiento(req, res) {
  try {
    const idMov = req.params.id
    const movimientoDetalle = await dbMovimientos.obtenerDetalleMovimiento(
      idMov
    )

    console.log(movimientoDetalle)
    if (movimientoDetalle.length === 0) {
      return res.status(404).send("Movimiento no encontrado")
    }

    const proveedores = await dbProveedores.obtenerProveedores()
    console.log(proveedores)

    res.render("detalleMovimiento", { movimientoDetalle, proveedores })
  } catch (error) {
    console.error("Error al obtener detalle de movimiento:", error)
    res.status(500).send("Error al obtener detalle del movimiento")
  }
}

async function registrarVentaGet(req, res) {
  try {
    const productosTotales = await dbProductos.obtenerProductos()
    const productos = productosTotales.filter(
      (p) => p.estado === "Activado" && p.stock > 0
    )
    res.render("nuevaVenta", { productos })
  } catch (error) {
    console.error("Error al obtener productos para la venta:", error)
    res.status(500).send("Error al obtener productos para la venta")
  }
}

async function registrarVentaPost(req, res) {
  const {
    tipo_comprobante,
    cliente_nombre,
    cliente_dni,
    razon_social,
    cliente_ruc,
    direccion_cliente,
    correo_cliente,
    productos, // Este campo es un string JSON, lo convertimos a objeto
    total,
    descripcion,
  } = req.body

  const usuarioId = req.user.id
  const fecha = DateTime.now().minus({ hours: 5 }).toISO()
  console.log(fecha)
  // Parseamos el JSON de productos
  const productosArray = JSON.parse(productos)

  try {
    let clienteExistente
    let id_cliente

    // 1. Verificar si el cliente ya existe según el tipo de comprobante
    if (tipo_comprobante === "boleta") {
      clienteExistente = await dbClientes.buscarPorDNI(cliente_dni)
    } else if (tipo_comprobante === "factura") {
      clienteExistente = await dbClientes.buscarPorRUC(cliente_ruc)
    }

    if (clienteExistente) {
      // Cliente ya existe
      id_cliente = clienteExistente.id_cliente
    } else {
      // Cliente no existe, lo registramos
      id_cliente = await dbClientes.registrarCliente({
        nombre_cliente: cliente_nombre,
        razon_social,
        dni_cliente: cliente_dni,
        ruc_cliente: cliente_ruc,
        direccion_cliente,
        correo_cliente,
      })
    }

    // 2. Se registra el nuevo movimiento
    const id_movimiento = await dbMovimientos.registrarMovimiento({
      id_usuario: usuarioId,
      tipo: "Venta",
      fecha: fecha,
      descripcion,
    })

    // 3. Se registra la venta vinculada al cliente
    await dbMovimientos.registrarMovimientoVenta({
      id_movimiento,
      id_cliente,
      tipo_comprobante,
      total,
    })

    // 4. Se registran los productos en el detalle
    await Promise.all(
      productosArray.map(async (producto) => {
        const { id_producto, cantidad, precio_unitario } = producto
        const subtotal = cantidad * parseFloat(precio_unitario)

        // Ejecuta ambas operaciones en paralelo
        await dbMovimientos.registrarProductoMovimiento({
          id_producto,
          id_movimiento,
          cantidad,
          precio_unitario,
          subtotal,
        })

        await dbProductos.disminuirStock(id_producto, cantidad)
      })
    )

    // 5. Redireccionar al listado de movimientos
    res.redirect("/movimientos")
  } catch (error) {
    console.error("Error al obtener detalle de movimiento:", error)
    res.status(500).send("Error al obtener detalle del movimiento")
  }
}

async function registrarEntradaGet(req, res) {
  try {
    const productosTotales = await dbProductos.obtenerProductos()
    const proveedores = await dbProveedores.obtenerProveedores()
    const productos = productosTotales.filter((p) => p.estado === "Activado")
    res.render("nuevaEntrada", { productos, proveedores })
  } catch (error) {
    console.error("Error al obtener detalle de movimiento:", error)
    res.status(500).send("Error al obtener detalle del movimiento")
  }
}

async function registrarEntradaPost(req, res) {
  const {
    proveedor,
    productos,
    total,
    descripcion,
    id_orden, 
  } = req.body;

  console.log(req.body)

  const usuarioId = req.user.id // Asegúrate de que el usuario esté autenticado
  const fecha = DateTime.now().minus({ hours: 5 }).toISO()

  // Parseamos el JSON de productos
  const productosArray = JSON.parse(productos)

  try {
    // 1. Registrar el movimiento principal (tipo = "Compra")
    const id_movimiento = await dbMovimientos.registrarMovimiento({
      id_usuario: usuarioId,
      tipo: "Compra", // Tipo de movimiento
      fecha: fecha,
      descripcion,
    })

    // 2. Registrar el movimiento de compra con el proveedor y el total
    await dbMovimientos.registrarMovimientoCompra({
      id_movimiento,
      id_proveedor: proveedor,
      total,
      id_orden, // la id orden se pasa al query tambien
    });

    // 3. Registrar los productos en `producto_movimiento` y actualizar el stock
    for (let producto of productosArray) {
      const { id_producto, cantidad, precio_unitario } = producto
      const subtotal = cantidad * parseFloat(precio_unitario)

      // 3.1 Registrar en `producto_movimiento`
      await dbMovimientos.registrarProductoMovimiento({
        id_producto,
        id_movimiento,
        cantidad,
        precio_unitario,
        subtotal,
      })
      await dbProductos.aumentarStock(id_producto, cantidad)
    }
    // 4. Registrar la incidencia si existe alguna
    if (id_orden) {
      const orden = await dbOrdenes.obtenerOrdenPorId(id_orden); // Debe devolver { products: [...] }
      const productosOrden = orden.products;

      for (let productoEntrada of productosArray) {
        const productoOrden = productosOrden.find(p => p.id_producto === productoEntrada.id_producto);
        if (productoOrden) {
          productoOrden.ingresado = (productoOrden.ingresado || 0) + productoEntrada.cantidad;
        }
      }

      await dbOrdenes.actualizarProductosOrden(id_orden, productosOrden);
    }

    // Registro de incidencias
    const productosConIncidencia = productosArray.filter(
      p => p.incidencia && p.incidencia.trim() !== ""
    );

    if (productosConIncidencia.length > 0) {
      const detalleIncidencias = productosConIncidencia.map(p => ({
        id_producto: p.id_producto,
        nombre: p.nombre,
        cantidad: p.cantidad,
        incidencia: p.incidencia,
      }));

      await dbIncidencias.registrarIncidencia({
        id_movimiento,
        id_orden: id_orden || null,
        descripcion_general: descripcion || "Complicaciones en la Llegada de la Entrada",
        detalle_productos: detalleIncidencias,
        fecha: fecha,
      });
    }

    // 5. Si no hubo incidencias y todo fue ingresado
    if (productosConIncidencia.length === 0 && id_orden) {
      const orden = await dbOrdenes.obtenerOrdenPorId(id_orden);
      const completada = orden.products.every(p => p.ingresado >= p.cantidad);
      if (completada) {
        await dbOrdenes.actualizarEstadoOrden(id_orden, 'finalizada');
      }
    }


    res.redirect("/movimientos") // Redirige después de registrar la entrada
  } catch (error) {
    console.error("Error al registrar entrada:", error)
    res.status(500).send("Error al registrar entrada")
  }
}

async function registrarSobranteGet(req, res) {
  try {
    const productosTotales = await dbProductos.obtenerProductos()
    const productos = productosTotales.filter((p) => p.estado === "Activado")
    res.render("nuevoSobrante", { productos })
  } catch (error) {
    console.error("Error al registrar sobrante:", error)
    res.status(500).send("Error al registrar sobrante")
  }
}

async function registrarSobrantePost(req, res) {
  const { producto, cantidad, motivo, descripcion } = req.body
  try {
    const idProducto = await dbProductos.obtenerIdProductoPorNombre(producto)
    const objProducto = await dbProductos.obtenerProductoPorId(idProducto)
    const cantidadNumerica = parseInt(cantidad)
    const usuarioId = req.user.id
    const fecha = DateTime.now().minus({ hours: 5 }).toISO()

    console.log("Fecha de Ajuste: ", fecha)
    console.log("Id de Producto: ", idProducto)
    console.log("Cantidad de Productos: ", cantidadNumerica)
    console.log("Motivo de Ajuste: ", motivo)
    console.log("Descripcion: ", descripcion)

    const id_movimiento = await dbMovimientos.registrarMovimiento({
      id_usuario: usuarioId,
      tipo: "Sobrante", // Tipo de movimiento
      fecha: fecha,
      descripcion,
    })

    await dbMovimientos.registrarMovimientoAjuste({
      id_movimiento,
      tipo_ajuste: "Sobrante",
      motivo,
    })

    await dbMovimientos.registrarProductoMovimiento({
      id_producto: idProducto,
      id_movimiento,
      cantidad,
      precio_unitario: objProducto.precio_unitario,
      subtotal: parseFloat(objProducto.precio_unitario * cantidad),
    })

    await dbProductos.aumentarStock(idProducto, cantidadNumerica)

    res.redirect("/movimientos")
  } catch (error) {
    console.error("Error al obtener detalle de movimiento:", error)
    res.status(500).send("Error al obtener detalle del movimiento")
  }
}

async function registrarMermaGet(req, res) {
  try {
    const productosTotales = await dbProductos.obtenerProductos()
    const productos = productosTotales.filter(
      (p) => p.estado === "Activado" && p.stock > 0
    )
    res.render("nuevaMerma", { productos })
  } catch (error) {
    console.error("Error al obtener detalle de movimiento:", error)
    res.status(500).send("Error al obtener detalle del movimiento")
  }
}

async function registrarMermaPost(req, res) {
  const { producto, cantidad, motivo, descripcion } = req.body
  try {
    const idProducto = await dbProductos.obtenerIdProductoPorNombre(producto)
    const objProducto = await dbProductos.obtenerProductoPorId(idProducto)
    const cantidadNumerica = parseInt(cantidad)
    const usuarioId = req.user.id
    const fecha = DateTime.now().minus({ hours: 5 }).toISO()

    console.log("Fecha de Ajuste: ", fecha)
    console.log("Id de Producto: ", idProducto)
    console.log("Cantidad de Productos: ", cantidadNumerica)
    console.log("Motivo de Ajuste: ", motivo)
    console.log("Descripcion: ", descripcion)

    const id_movimiento = await dbMovimientos.registrarMovimiento({
      id_usuario: usuarioId,
      tipo: "Merma", // Tipo de movimiento
      fecha: fecha,
      descripcion,
    })

    await dbMovimientos.registrarMovimientoAjuste({
      id_movimiento,
      tipo_ajuste: "Merma",
      motivo,
    })

    await dbMovimientos.registrarProductoMovimiento({
      id_producto: idProducto,
      id_movimiento,
      cantidad,
      precio_unitario: objProducto.precio_unitario,
      subtotal: parseFloat(objProducto.precio_unitario * parseInt(cantidad)),
    })

    await dbProductos.disminuirStock(idProducto, cantidadNumerica)

    res.redirect("/movimientos")
  } catch (error) {
    console.error("Error al obtener detalle de movimiento:", error)
    res.status(500).send("Error al obtener detalle del movimiento")
  }
}

async function generarComprobantePDF(req, res) {
  const idVenta = req.params.id
  const dataVenta = await dbMovimientos.obtenerDetalleMovimiento(idVenta)
  console.log(dataVenta)
  const pdfBytes = await pdfUtils.generarComprobantePDF(dataVenta)

  // FACTURA_JuanPerez_20250430.pdf
  const tipoComprobante =
    dataVenta[0].tipo_comprobante === "boleta" ? "BOLETA" : "FACTURA"

  const nombre =
    dataVenta[0].tipo_comprobante === "boleta"
      ? dataVenta[0].nombre_cliente
      : dataVenta[0].razon_social

  const fecha = dataVenta[0].fecha
    .toISOString()
    .slice(0, 10)
    .split("-")
    .join("")
  console.log(fecha)
  const fileName = `${tipoComprobante}_${nombre}_${fecha}.pdf`
  res.setHeader("Content-Type", "application/pdf")
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`)

  // Send PDF
  res.send(Buffer.from(pdfBytes))
}

async function obtenerResumenMermas() {
  const mermas = await dbMovimientos.obtenerMermasUltimos30Dias();

  const resumen = {};

  mermas.forEach(m => {
    const fechaLima = DateTime
      .fromISO(m.fecha.toISOString())
      .toFormat('yyyy-MM-dd');

    resumen[fechaLima] = (resumen[fechaLima] || 0) + 1;
  });

  const resultado = Object.entries(resumen).map(([fecha, mermas]) => ({
    fecha,
    mermas
  }));

  resultado.sort((a, b) => a.fecha.localeCompare(b.fecha));

  return resultado;
}


async function obtenerResumenSobrantes() {
  const sobrantes = await dbMovimientos.obtenerSobrantesUltimos30Dias();

  const resumen = {};

  sobrantes.forEach(s => {
    const fechaLima = DateTime
      .fromISO(s.fecha.toISOString())
      .toFormat('yyyy-MM-dd');

    resumen[fechaLima] = (resumen[fechaLima] || 0) + 1;
  });

  const resultado = Object.entries(resumen).map(([fecha, sobrantes]) => ({
    fecha,
    sobrantes
  }));

  resultado.sort((a, b) => a.fecha.localeCompare(b.fecha));

  return resultado;
}

module.exports = {
  obtenerMovimientos,
  registrarVentaGet,
  registrarVentaPost,
  registrarEntradaGet,
  registrarEntradaPost,
  registrarSobranteGet,
  registrarSobrantePost,
  registrarMermaGet,
  registrarMermaPost,
  verDetalleMovimiento,
  generarComprobantePDF,
  exportarReporteExcel,
  obtenerResumenMermas,
  obtenerResumenSobrantes
}
