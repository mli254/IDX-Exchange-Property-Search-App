// import dotenv from "dotenv/config"; // needs to be the very first import
import mysql from 'mysql2/promise';
import express from 'express';
import { pool } from "../db.js";

const router = express.Router();

router.get('/', async (req, res) => {
    // Est. default values
    let limit = 20;
    let offset = 0;
    let city = "";
    let zipcode = "";
    let minPrice = 0;
    let maxPrice = 0;
    let beds = 0;
    let baths = 0;
    let wherequery = "";
    const columns = [];
    const values = []; // incrementally append new param as the conditions are handled below
    

    // Handling query params
    if (req.query.limit) {
        limit = parseInt(req.query.limit);

        if (!limit && limit !== 0) {
            return res
            .status(400)
            .json({
                status: "bad request",
                message: "Please ensure limit parameter is a numeric whole number."
            });
        }

        if (limit > 100 || limit < 1) {
            return res
            .status(400)
            .json({
                status: "bad request",
                message: "Please ensure limit parameter is between 1-100."
            });
        }
    }

    if (req.query.offset) {
        offset = parseInt(req.query.offset);

        if (!offset && offset !== 0) {
            return res
            .status(400)
            .json({
                status: "bad request",
                message: "Please ensure offset parameter is a numeric whole number."
            });
        }

        if (offset < 0) {
            return res
            .status(400)
            .json({
                status: "bad request",
                message: "Please ensure offset is not negative."
            });
        }
    } 

    if (req.query.city) {
        city = req.query.city;

        if (!city) {
            return res
            .status(400)
            .json({
                status: "bad request",
                message: "Please double check the 'city' param and try again."
            });
        }

        columns.push("LOWER(TRIM(L_City)) = LOWER(TRIM(?))");
        values.push(city);
    }

    if (req.query.zipcode) {
        zipcode = req.query.zipcode;

        if (!zipcode) {
            return res
            .status(400)
            .json({
                status: "bad request",
                message: "Please double check the 'zipcode' param and try again."
            });
        }

        columns.push("L_Zip = ?");
        values.push(zipcode);
    }

    if (req.query.minPrice) {
        minPrice = parseInt(req.query.minPrice);

        if (!minPrice && minPrice !== 0) {
            return res
            .status(400)
            .json({
                status: "bad request",
                message: "Please ensure minPrice parameter is a numeric whole number."
            });
        }

        if (minPrice < 0) {
            return res
            .status(400)
            .json({
                status: "bad request",
                message: "Please ensure minPrice is not negative."
            });
        }

        columns.push("L_SystemPrice >= ?");
        values.push(minPrice);
    }

    if (req.query.maxPrice) {
        maxPrice = parseInt(req.query.maxPrice);

        if (!maxPrice && maxPrice !== 0) {
            return res
            .status(400)
            .json({
                status: "bad request",
                message: "Please ensure maxPrice parameter is a numeric whole number."
            });
        }

        if (maxPrice < 0) {
            return res
            .status(400)
            .json({
                status: "bad request",
                message: "Please ensure maxPrice is not negative."
            });
        }

        columns.push("L_SystemPrice <= ?");
        values.push(maxPrice);
    }

    if (req.query.beds) {
        beds = parseInt(req.query.beds);

        if (!beds && beds !== 0) {
            return res
            .status(400)
            .json({
                status: "bad request",
                message: "Please ensure beds parameter is a numeric whole number."
            });
        }

        if (beds < 0) {
            return res
            .status(400)
            .json({
                status: "bad request",
                message: "Please ensure beds is not negative."
            });
        }

        columns.push("L_Keyword2 = ?");
        values.push(beds);
    }

    if (req.query.baths) {
        baths = parseInt(req.query.baths);

        if (!baths && baths !== 0) {
            return res
            .status(400)
            .json({
                status: "bad request",
                message: "Please ensure baths parameter is a numeric whole number."
            });
        }

        if (baths < 0) {
            return res
            .status(400)
            .json({
                status: "bad request",
                message: "Please ensure baths is not negative."
            });
        }

        columns.push("LM_Dec_3 = ?");
        values.push(baths);
    }

    if (columns.length) {
        wherequery = "WHERE " + columns.join(" AND ");
    } else {
        wherequery = "";
    }
    try {
        // const count = await pool.query(`SELECT COUNT(L_Address) FROM rets_property`);
        // const result = await pool.query(`SELECT L_ListingID, LM_Dec_3 FROM rets_property ORDER BY L_ListingID LIMIT 20;`);
        const count = await pool.query(`SELECT COUNT(*) AS total FROM rets_property ${wherequery};`, values);
        const result = await pool.query(
            `SELECT L_ListingID, L_City, L_Zip, L_SystemPrice AS Price, L_Keyword2 AS Beds, LM_Dec_3 AS Baths
            FROM rets_property ${wherequery} ORDER BY L_ListingID
            LIMIT ? OFFSET ?;`, [...values, limit, offset]
        );
        console.log(count[0][0]["total"]);
        return res
        .status(200)
        .json({
            "total": count[0][0]["total"],
            "limit": limit,
            "offset": offset,
            "results": result[0]
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

export default router;