const dbIncidencias = require("../model/queriesIncidencias");
const { generarPDFIncidencia } = require("../utils/pdfGenerator");
const { DateTime } = require("luxon");

async function obtenerIncidencias(req, res) {
  try {
    const incidencias = await dbIncidencias.obtenerIncidencias();

    const procesadas = incidencias.map((inc) => ({
      ...inc,
      detalle_productos: Array.isArray(inc.detalle_productos)
        ? inc.detalle_productos
        : JSON.parse(inc.detalle_productos),
    }));

    console.log(procesadas);

    res.render("incidencias", { incidencias: procesadas, title: "Incidencias" });
  } catch (error) {
    console.error("Error al obtener categorias:", error);
    res.status(500).send("Error al obtener las categorias");
  }
}

async function descargarPDFIncidencia(req, res) {
  const id = req.params.id_incidencia;
  try {
    const incidencia = await dbIncidencias.obtenerIncidenciaPorId(id);

    if (!incidencia) {
      return res.status(404).send("Incidencia no encontrada");
    }

    const pdfBytes = await generarPDFIncidencia(incidencia);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=incidencia_${id}.pdf`
    );
    res.send(pdfBytes);
  } catch (err) {
    console.error("Error al generar PDF:", err);
    res.status(500).send("Error al generar el PDF");
  }
}

async function obtenerResumenIncidencias() {
  const incidencias = await dbIncidencias.obtenerIncidenciasUltimos30Dias();

  const resumen = {};

  incidencias.forEach((inc) => {
    // Aseguramos zona 'America/Lima' y evitamos toISOString() (que pasa a UTC)
    const dt = inc.fecha instanceof Date
      ? DateTime.fromJSDate(inc.fecha, { zone: "America/Lima" })
      : DateTime.fromISO(String(inc.fecha), { zone: "America/Lima" });

    const fechaLima = dt.toFormat("yyyy-MM-dd");
    resumen[fechaLima] = (resumen[fechaLima] || 0) + 1;
  });

  const resultado = Object.entries(resumen).map(([fecha, incidencias]) => ({
    fecha,
    incidencias,
  }));

  resultado.sort((a, b) => a.fecha.localeCompare(b.fecha));

  return resultado;
}

async function detallePorFecha(req, res) {
  try {
    const { fecha } = req.params;

    // Validación de fecha REAL con Luxon (no solo regex)
    const dt = DateTime.fromFormat(fecha, "yyyy-MM-dd", { zone: "America/Lima" });
    if (!dt.isValid) {
      return res.status(400).json({ error: "Formato de fecha inválido" });
    }

    const datos = await dbIncidencias.obtenerIncidenciasPorFecha(fecha);
    res.json(datos);
  } catch (error) {
    console.error("❌ Error al obtener incidencias por fecha:", error);
    res.status(500).json({ error: "Error interno al obtener incidencias" });
  }
}

module.exports = {
  obtenerIncidencias,
  descargarPDFIncidencia,
  obtenerResumenIncidencias,
  detallePorFecha,
};
