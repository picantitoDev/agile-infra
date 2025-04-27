const dbProductos = require("../model/queriesProductos")
const dbCategorias = require("../model/queriesCategorias")

async function obtenerProductos(req, res) {
  try {
    const productos = await dbProductos.obtenerProductos()
    const categorias = await dbCategorias.obtenerCategorias()
    res.render("productos", { productos, categorias })
  } catch (error) {
    console.error("Error al obtener productos:", error)
    res.status(500).send("Error al obtener los productos")
  }
}

async function obtenerProductoPorId(req, res) {
  try {
    const id = parseInt(req.params.id)
    const producto = await dbProductos.obtenerProductoPorId(id)
    const categorias = await dbCategorias.obtenerCategorias()

    if (!producto) {
      return res.status(404).send("Producto no encontrado")
    }

    res.render("detalleProducto", { producto, categorias })
  } catch (error) {
    console.error("Error al obtener producto por ID:", error)
    res.status(500).send("Error al obtener el producto")
  }
}

async function actualizarProducto(req, res) {
  try {
    const id = parseInt(req.params.id)
    const {
      nombre,
      sku,
      stock,
      precio_unitario,
      categoria_id,
      unidad_medida,
      estado,
    } = req.body

    const datosActualizados = {
      nombre,
      sku,
      stock: parseInt(stock),
      precio_unitario: parseFloat(precio_unitario),
      categoria_id: parseInt(categoria_id),
      unidad_medida,
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
    const categorias = await dbCategorias.obtenerCategorias() // Fetch categories from the database
    res.render("nuevoProducto", { categorias })
  } catch (error) {
    console.error("Error al cargar formulario:", error)
    res.status(500).send("Error al cargar formulario")
  }
}

async function crearProductoPost(req, res) {
  try {
    const { nombre, sku, stock, precio_unitario, categoria_id, unidad_medida } =
      req.body

    await dbProductos.crearProducto(
      nombre,
      sku,
      parseInt(stock),
      parseFloat(precio_unitario),
      parseInt(categoria_id),
      unidad_medida
    )

    res.redirect("/productos")
  } catch (error) {
    console.error("Error al crear producto:", error)
    res.status(500).send("Error al crear el producto")
  }
}

module.exports = {
  obtenerProductos,
  crearProductoGet,
  crearProductoPost,
  obtenerProductoPorId,
  actualizarProducto,
}
