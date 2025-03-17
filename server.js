import express from "express";
import path from "path";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import config from "./config.js";
import productRoute from "./routers/productRouter.js";
import userRouter from "./routers/userRouter.js";
import orderRouter from "./routers/orderRouter.js";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

const app = express();
const mongodbUrl = config.MONGODB_URL;
mongoose
  .connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .catch((error) => console.log(error.reason));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/products", productRoute);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.listen(config.PORT, "0.0.0.0", () => {
  console.log(`Server started at http://localhost:${config.PORT}`);
});
