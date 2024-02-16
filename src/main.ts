const express = require('express');
const cors = require("cors");
import http from "http";
import { Socket } from "./socket";
import { start } from "./route";

const isProduction = process.env.NODE_ENV == "production";
const origin = isProduction ? 'https://www.lsw.kr' : '*'
const port =  8000;

console.log({isProduction,origin,port})

start()





