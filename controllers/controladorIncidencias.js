const dbIncidencias = require("../model/queriesIncidencias")

async function obtenerIncidencias(req, res) {
  try {
    const incidencias = await dbIncidencias.obtenerIncidencias()

    const procesadas = incidencias.map(inc => ({
      ...inc,
      detalle_productos: Array.isArray(inc.detalle_productos)
        ? inc.detalle_productos
        : JSON.parse(inc.detalle_productos)
    }));

    console.log(procesadas)

    res.render("incidencias", { incidencias: procesadas, title: "Incidencias" })
  } catch (error) {
    console.error("Error al obtener categorias:", error)
    res.status(500).send("Error al obtener las categorias")
  }
}

async function descargarPDFIncidencia(req, res){
  const id = req.params.id_incidencia;
  try {
    const incidencia = await dbIncidencias.obtenerIncidenciaPorId(id);

    if (!incidencia) {
      return res.status(404).send('Incidencia no encontrada');
    }

    const pdfBytes = await dbIncidencias.generarPDFIncidencia(incidencia);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=incidencia_${id}.pdf`);
    res.send(pdfBytes);
  } catch (err) {
    console.error('Error al generar PDF:', err);
    res.status(500).send('Error al generar el PDF');
  }
}

module.exports = {
obtenerIncidencias,
descargarPDFIncidencia
}