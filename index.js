import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { Router } from "express";
import route from "./routes/userRoutes.js";
import cors from "cors"

const app = express();
app.use(express.json()) //middleware
app.use(bodyParser.json());
app.use(cors()) // permicao do back pro  frontend acessar


const PORT = process.env.PORT;
const MONGOURL = process.env.MONGO_URL;

// registrar as rotas entes de escutar a porta
app.use("/api", route)

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("Conexao bem sucedida.");

    app.listen(PORT, () => {
      console.log(`Servidor operando na porta: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Conexao falhou", err.message);
  });

