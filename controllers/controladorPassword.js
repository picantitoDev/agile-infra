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

    const message = {
      text: "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.",
      type: "info"
    };
  
  if (!usuario) return res.render("forgot-password", { message });

  // Generar token y expiración
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

  await dbUsuarios.guardarTokenDeReset(usuario.id, token, expires);

  const resetUrl = `https://stock-cloudc.info/recovery/reset-password/${token}`;

  // Configurar transporte de correo
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'stockcloud.soporte@gmail.com',
      pass: 'ktte cwnu eojo eaxt',       // contraseña de app
    }
  });

  // Enviar email
  await transporter.sendMail({
    to: usuario.email,
    from: 'no-reply@stockcloud.info',
    subject: 'Restablecer tu contraseña',
    html: `<p>Haz clic <a href="${resetUrl}">aquí</a> para restablecer tu contraseña. El enlace es válido por 1 hora.</p>`
  });

  message.text = "Se ha enviado un correo con instrucciones para restablecer tu contraseña.";
  message.type = "success";
  res.render("forgot-password", { message });
}

async function mostrarFormularioReset(req, res) {
  const token = req.params.token;
  const usuario = await dbUsuarios.buscarUsuarioPorToken(token);

  if (!usuario || new Date(usuario.reset_token_expires) < new Date()) {
    return res.send("Token inválido o expirado.");
  }

  res.render("reset-password", { token, error: null });
}

async function procesarResetPassword(req, res) {
  const { password, confirmar } = req.body;
  const { token } = req.params;

  if (password !== confirmar) {
    return res.render("reset-password", {
      token,
      error: "Las contraseñas no coinciden.",
    });
  }

  const usuario = await dbUsuarios.buscarUsuarioPorToken(token);
  if (!usuario || new Date(usuario.reset_token_expires) < new Date()) {
    return res.send("Token inválido o expirado.");
  }

  const hash = await bcrypt.hash(password, 10);
  await dbUsuarios.actualizarPasswordYLimpiarToken(usuario.id, hash);
  res.redirect('/');
}


module.exports = {
    mostrarFormularioRecuperacion,
    procesarFormularioRecuperacion,
    mostrarFormularioReset,
    procesarResetPassword
}