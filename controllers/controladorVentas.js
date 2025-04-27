const dbVentas = require("../model/queriesVentas")
const dbProductos = require("../model/queriesProductos")
const pool = require("../model/pool")
const ejs = require("ejs")
const path = require("path")
const fs = require("fs")

async function obtenerVentas(req, res) {
  try {
    const ventas = await dbVentas.obtenerVentas()
    res.render("ventas", { ventas })
  } catch (error) {
    console.error("Error al obtener ventas:", error)
    res.status(500).send("Error al obtener las ventas")
  }
}

async function crearVentaGet(req, res) {
  try {
    const productos = await dbProductos.obtenerProductos()
    res.render("nuevaVenta", { productos })
  } catch (error) {
    console.error("Error al obtener ventas:", error)
    res.status(500).send("Error al obtener las ventas")
  }
}

async function crearVentaPost(req, res) {
  try {
    const {
      tipo_comprobante,
      cliente_nombre,
      cliente_dni,
      cliente_ruc,
      razon_social,
      direccion_cliente,
      correo_cliente,
      descripcion,
      total,
      productos,
    } = req.body
    console.log(req.body)
    // Validar productos antes de parsear
    if (!productos || productos.trim() === "") {
      throw new Error("La lista de productos está vacía o no fue enviada.")
    }

    const productosVendidos = JSON.parse(productos)
    console.log(productosVendidos)

    // Insertar venta
    const id_venta = await dbVentas.insertarVenta({
      tipo_comprobante,
      cliente_nombre,
      cliente_dni,
      cliente_ruc,
      razon_social,
      direccion_cliente,
      correo_cliente,
      descripcion,
      total,
    })

    // Insertar detalle venta
    await dbVentas.generarDetalleVenta(id_venta, productosVendidos)

    res.redirect("/ventas")
  } catch (err) {
    console.error("Error al crear venta:", err.message)
    res.status(500).send("Error interno al crear la venta")
  }
}

async function obtenerDetalleVenta(req, res) {
  const { id_venta } = req.params
  try {
    const venta = await pool.query("SELECT * FROM venta WHERE id_venta = $1", [
      id_venta,
    ])
    const detalleVenta = await pool.query(
      `
      SELECT 
        dv.*, 
        p.*
      FROM detalle_venta dv
      JOIN producto p ON dv.id_producto = p.id_producto
      WHERE dv.id_venta = $1
      `,
      [id_venta]
    )

    console.log(detalleVenta.rows)

    res.render("detalleVenta", {
      venta: venta.rows[0],
      detalle: detalleVenta.rows,
    })
  } catch (error) {
    console.error("Error al obtener el detalle de la venta:", error)
    res.status(500).send("Error al obtener el detalle de la venta")
  }
}

module.exports = {
  obtenerVentas,
  crearVentaGet,
  crearVentaPost,
  obtenerDetalleVenta,
}
