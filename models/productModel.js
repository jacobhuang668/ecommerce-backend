import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, default: 0 }, //等级
    comment: { type: String, required: true },
  },
  {
    timestamps: true, //timestamps: true： Mongoose 会自动为每条记录添加 createdAt 和 updatedAt 时间戳字段，这两个字段将自动保存记录的创建和更新时间
  }
);

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  category: { type: String, required: true },
  countInStock: { type: Number, default: 0, required: true },
  description: { type: String, required: true },
  rating: { type: Number, default: 0, required: true },
  numReviews: { type: Number, default: 0, required: true },
  reviews: [reviewSchema],
});

const productModel = new mongoose.model("Product", productSchema);
export default productModel;
