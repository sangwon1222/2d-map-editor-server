const express = require('express');
const cors = require("cors");
import http from "http";
import { Socket } from "./socket";

const isProduction = process.env.NODE_ENV == "production";
const origin = isProduction ? 'https://www.lsw.kr' : '*'
const port =  8000;

console.log({isProduction,origin,port})

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use( cors({origin}) )


const router = express.Router()
app.use('/api',router)

app.use("/", express.static("public"));

const server = http.createServer({}, app);
server.listen(port, () => {
  console.log(`listening at port ${port}`);
});

const socket = new Socket(server)
socket.connect()

