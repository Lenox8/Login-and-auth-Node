import mongoose from "mongoose";
import bcrypt from 'bcrypt' //encrypta password
import hashed from '../middleware/encryptService.js'

const modelo = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

}, {timestamps: true});
// Middleware para encriptar senha antes de salvar os dados no banco de dados, ele e chamado sempre que pretendo guardar dados
modelo.pre('save', hashed)

const finalModel = mongoose.model("usuarios", modelo);

export default finalModel;
