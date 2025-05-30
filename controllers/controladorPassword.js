const crypto = require("crypto");
const nodemailer = require("nodemailer");
const dbUsuarios = require("../model/queriesUsuarios");
const bcrypt = require("bcryptjs");

async function mostrarFormularioRecuperacion(req, res){

}


async function procesarFormularioRecuperacion(req, res){
    
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