const ExcelJS = require("exceljs")
const dbMovimientos = require("../model/queriesMovimientos")

async function generarExcelVentas(req, res) {
  try {
    const { tipo, fechaInicio, fechaFin } = req.query
    const rows = await dbMovimientos.obtenerMovimientosVentas();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de Ventas');

    worksheet.columns = [
      { header: 'ID Movimiento', key: 'id_movimiento', width: 15 },
      { header: 'Fecha de Venta', key: 'fecha', width: 20 },
      { header: 'Usuario', key: 'usuario', width: 20 },
      { header: 'Tipo Comprobante', key: 'tipo_comprobante', width: 20 },
      { header: 'Serie', key: 'serie', width: 10 },
      { header: 'Correlativo', key: 'correlativo', width: 15 },
      { header: 'Total Venta', key: 'total_venta', width: 15 },
      { header: 'Cliente - Nombre', key: 'nombre_cliente', width: 25 },
      { header: 'Cliente - Razón Social', key: 'razon_social', width: 25 },
      { header: 'Cliente - RUC', key: 'ruc_cliente', width: 18 },
      { header: 'Cliente - DNI', key: 'dni_cliente', width: 18 },
      { header: 'Cliente - Dirección', key: 'direccion_cliente', width: 30 },
      { header: 'Cliente - Correo', key: 'correo_cliente', width: 25 },
      { header: 'ID Producto', key: 'id_producto', width: 15 },
      { header: 'Producto', key: 'producto', width: 30 },
      { header: 'Cantidad', key: 'cantidad', width: 10 },
      { header: 'Precio Unitario', key: 'precio_unitario', width: 15 },
      { header: 'Subtotal', key: 'subtotal', width: 15 },
      { header: 'Descripción Movimiento', key: 'descripcion', width: 30 }
    ];

    rows.forEach(row => {
      worksheet.addRow(row);
    });

    worksheet.getRow(1).font = { bold: true };

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=reporte_ventas.xlsx'
    );

    await workbook.xlsx.write(res);
    res.end()
  } catch (error) {
    console.error("Error exportando Excel:", error)
    res.status(500).send("Error generando el reporte")
  }
}

async function generarExcelEntradas(req, res) {
  try {
    const entradas = await dbMovimientos.obtenerMovimientosEntradas();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Entradas');

    // Encabezados
    worksheet.columns = [
      { header: 'ID Movimiento', key: 'id_movimiento', width: 15 },
      { header: 'Fecha', key: 'fecha', width: 20 },
      { header: 'Usuario', key: 'usuario', width: 20 },
      { header: 'Descripción', key: 'descripcion', width: 30 },
      { header: 'Total Entrada', key: 'total_entrada', width: 15 },
      { header: 'ID Orden', key: 'id_orden', width: 12 },

      { header: 'Razón Social (Proveedor)', key: 'razon_social', width: 25 },
      { header: 'RUC Proveedor', key: 'ruc', width: 15 },
      { header: 'Dirección Proveedor', key: 'direccion', width: 30 },
      { header: 'Correo Proveedor', key: 'correo', width: 25 },

      { header: 'ID Producto', key: 'id_producto', width: 12 },
      { header: 'Nombre Producto', key: 'producto', width: 30 },
      { header: 'Cantidad', key: 'cantidad', width: 10 },
      { header: 'Precio Unitario', key: 'precio_unitario', width: 15 },
      { header: 'Subtotal', key: 'subtotal', width: 15 }
    ];

    // Filas
    entradas.forEach((entrada) => {
      worksheet.addRow({
        ...entrada,
        fecha: new Date(entrada.fecha).toLocaleString(), // formato legible
      });
    });

    // Estilo de encabezado
    worksheet.getRow(1).font = { bold: true };

    // Enviar el archivo
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Reporte_Entradas.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error al generar el Excel de entradas:', error);
    res.status(500).json({ error: 'Error al generar el reporte de entradas' });
  }
}

async function generarExcelMermas(req, res) {
  try {
    const mermas = await dbMovimientos.obtenerMovimientosMermas();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de Mermas');

    // Cabecera
    worksheet.columns = [
      { header: 'ID Movimiento', key: 'id_movimiento', width: 15 },
      { header: 'Fecha', key: 'fecha', width: 20 },
      { header: 'Usuario', key: 'usuario', width: 20 },
      { header: 'Motivo', key: 'motivo', width: 30 },
      { header: 'Producto', key: 'producto', width: 25 },
      { header: 'Cantidad', key: 'cantidad', width: 12 },
      { header: 'Precio Unitario', key: 'precio_unitario', width: 15 },
      { header: 'Subtotal', key: 'subtotal', width: 15 },
      { header: 'Descripción', key: 'descripcion', width: 30 },
    ];

    // Filas
    mermas.forEach(item => {
      worksheet.addRow(item);
    });

    // Estilos básicos
    worksheet.getRow(1).font = { bold: true };

    // Enviar Excel como descarga
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=reporte_mermas.xlsx'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error al generar el Excel de mermas:', error);
    res.status(500).send('Error al generar el Excel');
  }
}

module.exports = {
    generarExcelVentas,
    generarExcelEntradas,
    generarExcelMermas
}