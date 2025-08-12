import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import KPI from "./models/KPI.js";
import { kpis } from "./data/data.js";
import kpiRoutes from "./routes/kpiRoutes.js";
import productRoutes from "./routes/ProductRoutes.js";
import Product from "./models/Product.js";
import transactionRoutes from "./routes/TransactionRoutes.js";
import Transaction from "./models/Transaction.js";
import { products, transactions } from "./data/data.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


app.use("/kpi", kpiRoutes);
app.use("/product", productRoutes);
app.use("/transaction", transactionRoutes);

const PORT = process.env.PORT || 8080;
const HOST = "0.0.0.0";

const uri = process.env.MONGO_URL;
if (!uri) {
  console.warn("MONGO_URL not set — starting without DB");
} else {
  mongoose
    .connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
    })
    .then(async () => {
      console.log("Mongo connected");
      app.listen(PORT, HOST, () => {
        console.log(`listening on ${HOST}:${PORT}`);
        console.log(mongoose.connection.readyState, "state");
      });
    })
    .catch((err) => console.error("Mongo connect failed:", err));
}
