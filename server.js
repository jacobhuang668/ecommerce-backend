import express from "express";
import path from "path";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import config from "./config.js";
import productRoute from "./routers/productRouter.js";
import { fileURLToPath } from "url";
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
app.use("/api/products", productRoute);
app.listen(config.PORT, "0.0.0.0", () => {
  console.log(`Server started at http://localhost:${config.PORT}`);
});
