// import * as express from "express";
// import * as util from "./util";
// import * as jwt from "jsonwebtoken";
// import * as redisClient from "./redis";

// export const AuthRouter: express.Router = express.Router();
// const SECRET_KEY = "MY-SECRET-KEY";

// AuthRouter.all("/", [], async (req: express.Request, res: express.Response) => {
//   res.json({ msg: "auth router" });
// });

// AuthRouter.post(
//   "/sign-in",
//   [],
//   async (req: express.Request, res: express.Response) => {
//     const { id, pw } = req.body;

//     try {
//       const { ok, result, error } = await util.getUserInfo(id);

//       if (!ok) {
//         return res.json({ ok: false, error });
//       }

//       const refreshToken = jwt.sign({ type: "JWT", id }, SECRET_KEY, {
//         expiresIn: "14d",
//         issuer: "cotak",
//       });
//       const accessToken = jwt.sign({ type: "JWT", id }, SECRET_KEY, {
//         expiresIn: "15m",
//         issuer: `${id}`,
//       });

//       if (res.statusCode === 200) {
//         return res.json({
//           ok: true,
//           code: 200,
//           message: "토큰이 발급되었습니다.",
//           result: {
//             username: result.userName,
//             accessToken,
//             refreshToken,
//             account: result.idx,
//             teamId: result.teamId,
//           },
//         });
//       } else {
//         return res.json({
//           ok: false,
//           code: res.statusCode,
//           message: "토큰이 발급 실패",
//           result: {
//             username: "",
//             accessToken: "",
//             refreshToken: "",
//             account: "",
//           },
//         });
//       }
//     } catch (e) {
//       return res.json({
//         ok: false,
//         code: res.statusCode,
//         message: "로그인 실패",
//         result: {
//           username: "",
//           accessToken: "",
//           refreshToken: "",
//           account: "",
//         },
//       });
//     }
//   }
// );

// //** access token */
// AuthRouter.post(
//   "/sign-in/accessTokenCheck",
//   async (req: express.Request, res: express.Response) => {
//     res.json({ ok: true });
//   }
// );

// //refreshToken
// AuthRouter.post(
//   "/refreshToken",
//   async (req: express.Request, res: express.Response) => {
//     const refreshToken = req.headers.refresh as string;
//     if (!refreshToken) {
//       res.json({ ok: false });
//       return;
//     }

//     const id = req.body.id;
//     const accessToken = jwt.sign({ type: "JWT", id }, SECRET_KEY, {
//       expiresIn: "15m",
//       issuer: `${id}`,
//     });

//     res.json({
//       ok: true,
//       result: {
//         accessToken,
//         refreshToken,
//       },
//     });
//   }
// );

// // DB query : INSERT

// //** sign-up
// AuthRouter.post(
//   "/sign-up",
//   async (req: express.Request, res: express.Response) => {
//     const { id, pw, name, teamId } = req.body;
//     try {
//       const checkDuplicate = await util.Query(
//         `SELECT * FROM auth WHERE userId='${id}'`
//       );
//       if (checkDuplicate.length > 0) {
//         res.json({ ok: false, errorMsg: "중복 아이디가 존재합니다." });
//         return;
//       }

//       const result = await util.Query(`
//       INSERT INTO
//       auth
//       (userId,password,userName,teamId)
//       VALUES
//       ( '${id}', '${pw}','${name}','${+teamId}' );
//     `);
//       res.json({ ok: true, data: { id, pw, name, teamId }, result });
//     } catch (e) {
//       res.json({ ok: false, data: {}, result: [] });
//     }
//   }
// );

// //** sign-out
// AuthRouter.post(
//   "/sign-out",
//   async (req: express.Request, res: express.Response) => {
//     res.json({ ok: true });
//   }
// );

// //** 회원 탈퇴
// AuthRouter.post(
//   "/delete-user",
//   async (req: express.Request, res: express.Response) => {
//     const { id, pw } = req.body;
//     try {
//       const data = await util.Query(`
//         DELETE FROM
//         auth
//         WHERE
//         userId = '${id}'
//         AND
//         password = '${pw}'
//       `);
//       res.json({ ok: true });
//     } catch (e) {
//       res.json({ ok: false, error: e });
//     }
//   }
// );

// //** ID 중복검사
// AuthRouter.post(
//   "/check-id",
//   async (req: express.Request, res: express.Response) => {
//     const { id } = req.body;
//     try {
//       const search = await util.Query(`
//       SELECT * FROM
//         auth
//       WHERE
//         userId='${id}'
//       `);
//       res.json(search);
//     } catch (e) {
//       res.json({ search: [] });
//     }
//   }
// );

// // DB query : UPDATE
// // DB query : DELETE
