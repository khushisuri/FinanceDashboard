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

function requireDb(_req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(202).json({ message: "loading" });
  }
  next();
}
console.log(mongoose.connection.readyState, "state");

app.use("/kpi", requireDb, kpiRoutes);
app.use("/product", requireDb, productRoutes);
app.use("/transaction", requireDb, transactionRoutes);

const PORT = process.env.PORT || 8080;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`listening on ${HOST}:${PORT}`);
  console.log(mongoose.connection.readyState, "state");
});

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
    })
    .catch((err) => console.error("Mongo connect failed:", err));
}
