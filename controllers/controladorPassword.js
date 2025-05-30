const crypto = require("crypto");
const nodemailer = require("nodemailer");
const dbUsuarios = require("../model/queriesUsuarios");
const bcrypt = require("bcryptjs");

async function mostrarFormularioRecuperacion(req, res) {
  res.render("forgot-password", { message: null });
}

async function procesarFormularioRecuperacion(req, res) {
  const { email } = req.body;
  const usuario = await dbUsuarios.buscarUsuarioPorEmail(email);

  const message = "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.";
  
  if (!usuario) return res.render("forgot-password", { message });

  // Generar token y expiración
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 3600000); // 1 hora

  await dbUsuarios.guardarTokenDeReset(usuario.id, token, expires);

  const resetUrl = `http://${req.headers.host}/reset-password/${token}`;

  // Configurar transporte de correo
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tuemail@gmail.com',       // usa una cuenta válida
      pass: 'tu-contraseña-app',       // o contraseña de app
    }
  });

  // Enviar email
  await transporter.sendMail({
    to: usuario.email,
    from: 'no-reply@tusitio.com',
    subject: 'Restablecer tu contraseña',
    html: `<p>Haz clic <a href="${resetUrl}">aquí</a> para restablecer tu contraseña. El enlace es válido por 1 hora.</p>`
  });

  res.render("forgot-password", { message });
}



async function mostrarFormularioReset(req, res){
    
}


async function procesarResetPassword(req, res){
    
}

module.exports = {
    mostrarFormularioRecuperacion,
    procesarFormularioRecuperacion,
    mostrarFormularioReset,
    procesarResetPassword
}