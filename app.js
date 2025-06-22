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

app.get("/", async (req, res) => {
  const resumen = await obtenerResumenVentas30Dias();
  const fechas = resumen.map(r => r.fecha);
  const montos = resumen.map(r => parseFloat(r.total));
  res.render("index", {
    user: req.user,
    fechas,
    montos
  });
});

app.use('/ventas', rutaVentas);
app.use("/productos", validarSesion, rutaProductos)
app.use("/categorias", validarSesion, rutaCategorias)
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
const PORT = 8080
app.listen(PORT, () => {
  console.log("Running on localhost...")
})
