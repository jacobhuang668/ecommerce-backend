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
      res.status(200).send({ encrptTokens });
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
    res.status(200).json(JSON.parse(token)); // 返回明文对象信息
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});
router.post("/logout", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const encryptedToken = authHeader.split(" ")[1];
    decryptToken(encryptedToken);
    res.clearCookie("token");
    res.status(200).json({ message: "token deleted" });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
