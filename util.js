import jwt from "jsonwebtoken";
import config from "./config.js";
import crypto from "crypto";
//generating token
const getToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    config.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

const isAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    const onlyToken = token.slice(7, token.length);
    jwt.verify(onlyToken, config.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({ message: "Invalid Token" });
      }
      req.user = decode;
      next();
      return;
    });
  } else {
    return res.status(401).send({ message: "Token is not supplied." });
  }
};

const isAdmin = (req, res, next) => {
  console.log("req.user", req.user);
  if (req.user && req.user.isAdmin) {
    return next();
  }
  return res.status(401).send({ message: "Admin Token is not valid." });
};
// 加密函数
const encrptToken = (token) => {
  const cipher = crypto.createCipher("aes-256-cbc", config.encryptionKey);
  let encrypted = cipher.update(token, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

// 解密函数
const decryptToken = (encryptedToken) => {
  const decipher = crypto.createDecipher("aes-256-cbc", config.encryptionKey);
  let decrypted = decipher.update(encryptedToken, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};
const verify = (encryptedToken) => {
  const token = decryptToken(encryptedToken);
  const decoded = jwt.verify(token, config.JWT_SECRET);
  return decoded;
};

// 中间件：验证 token
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const encryptedToken = authHeader.split(" ")[1];
  try {
    const token = decryptToken(encryptedToken);
    req.user = JSON.parse(token);
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export {
  getToken,
  isAuth,
  isAdmin,
  encrptToken,
  decryptToken,
  verify,
  authMiddleware,
};
