import dotenv from 'dotenv'
import finalModel from "../models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({path: path.resolve(__dirname, '../.env')})

// jwt secret
const SECRET = process.env.JWT_SECRET
// Cadastrar usuario, lembrar de enviar messagem por email quando o usuario for cadastrado no sistema
export const signUp = async(req, res) =>{
  const user = new finalModel(req.body)
  let {nome, email, password} = user  

  nome = nome? nome.trim(): ""
  email = email? email.trim(): ""
  password = password? password.trim(): ""

  // verificar se campos nao estao vazios
  if(!nome || !email || !password){
    res
        .status(400)
        .json({message: "Preencha os campos devidamente"})
  }else if(!/^[a-zA-Z\s]+$/.test(nome)){ //verifica caracter especial no nome
        res
            .status(400)
            .json({message: "Nome invalido, Use apenas letras e espacos"})
  } else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ //special chars em email
        res
            .status(400)
            .json({message: "Email invalido, Use apenas letras e espacos"})
  } else if(password.length < 8){
        res
            .status(400)
            .json({message: "A senha deve conter 8 digitos no minimo"})
  } else{
    // checking if user already existe ou nao
    try {
         const userExists = await finalModel.findOne({ email })
          if(userExists){
            // se user existir
            res
                .status(400)
                .json({message: "Ja existe um usuario com este email"})
          } else{
            // criando um novo usuario no documento
             const novoUser = new finalModel({ //cria um payload
               nome, 
               email, 
               password
              });

              await novoUser.save()
              res
                  .status(200)
                  .json({message: "Usuario cadastrado com sucesso"})

          }
    } catch (error) {
      res.status(500).json({errorMessage: "Falha no login, verifique as suas credenciais", error})
    }
  }
}

// login
export const login = async (req, res) =>{
  const user = new finalModel(req.body)
  let { email, password} = user  
 

  email = email? email.trim(): ""
  password = password? password.trim(): ""


  if(!email  || !password ){
    return res
              .status(400)
              .json({message: "Preencha os campos devidamente"})
  }
     try {
       const existe = await finalModel.findOne({email})

      if(!existe){
        res
            .status(400)
            .json({errorMessage: "erro no login, usuario nao encontrado"})
      } else{
        // inicia comparacao de senha pelo bcrypt
          const senhaCorreta = await bcrypt.compare(password, existe.password)

          if(!senhaCorreta){
            return res
                      .status(401)
                      .json({message: "Senha incorreta!"})
          } 
          // login feito gerar token json
          const token = jwt.sign({nome: existe.nome, email: existe.email}, SECRET, {expiresIn: '1h'})
          return res
                    .status(200)
                    .json({ 
                      token
                    })
      }
     } catch (error) {
        res
            .status(500)
            .json({errorMessage: "erro no login", errorMessage: error.message})
     }
}
// export const autenticada = async (req, res) =>{
//    const existe = await finalModel.findOne({email})
//     res.status(200).json({message: "autenticado"})
//   existe: req.email
  
// }



/*Consultas CRUD */
// get todos os usuarios do sistema
export const pegarTodosUsers = async (req, res) => { //Method Get all user data
  try {
    const pegar = await finalModel.find();
    if (!pegar || pegar.length === 0) {
      res.status(404).json({ message: "Usuarios nao encontrados" });
    }
    return res.status(200).json(pegar);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// buscar user pelo id
export const pegarUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await finalModel.findById(id);
    if (!userExist) {
      return res.status(404).json({ errorMessage: "Usuario nao encontrado" });
    }

    res.status(200).json(userExist);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const updateUserById = async (req, res) => { //Method Put
  try {
    const id = req.params.id; //pegar o id da requisicao
    const userExist = await finalModel.findById(id); //procurar um usuariop pelo ID
    if (!userExist) {
      return res.status(404).json({ errorMessage: "Usuario nao encontrado" });
    }

    const updateData = await finalModel.findByIdAndUpdate(id, req.body, {
      //atualiza a informacao do  usuario pelo ID
      new: true,
    });

    res.status(200).json(updateData);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};
export const deleteUserByID = async (req, res) => { //Method Delete
  try {
    const id = req.params.id; //pegar o id da requisicao
    const userExist = await finalModel.findById(id); //procurar um usuariop pelo ID
    if (!userExist) {
      return res.status(404).json({ message: "Usuario nao encontrado" });
    }

    await finalModel.findByIdAndDelete(id); //esperamos o finalModel procurar pelo ID e deleta a informacao do  usuario

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};
