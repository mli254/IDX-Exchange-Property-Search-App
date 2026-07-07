// import dotenv from "dotenv/config"; // needs to be the very first import
import mysql from 'mysql2/promise';
import express from 'express';
import { pool } from "../db.js";

const router = express.Router();

router.get('/', async (req, res) => {
    res.send('Reached the properties GET route.');
});

export default router;