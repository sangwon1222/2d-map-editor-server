import http from "http";
import cors from "cors";
import express from "express";
import router_auth from "./auth";
import router_map from "./map";
import { Socket } from "../socket";
import { getToday } from "../util/util";

const router = express.Router();
const port =  8000;
const app = express();
const server = http.createServer(app);

router.all("/", [], async (req: express.Request, res: express.Response) => {
  const param = req.body;
  res.json({
    msg: `api service. ${getToday()}`,
  });
});

// router.use("/auth", router_auth);
router.use("/map", router_map);

async function start(): Promise<http.Server> {
  // 순서 주의

  server.listen(port, async () => {
    const env =
      process.env.NODE_ENV == "production" ? `production` : `development`;
    console.log(`server started ${env} [${port}]`);
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use( cors({origin:"*"}) )
  app.use('/api',router)
  app.use("/", express.static("public"));

  const socket = new Socket(server)
  socket.connect()
  return server;
}

export { start };


export default router;
