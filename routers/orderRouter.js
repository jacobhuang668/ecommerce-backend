import express from "express";
import { authMiddleware } from "../util.js";
import orderModel from "../models/orderModel.js";
const router = express.Router();
router.post("/mine", authMiddleware, async (req, res) => {
  try {
    const obj = { user: req.user._id };
    const orders = await orderModel.find(obj);
    res.status(200).send(orders);
  } catch (error) {
    res.status(502).send(error);
  }
});
export default router;
