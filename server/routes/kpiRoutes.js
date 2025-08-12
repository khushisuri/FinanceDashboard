import express from "express";
import KPI from "../models/KPI.js";


const router = express.Router();


router.get("/", (_req, res) => res.json({ route: "kpi root ok" }));

router.get("/kpis", async (req, res) => {
  try {
    const kpis = await KPI.find();
    
    res.status(200).json(kpis);
  } catch (error) {
    res.status(404).json({ message: error.message });
    console.log({message: error.message});
  }
});

export default router;


