const dbMovimientos = require("../model/queriesMovimientos")
const dbProductos = require("../model/queriesProductos")

async function obtenerMovimientos(req, res) {
  try {
    const movimientos = await dbMovimientos.obtenerMovimientos()
    res.render("movimientos", { movimientos })
  } catch (error) {
    console.error("Error al obtener movimientos:", error)
    res.status(500).send("Error al obtener los movimientos")
  }
}

async function verDetalleMovimiento(req, res) {
  try {
    const idMov = req.params.id
    const movimientoDetalle = await dbMovimientos.obtenerDetalleMovimiento(
      idMov
    )

    if (movimientoDetalle.length === 0) {
      return res.status(404).send("Movimiento no encontrado")
    }

    res.render("detalleMovimiento", { movimientoDetalle })
  } catch (error) {
    console.error("Error al obtener detalle de movimiento:", error)
    res.status(500).send("Error al obtener detalle del movimiento")
  }
}

async function registrarVentaGet(req, res) {
  try {
    const productos = await dbProductos.obtenerProductos()
    res.render("nuevaVenta", { productos })
  } catch (error) {
    console.error("Error al obtener detalle de movimiento:", error)
    res.status(500).send("Error al obtener detalle del movimiento")
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

  console.log(req.body)
  const usuarioId = req.user.id
  const fecha = new Date() // Fecha actual

  // Parseamos el JSON de productos
  const productosArray = JSON.parse(productos)

  try {
    const id_movimiento = await dbMovimientos.registrarMovimiento({
      id_usuario: usuarioId, // Asegúrate de que el usuario esté autenticado
      tipo: "Venta", // O el tipo que corresponda
      fecha: fecha,
      descripcion,
    })

    await dbMovimientos.registrarMovimientoVenta({
      id_movimiento,
      nombre_cliente: cliente_nombre,
      razon_social,
      dni_cliente: cliente_dni,
      ruc_cliente: cliente_ruc,
      correo_cliente,
      direccion_cliente,
      tipo_comprobante,
      total,
    })

    for (let producto of productosArray) {
      const { id_producto, cantidad, precio_unitario } = producto
      const subtotal = cantidad * parseFloat(precio_unitario)

      await dbMovimientos.registrarProductoMovimiento({
        id_producto,
        id_movimiento,
        cantidad,
        precio_unitario,
        subtotal,
      })
    }

    res.redirect("/movimientos") // Redirige después de la venta
  } catch (error) {
    console.error("Error al obtener detalle de movimiento:", error)
    res.status(500).send("Error al obtener detalle del movimiento")
  }
}

module.exports = {
  obtenerMovimientos,
  registrarVentaGet,
  registrarVentaPost,
  verDetalleMovimiento,
}
