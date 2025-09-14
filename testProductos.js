import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // 1. Ver la DB y schema a la que estás conectado
    const info = await prisma.$queryRaw`SELECT current_database(), current_schema()`
    console.log("📌 Base actual:", info)

    // 2. Probar si hay productos (sin filtros ni select)
     const productos = await prisma.producto.findMany({
    select: {
      id_producto: true,
      nombre: true,
      stock: true,
      precio_unitario: true,
      cantidad_minima: true,
      estado: true,
      id_proveedor: true,
      categoria: { select: { nombre: true } },
      proveedor: { select: { razon_social: true } }
    },
    orderBy: { nombre: 'asc' }
  })

  // 🔥 Aplanamos para que sea igual al SQL antiguo
  const productosAplanados = productos.map(p => ({
    id_producto: p.id_producto,
    nombre: p.nombre,
    stock: p.stock,
    precio_unitario: p.precio_unitario,
    cantidad_minima: p.cantidad_minima,
    estado: p.estado,
    id_proveedor: p.id_proveedor,
    categoria: p.categoria?.nombre || null,
    proveedor: p.proveedor?.razon_social || null
  }))

    console.log("📦 Productos encontrados:", productosAplanados.length)
    console.log(productosAplanados)
  } catch (error) {
    console.error("❌ Error:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
