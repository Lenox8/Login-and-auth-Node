import express from "express";
import {
  pegarTodosUsers,
  pegarUserById,
  updateUserById,
  deleteUserByID,
  signUp,
  login
} from "../controller/userController.js";
import {verificarToken} from '../middleware/auth.js'


const route = express.Router();

route.post("/login", login) //login usuarios
route.post("/cadastrar", signUp) //cadastrar usuarios

// rotas protegidas
route.get("/todosUsers",verificarToken, pegarTodosUsers); //pega todos os users e mostra na tela
route.get("/user/:id", pegarUserById); //rota user/:id, pegamos o id do Mongo e add na rota
route.put("/update/user/:id", updateUserById); //put e para atualizar dados
route.delete("/delete/user/:id", deleteUserByID) // deleta user por ID

export default route;
