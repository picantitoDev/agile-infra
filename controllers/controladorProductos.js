const dbProductos = require("../model/queriesProductos")
const dbCategorias = require("../model/queriesCategorias")
const dbProveedores = require("../model/queriesProveedores")
const dbUsuarios = require("../model/queriesUsuarios")
const pdfUtils = require("../utils/pdfGenerator")

async function obtenerProductos(req, res) {
  try {
    const productos = await dbProductos.obtenerProductos()
    const categorias = await dbCategorias.obtenerCategorias()

    res.render("productos", {
      productos,
      categorias,
    })
  } catch (error) {
    console.error("Error al obtener productos:", error)
    res.status(500).send("Error al obtener los productos")
  }
}
async function obtenerProductoPorId(req, res) {
  try {
    const id = parseInt(req.params.id, 10)
    if (isNaN(id)) {
      console.log(req.params)
      return res.status(400).send("El ID del producto no es válido")
    }

    const producto = await dbProductos.obtenerProductoPorId(id)
    const categorias = await dbCategorias.obtenerCategorias()
    const proveedores = await dbProveedores.obtenerProveedores()

    if (!producto) {
      return res.status(404).send("Producto no encontrado")
    }

    res.render("detalleProducto", {
      producto,
      categorias,
      proveedores,
    })
  } catch (error) {
    console.error("Error al obtener producto por ID:", error)
    res.status(500).send("Error al obtener el producto")
  }
}

async function actualizarProducto(req, res) {
  try {
    const id = parseInt(req.params.id, 10)
    if (isNaN(id)) {
      return res.status(400).send("ID de producto no válido")
    }

    const {
      nombre,
      stock,
      precio_unitario,
      id_categoria,
      id_proveedor,
      cantidad_minima,
      estado,
    } = req.body

    const datosActualizados = {
      nombre,
      stock: parseInt(stock),
      precio_unitario: parseFloat(precio_unitario),
      id_categoria: parseInt(id_categoria),
      id_proveedor: parseInt(id_proveedor),
      cantidad_minima: parseInt(cantidad_minima),
      estado,
    }

    await dbProductos.actualizarProducto(id, datosActualizados)
    res.redirect("/productos")
  } catch (error) {
    console.error("Error al actualizar el producto:", error)
    res.status(500).send("Error al actualizar el producto")
  }
}

async function crearProductoGet(req, res) {
  try {
    const categorias = await dbCategorias.obtenerCategorias()
    const productos = await dbProductos.obtenerProductos()
    const proveedores = await dbProveedores.obtenerProveedores()
    res.render("nuevoProducto", { categorias, proveedores, productos })
  } catch (error) {
    console.error("Error al cargar formulario:", error)
    res.status(500).send("Error al cargar formulario")
  }
}

async function crearProductoPost(req, res) {
  try {
    const {
      nombre,
      stock,
      precio_unitario,
      id_categoria,
      id_proveedor,
      cantidad_minima,
    } = req.body

    await dbProductos.crearProducto(
      nombre,
      parseInt(stock),
      parseFloat(precio_unitario),
      parseInt(id_categoria),
      parseInt(id_proveedor),
      parseInt(cantidad_minima)
    )

    res.redirect("/productos")
  } catch (error) {
    console.error("Error al crear producto:", error)
    res.status(500).send("Error al crear el producto")
  }
}

async function generarOrdenReposicion(req, res) {
  const idProducto = req.params.id
  const usuarioResponsable = await dbUsuarios.buscarUsuarioPorId(req.user.id)
  const dataProducto = await dbProductos.obtenerProductoPorId(idProducto)
  dataProducto.usuarioResponsable = usuarioResponsable

  console.log(dataProducto)
  const pdfBytes = await pdfUtils.crearOrdenReposicionPDF(dataProducto)
  const fechaActual = new Date().toISOString().slice(0, 10)

  const sanitizeFilename = (name) =>
    name
      .normalize("NFD") // Elimina tildes (acentos)
      .replace(/[\u0300-\u036f]/g, "") // Elimina los caracteres diacríticos
      .replace(/[^a-zA-Z0-9_\-]/g, "") // Elimina caracteres no válidos
      .substring(0, 50) // Limita longitud si es necesario

  const nombreProducto = sanitizeFilename(dataProducto.nombre)
  const nombreArchivo = `Solicitud_Compra_${nombreProducto}_${fechaActual}.pdf`

  res.setHeader("Content-Type", "application/pdf")
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${nombreArchivo}"`
  )

  // Send PDF
  res.send(Buffer.from(pdfBytes))
}

module.exports = {
  obtenerProductos,
  crearProductoGet,
  crearProductoPost,
  obtenerProductoPorId,
  actualizarProducto,
  generarOrdenReposicion,
}
