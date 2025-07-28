import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import jwt from 'jsonwebtoken'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({path: path.resolve(__dirname, '../.env')})

// jwt secret
const SECRET = process.env.JWT_SECRET

export const verificarToken = (req, res, next) =>{

    const authHeader = req.headers['authorization'] //cabecalho da request

    if (!authHeader) {
            res
                .status(401)
                .json({message: "Token nao fornecido"})
    }

    const token = authHeader.split(" ")[1] //garante a nao existencia de espacos e pega somente o token sem o BEARER

    if (!token) {
        res
            .status(401)
            .json({message: "Token mal formatado, garanta que nao haja espacos"})
    }

    try {
        const decoded = jwt.verify(token, SECRET)
        req.user = decoded //decodifica os dados para serem usados na proxima rota protegida
        next() //passa para a proxima rota
    } catch (error) {
        res.status(500).json({errorMessage: "token expirado", errorMessage: error.message})
    }
}