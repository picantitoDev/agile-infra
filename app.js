const express = require("express")
const app = express()
const path = require("path")
const session = require("express-session")
const methodOverride = require("method-override")
const passport = require("passport")

// Configurar passport
require("./auth/passportConfig")
const validarSesion = require("./auth/authMiddleware")
const verificarAdmin = require("./auth/authMiddlewareAdmin")

// Importar rutas
const rutaProductos = require("./routes/rutaProductos")
const rutaCategorias = require("./routes/rutaCategorias")
const rutaProveedores = require("./routes/rutaProveedores")
const rutaUsuarios = require("./routes/rutaUsuarios")
const rutaVentas = require("./routes/rutaVentas")
const rutaMermas = require("./routes/rutaMermas")

// Middleware
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))

// Configurar sesión
app.use(
  session({
    secret: "clave_super_secreta", // Cambiá esto por algo más seguro
    resave: false,
    saveUninitialized: false,
  })
)

// Inicializar passport y sesiones
app.use(passport.initialize())
app.use(passport.session())

// Rutas principales
app.get("/", (req, res) => {
  res.render("index", { title: "Gabriel Roscaza", user: req.user })
})

app.use("/productos", validarSesion, rutaProductos)
app.use("/categorias", validarSesion, rutaCategorias)
app.use("/proveedores", validarSesion, rutaProveedores)
app.use("/usuarios", validarSesion, verificarAdmin, rutaUsuarios)
app.use("/ventas", validarSesion, rutaVentas)
app.use("/mermas", rutaMermas)
// Login
app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
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

// Servidor
app.listen(8080, () => {
  console.log("Running on localhost...")
})
