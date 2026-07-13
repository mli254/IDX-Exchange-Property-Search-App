// import dotenv from "dotenv/config"; // needs to be the very first import
import mysql from 'mysql2/promise';
import express from 'express';
import { pool } from "../db.js";

const router = express.Router();

router.get('/', async (req, res, next) => {
    // Est. default values
    let limit = 20;
    let offset = 0;
    let city = "";
    let zipcode = "";
    let minPrice = 0;
    let maxPrice = 0;
    let beds = 0;
    let baths = 0;
    let params = [] // incrementally append new param as the conditions are handled below

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
    }
    

    return res.json({
        limit: limit || 20,
        offset: offset,
        city: city,
        zipcode: zipcode,
        minPrice: minPrice,
        maxPrice: maxPrice,
        beds: beds,
        baths: baths
    });
    
    // multiple filters should combine
    // invalid inputs return 400 error
    // all filters used parameterized queries
    // result contains:
    // - total count
    // - limit number
    // - offset number
    // - rows/results
    // use LIMIT and OFFSET in queries
    
});

export default router;