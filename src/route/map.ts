import express from "express";
import {
  logApi,
  verifyAccessToken,
} from "../util/express";

import * as map from "../controller/map";

const router = express.Router();

router.all(
  "/get-map",
  [],
  async (_req: express.Request, res: express.Response) => {
    res.json(await map.getMap());
  }
);

router.all(
  "/move-character",
  [],
  async (req: express.Request, res: express.Response) => {
    const {mapData,startPos,endPos} = req.body 
    res.json(await map.moveCharacter(mapData,startPos,endPos ));
  }
);


export default router;
