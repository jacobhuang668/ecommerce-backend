import express from "express";
import { getToken, isAuth } from "../util.js";
import userModel from "../models/userModel.js";

const router = express.Router();
router.post("/signin/", async (req, res) => {
  try {
    const email = req.query.email ? { email: req.query.email } : {};
    const password = req.query.password ? { password: req.query.password } : {};
    const user = await userModel.findOne({ ...email, ...password });
    if (user) {
      const responseObject = {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: getToken(user),
      };
      res.status(200).send(responseObject);
    } else {
      res.status(401).send({ message: "Invalid Email or Password." });
    }
  } catch (error) {
    res.status(502).send({ message: error });
  }
});

export default router;
