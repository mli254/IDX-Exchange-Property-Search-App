import express from 'express';
import { pool } from "../db.js";

const router = express.Router();

// inspired by Ray, refactored my repeated error handling code into a single function
function paramValidation (param, label, min=null, max=null) {
    let parsedParam = parseInt(param);

    if (!parsedParam && parsedParam !== 0) {
        return { error: `Please ensure ${label} parameter is a numeric whole number.` };
    }

    if (min !== null && parsedParam < min) {
        return { error: `Please ensure ${label} parameter is greater than ${min}` };
    }

    if (max !== null && parsedParam > max) {
        return { error: `Please ensure ${label} parameter is less than ${max}` };
    }

    return { parsedParam };
}

router.get('/', async (req, res) => {
    // est. default values
    let limit = 20;
    let offset = 0;

    // incrementally append new param values as the conditions are handled below
    const conditions = [];
    const values = []; 

    // handling query params
    if (req.query.limit) {
        const param = paramValidation(req.query.limit, "limit", 1, 100);

        if (param.error) {
            return res.status(400).json({ status: "bad request", message: param.error });
        }

        limit = param.parsedParam;
    }

    if (req.query.offset) {
        const param = paramValidation(req.query.offset, "offset", 0);

        if (param.error) { 
            return res.status(400).json({ status: "bad request", message: param.error });
        }

        offset = param.parsedParam;
    } 

    if (req.query.city) {
        // due to inconsistent whitespaces/casing, both sides of the query will need the additional modifiers
        // the parameterized comparison and value are then pushed to corresponding arrays
        conditions.push("LOWER(TRIM(L_City)) = LOWER(TRIM(?))");
        values.push(req.query.city);
    }

    if (req.query.zipcode) {
        conditions.push("L_Zip = ?");
        values.push(req.query.zipcode);
    }

    if (req.query.minPrice) {
        const param = paramValidation(req.query.minPrice, "minPrice", 0);

        if (param.error) { 
            return res.status(400).json({ status: "bad request", message: param.error });
        }

        conditions.push("L_SystemPrice >= ?");
        values.push(param.parsedParam);
    }

    if (req.query.maxPrice) {
        const param = paramValidation(req.query.maxPrice, "maxPrice", 0);

        if (param.error) {
            return res.status(400).json({ status: "bad request", message: param.error });
        }

        conditions.push("L_SystemPrice <= ?");
        values.push(param.parsedParam);
    }

    if (req.query.beds) {
        const param = paramValidation(req.query.beds, "beds", 0);

        if (param.error) {
            return res.status(400).json({ status: "bad request", message: param.error });
        }

        conditions.push("L_Keyword2 = ?");
        values.push(param.parsedParam);
    }

    if (req.query.baths) {
        const param = paramValidation(req.query.baths, "baths", 0);

        if (param.error) {
            return res.status(400).json({ status: "bad request", message: param.error });
        }

        conditions.push("LM_Dec_3 = ?");
        values.push(param.parsedParam);
    }

    // create the query string; wherequery is blank if no filters are applied/supplied
    const wherequery = conditions.length ? "WHERE " + conditions.join(" AND ") : "";

    try {
        // want to count the full number/amount of rows returned for a given query
        const [count] = await pool.query(`SELECT COUNT(*) AS total FROM rets_property ${wherequery};`, values);
        
        // for cleanliness of viewing, only selecting the rows we're filtering instead of the full row; 
        // this can be modified in the future
        // an ORDER BY L_ListingID command is used to ensure the results are consistent
        // 'AS' keyword allows customization of display names for fields in order to make output more readable 
        const [result] = await pool.query(
            `SELECT L_ListingID AS ListingID, L_City AS City, L_Zip AS Zipcode, L_SystemPrice AS Price, L_Keyword2 AS Beds, LM_Dec_3 AS Baths
            FROM rets_property ${wherequery} ORDER BY L_ListingID
            LIMIT ? OFFSET ?;`, [...values, limit, offset]
        );
        return res
        .status(200)
        .json({
            "total": count[0]["total"],
            "limit": limit,
            "offset": offset,
            "results": result
        });
    } catch (error) {
        res
        .status(500)
        .json({
            status: "internal server error", 
            message: error 
        });
    }    
});

export default router;