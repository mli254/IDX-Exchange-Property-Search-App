// import dotenv from "dotenv/config"; // needs to be the very first import
import mysql from 'mysql2/promise';
import express from 'express';
import { pool } from "../db.js";

const router = express.Router();

router.get('/', async (req, res, next) => {
    let limit = parseInt(req.query.limit);
    let offset = parseInt(req.query.offset);
    let city = req.query.city;
    let zipcode = req.query.zipcode;
    let minPrice = parseInt(req.query.minPrice);
    let maxPrice = parseInt(req.query.maxPrice);
    let beds = parseInt(req.query.beds);
    let baths = parseInt(req.query.baths);

    if (req.query.limit) {
        if (limit > 199) {
            return res.json({error: "Error"});
        }
    }

    res.json({
        limit: limit || 20,
        offset: offset || 0,
        city: city || "no city",
        zipcode: zipcode || "no zipcode",
        minPrice: minPrice || "no minPrice",
        maxPrice: maxPrice || "no maxPrice",
        beds: beds || "no beds"
    });
    
    // multiple filters should combine
    // invalid inputs return 400 error
    // all filters used parameterized queries
    // result contains:
    // - total count
    // - limit number
    // - offset number
    // - rows/results
    
});

// INDEXES
// SHOW INDEXES FROM rets_property shows created indexes
// EXPLAIN shows indexes being used
// use LIMIT and OFFSET in queries

export default router;