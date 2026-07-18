import dotenv from "dotenv/config"; // needs to be the very first import
import mysql from 'mysql2/promise';
import express from 'express';
import cors from 'cors';
import { pool } from "./db.js";
import logger from "./middleware/logging.js";
import propertiesRouter from "./routes/properties.js"

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/health', async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res
      .status(200)
      .json({ 
        status: "ok",
        database: "connected" 
      });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "internal server error", 
        database: "disconnected", 
        message: error 
      });
  }
});

app.use("/api/properties", propertiesRouter);

app.listen(process.env.SERVER_PORT || 5000, () => {
  console.log(`Server listening on port ${process.env.SERVER_PORT}`);
});

