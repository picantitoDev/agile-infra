const express = require("express")
const app = express()
const path = require("path")
const session = require("express-session")
const methodOverride = require("method-override")
const passport = require("passport")
const flash = require("connect-flash")
const expressLayouts = require('express-ejs-layouts');

// Configurar passport
require("./auth/passportConfig")
const validarSesion = require("./auth/authMiddleware")
const verificarAdmin = require("./auth/authMiddlewareAdmin")

// Importar rutas
const rutaProductos = require("./routes/rutaProductos")
const rutaCategorias = require("./routes/rutaCategorias")
const rutaProveedores = require("./routes/rutaProveedores")
const rutaUsuarios = require("./routes/rutaUsuarios")
const rutaMovimientos = require("./routes/rutaMovimientos")
const rutaOrdenes = require('./routes/rutaOrdenes');
const rutaIncidencias = require("./routes/rutaIncidencias")
const rutaRecovery = require("./routes/rutaRecovery")
const rutaVentas = require("./routes/rutaVentas")

// Middleware
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Configurar sesión
app.use(
  session({
    secret: "clave_super_secreta",
    resave: false,
    saveUninitialized: false,
  })
)

app.use(flash())

// Hacer disponibles los mensajes flash en todas las vistas
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg")
  res.locals.error_msg = req.flash("error_msg")
  res.locals.error = req.flash("error") // Passport usa 'error' por defecto
  next()
})

// Inicializar passport y sesiones
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
  res.locals.user = req.user || null
  next()
})

// Rutas principales
const { obtenerResumenVentas30Dias } = require('./model/queriesMovimientos');
const { obtenerResumenProductos } = require("./controllers/controladorProductos");
const { obtenerResumenOrdenes } = require("./controllers/controladorOrdenes");
const { obtenerResumenIncidencias } = require("./controllers/controladorIncidencias")
const { obtenerResumenSobrantes } = require("./controllers/controladorMovimientos")
const { obtenerResumenMermas } = require("./controllers/controladorMovimientos")

app.get("/", async (req, res) => {
  const [
    resumenVentas,
    resumenOrdenes,
    rankingProductos,
    incidencias,
    mermas,
    sobrantes
  ] = await Promise.all([
    obtenerResumenVentas30Dias(),
    obtenerResumenOrdenes(),
    obtenerResumenProductos(),
    obtenerResumenIncidencias(),
    obtenerResumenMermas(),
    obtenerResumenSobrantes()
  ]);

  const fechasVentas = resumenVentas.map(r => r.fecha);
  const montosVentas = resumenVentas.map(r => parseFloat(r.total));
  const fechasOrdenes = resumenOrdenes.map(r => r.fecha);
  const totalesOrdenes = resumenOrdenes.map(r => r.total);

  const resumenPorFecha = {};
  function agregarAlResumen(fecha, tipo, valor) {
    if (!resumenPorFecha[fecha]) {
      resumenPorFecha[fecha] = { fecha, incidencias: 0, mermas: 0, sobrantes: 0 };
    }
    resumenPorFecha[fecha][tipo] = valor;
  }

  incidencias.forEach(({ fecha, incidencias }) => agregarAlResumen(fecha, 'incidencias', incidencias));
  mermas.forEach(({ fecha, mermas }) => agregarAlResumen(fecha, 'mermas', mermas));
  sobrantes.forEach(({ fecha, sobrantes }) => agregarAlResumen(fecha, 'sobrantes', sobrantes));

  const resumenIncidenciasYMermas = Object.values(resumenPorFecha).sort((a, b) => a.fecha.localeCompare(b.fecha));
  console.log(resumenIncidenciasYMermas)
  res.render("index", {
    user: req.user,
    fechasVentas,
    montosVentas,
    fechasOrdenes,
    totalesOrdenes,
    rankingProductos,
    resumenIncidenciasYMermas
  });
});



app.use('/ventas', rutaVentas);
app.use("/productos", validarSesion, verificarAdmin, rutaProductos);
app.use("/categorias", validarSesion, verificarAdmin, rutaCategorias);
app.use("/proveedores", validarSesion, rutaProveedores)
app.use("/usuarios", validarSesion, verificarAdmin, rutaUsuarios)
app.use('/ordenes', validarSesion, rutaOrdenes);
app.use("/movimientos", validarSesion, rutaMovimientos)
app.use("/incidencias", validarSesion, rutaIncidencias)
app.use("/recovery", rutaRecovery)

// Login
app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
    failureFlash: true,
  })
)

// Logout
app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err)
    }
    res.redirect("/")
  })
})

// Middleware para manejar errores 404
app.use((req, res, next) => {
  res.status(404).render("404", { url: req.originalUrl })
})

// Servidor
const PORT =  3000
app.listen(PORT, () => {
  console.log("Running on localhost...")
})
