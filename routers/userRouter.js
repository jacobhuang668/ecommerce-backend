import express from "express";
import {
  getToken,
  isAuth,
  encrptToken,
  decryptToken,
  verify,
} from "../util.js";
import userModel from "../models/userModel.js";

const router = express.Router();
router.post("/signin/", async (req, res) => {
  try {
    const email = req.query.email ? { email: req.query.email } : {};
    const password = req.query.password ? { password: req.query.password } : {};
    const user = await userModel.findOne({ ...email, ...password });

    if (user) {
      const objToken = {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        jwtToken: getToken(user),
      };
      const encrptTokens = encrptToken(JSON.stringify(objToken));
      res.cookie("token", encrptTokens, {
        // httpOnly: true, // 防 XSS
        // secure: process.env.NODE_ENV === "production", // 生产环境用 HTTPS
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 天
        sameSite: "strict", // 防 CSRF
      });
      res.status(200).send(objToken);
    } else {
      res.status(401).send({ message: "Invalid Email or Password." });
    }
  } catch (error) {
    res.status(502).send({ message: error });
  }
});

// 验证接口
router.post("/verify", (req, res) => {
  const encryptedToken = req.body.token || req.cookies.token; // 支持 body 或 Cookie
  if (!encryptedToken) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const token = decryptToken(encryptedToken); // 解密
    //const decoded = jwt.verify(token, config.jwtSecret); // 验证 JWT
    res.status(200).json(JSON.parse(token)); // 返回明文信息
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
