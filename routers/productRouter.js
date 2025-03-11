import express from "express";
import Product from "../models/productModel.js";

const router = express.Router();
router.get("/", async (req, res) => {
  const category = req.query.category ? { category: req.query.category } : {};
  const searchKeyword = req.query.searchKeyword
    ? { name: { $regex: req.query.searchKeyword, $options: "i" } } //i  Case insensitivity to match upper and lower cases.
    : {};
  const sortOrder = req.query.sortOrder
    ? req.query.sortOrder === "lowest"
      ? { price: -1 }
      : { price: 1 }
    : { _id: -1 };
  console.log({
    ...category,
    ...searchKeyword,
  });
  const products = await Product.find({ ...category, ...searchKeyword }).sort(
    sortOrder
  );
  res.send(products);
});

export default router;
