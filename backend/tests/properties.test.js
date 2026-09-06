import request from 'supertest';
import express from 'express';
import { pool } from '../db';
import propertiesRouter from "../routes/properties.js";
import { afterEach, describe, expect, test, vi } from 'vitest';

vi.mock('../db', () => ({
    pool: {
        query: vi.fn()
    }
}));

const mockProperty = {
    ListingID: "1001717885",
    City: "Blythe",
    State: "CA",
    Address: "4251 N Intake Boulevard",
    Zipcode: "92225",
    Price: 2850000,
    Beds: 3,
    Baths: "2.0",
    SQFT: 2200,
    LivingAreaUnits: "SquareFeet",
    Photos: "[]",
};

const mockPropertyOriginalFieldNames = {
    L_ListingID: "1001717885",
    L_City: "Blythe",
};

const mockOpenHouse = {
    L_ListingID: "1174690153",
    L_DisplayId: "1174690153",
    OpenHouseDate: "2026-06-21T07:00:00.000Z",
};

const app = express();
app.use(express.json());
app.use("/api/properties", propertiesRouter);

describe("Testing /api/properties/ endpoints from properties.js", () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    describe("Testing /api/properties", () => {
        test("Successfully calling /api/properties without query params", async () => {
            pool.query.mockResolvedValueOnce([[{ total: 53122 }]]);
            pool.query.mockResolvedValueOnce([[mockProperty]]);

            const response = await request(app).get('/api/properties');
            expect(response.status).toBe(200);
            expect(response.body.total).toBe(53122);
            expect(response.body.limit).toBe(20);
            expect(response.body.offset).toBe(0);
            expect(response.body.results.length).toBe(1);
            expect(response.body.results[0].ListingID).toBe("1001717885");
            expect(pool.query.mock.calls[1][0]).toContain("ORDER BY L_ListingID ASC");
        });

        test("Successfully querying with pagination params: limit & offset", async () => {
            pool.query.mockResolvedValueOnce([[{ total: 53122 }]]);
            pool.query.mockResolvedValueOnce([[mockProperty]]);

            const response = await request(app).get('/api/properties?limit=30&offset=10');
            expect(response.status).toBe(200);
            expect(response.body.total).toBe(53122);
            expect(response.body.limit).toBe(30);
            expect(response.body.offset).toBe(10);
        });

        test("Successfully querying with city filter parameter", async () => {
            pool.query.mockResolvedValueOnce([[{ total: 126 }]]);
            pool.query.mockResolvedValueOnce([[mockProperty]]);

            const response = await request(app).get('/api/properties?city=Sunnyvale');
            expect(response.status).toBe(200);
            expect(response.body.total).toBe(126);
            expect(response.body.limit).toBe(20);
            expect(response.body.offset).toBe(0);
            expect(pool.query.mock.calls[1][1]).toContain("Sunnyvale");
        });

        test("Successfully querying with zipcode filter parameter", async () => {
            pool.query.mockResolvedValueOnce([[{ total: 57 }]]);
            pool.query.mockResolvedValueOnce([[mockProperty]]);

            const response = await request(app).get('/api/properties?zipcode=95060');
            expect(response.status).toBe(200);
            expect(response.body.total).toBe(57);
            expect(pool.query.mock.calls[1][1]).toContain("95060");
        });

        test("Successfully querying with minPrice filter parameter", async () => {
            pool.query.mockResolvedValueOnce([[{ total: 900 }]]);
            pool.query.mockResolvedValueOnce([[mockProperty]]);

            const response = await request(app).get('/api/properties?minPrice=10000000');
            expect(response.status).toBe(200);
            expect(response.body.total).toBe(900);
            expect(pool.query.mock.calls[1][1]).toContain(10000000);
        });

        test("Successfully querying with maxPrice filter parameter", async () => {
            pool.query.mockResolvedValueOnce([[{ total: 3 }]]);
            pool.query.mockResolvedValueOnce([[mockProperty]]);

            const response = await request(app).get('/api/properties?maxPrice=1000');
            expect(response.status).toBe(200);
            expect(response.body.total).toBe(3);
            expect(pool.query.mock.calls[1][1]).toContain(1000);
        });

        test("Successfully querying with beds filter parameter", async () => {
            pool.query.mockResolvedValueOnce([[{ total: 5190 }]]);
            pool.query.mockResolvedValueOnce([[mockProperty]]);

            const response = await request(app).get('/api/properties?beds=5');
            expect(response.status).toBe(200);
            expect(response.body.total).toBe(5190);
            expect(pool.query.mock.calls[1][1]).toContain(5);
        });

        test("Successfully querying with baths filter parameter", async () => {
            pool.query.mockResolvedValueOnce([[{ total: 600 }]]);
            pool.query.mockResolvedValueOnce([[mockProperty]]);

            const response = await request(app).get('/api/properties?baths=7');
            expect(response.status).toBe(200);
            expect(response.body.total).toBe(600);
            expect(pool.query.mock.calls[1][1]).toContain(7);
        });

        test("Successfully querying with sorting parameters: sortBy & sortOrder", async () => {
            pool.query.mockResolvedValueOnce([[{ total: 53122 }]]);
            pool.query.mockResolvedValueOnce([[mockProperty]]);

            const response = await request(app).get('/api/properties?sortBy=price&sortOrder=desc');
            expect(response.status).toBe(200);
            expect(response.body.total).toBe(53122);
            expect(pool.query.mock.calls[1][0]).toContain("ORDER BY L_SystemPrice DESC");
        });

        test("Error response when limit query param is less than 1", async () => {
            pool.query.mockResolvedValueOnce([[{ total: 53122 }]]);
            pool.query.mockResolvedValueOnce([[mockProperty]]);

            const response = await request(app).get('/api/properties?limit=0');
            expect(response.status).toBe(400);
            expect(response.body.status).toBe("bad request");
            expect(response.body.error).toBe("Please ensure limit parameter is greater than 1");
        });

        test("Error response when limit query param is greater than 100", async () => {
            pool.query.mockResolvedValueOnce([[{ total: 53122 }]]);
            pool.query.mockResolvedValueOnce([[mockProperty]]);

            const response = await request(app).get('/api/properties?limit=101');
            expect(response.status).toBe(400);
            expect(response.body.status).toBe("bad request");
            expect(response.body.error).toBe("Please ensure limit parameter is less than 100");
        });

        test("Error response if limit is non-numeric", async () => {
            pool.query.mockResolvedValueOnce([[{ total: 53122 }]]);
            pool.query.mockResolvedValueOnce([[mockProperty]]);

            const response = await request(app).get('/api/properties?limit=abc');
            expect(response.status).toBe(400);
            expect(response.body.status).toBe("bad request");
            expect(response.body.error).toBe("Please ensure limit parameter is a numeric whole number.");
        });

        test("Error response when offset query param is negative", async () => {
            pool.query.mockResolvedValueOnce([[{ total: 53122 }]]);
            pool.query.mockResolvedValueOnce([[mockProperty]]);

            const response = await request(app).get('/api/properties?offset=-1');
            expect(response.status).toBe(400);
            expect(response.body.status).toBe("bad request");
            expect(response.body.error).toBe("Please ensure offset parameter is greater than 0");
        });

        test("Error response if offset is non-numeric", async () => {
            pool.query.mockResolvedValueOnce([[{ total: 53122 }]]);
            pool.query.mockResolvedValueOnce([[mockProperty]]);

            const response = await request(app).get('/api/properties?offset=abc');
            expect(response.status).toBe(400);
            expect(response.body.status).toBe("bad request");
            expect(response.body.error).toBe("Please ensure offset parameter is a numeric whole number.");
        });

        test("Error response when sortBy query param is not whitelisted", async () => {
            pool.query.mockResolvedValueOnce([[{ total: 53122 }]]);
            pool.query.mockResolvedValueOnce([[mockProperty]]);

            const response = await request(app).get('/api/properties?sortBy=invalid');
            expect(response.status).toBe(400);
            expect(response.body.status).toBe("bad request");
            expect(response.body.error).toBe("invalid is not a valid parameter. For sorting, please choose one of: default, price, date-listed, square-footage, or beds.");
        });

        test("Error response when minPrice query param is negative", async () => {
            pool.query.mockResolvedValueOnce([[{ total: 53122 }]]);
            pool.query.mockResolvedValueOnce([[mockProperty]]);

            const response = await request(app).get('/api/properties?minPrice=-1');
            expect(response.status).toBe(400);
            expect(response.body.status).toBe("bad request");
            expect(response.body.error).toBe("Please ensure minPrice parameter is greater than 0");
        });      

        test("Error response if minPrice is non-numeric", async () => {
            pool.query.mockResolvedValueOnce([[{ total: 53122 }]]);
            pool.query.mockResolvedValueOnce([[mockProperty]]);

            const response = await request(app).get('/api/properties?minPrice=abc');
            expect(response.status).toBe(400);
            expect(response.body.status).toBe("bad request");
            expect(response.body.error).toBe("Please ensure minPrice parameter is a numeric whole number.");
        });        
        
        test("Error response when maxPrice query param is negative", async () => {
            pool.query.mockResolvedValueOnce([[{ total: 53122 }]]);
            pool.query.mockResolvedValueOnce([[mockProperty]]);

            const response = await request(app).get('/api/properties?maxPrice=-1');
            expect(response.status).toBe(400);
            expect(response.body.status).toBe("bad request");
            expect(response.body.error).toBe("Please ensure maxPrice parameter is greater than 0");
        }); 

        test("Error response if maxPrice is non-numeric", async () => {
            pool.query.mockResolvedValueOnce([[{ total: 53122 }]]);
            pool.query.mockResolvedValueOnce([[mockProperty]]);

            const response = await request(app).get('/api/properties?maxPrice=abc');
            expect(response.status).toBe(400);
            expect(response.body.status).toBe("bad request");
            expect(response.body.error).toBe("Please ensure maxPrice parameter is a numeric whole number.");
        });

        test("Error response when beds query param is negative", async () => {
            pool.query.mockResolvedValueOnce([[{ total: 53122 }]]);
            pool.query.mockResolvedValueOnce([[mockProperty]]);

            const response = await request(app).get('/api/properties?beds=-1');
            expect(response.status).toBe(400);
            expect(response.body.status).toBe("bad request");
            expect(response.body.error).toBe("Please ensure beds parameter is greater than 0");
        }); 

        test("Error response if beds is non-numeric", async () => {
            pool.query.mockResolvedValueOnce([[{ total: 53122 }]]);
            pool.query.mockResolvedValueOnce([[mockProperty]]);

            const response = await request(app).get('/api/properties?beds=abc');
            expect(response.status).toBe(400);
            expect(response.body.status).toBe("bad request");
            expect(response.body.error).toBe("Please ensure beds parameter is a numeric whole number.");
        });

        test("Error response when baths query param is negative", async () => {
            pool.query.mockResolvedValueOnce([[{ total: 53122 }]]);
            pool.query.mockResolvedValueOnce([[mockProperty]]);

            const response = await request(app).get('/api/properties?baths=-1');
            expect(response.status).toBe(400);
            expect(response.body.status).toBe("bad request");
            expect(response.body.error).toBe("Please ensure baths parameter is greater than 0");
        }); 

        test("Error response if baths is non-numeric", async () => {
            pool.query.mockResolvedValueOnce([[{ total: 53122 }]]);
            pool.query.mockResolvedValueOnce([[mockProperty]]);

            const response = await request(app).get('/api/properties?baths=abc');
            expect(response.status).toBe(400);
            expect(response.body.status).toBe("bad request");
            expect(response.body.error).toBe("Please ensure baths parameter is a numeric whole number.");
        });

        test("Error response when database query fails", async () => {
            pool.query.mockRejectedValue(new Error("Database Connection Refused"));

            const response = await request(app).get('/api/properties');

            expect(response.status).toBe(500);
            expect(response.body.status).toBe("internal server error");
            expect(response.body.error).toBe("Unable to connect to database.");
        });
    });

    describe("Testing /api/properties/:id", () => {
        test("Successfully querying for an existing property by id", async () => {
            pool.query.mockResolvedValueOnce([[mockPropertyOriginalFieldNames]]);

            const response = await request(app).get('/api/properties/1001717885');
            expect(response.status).toBe(200);
            expect(response.body.results.length).toBe(1);
            expect(response.body.results?.[0].L_ListingID).toBe("1001717885");
            expect(response.body.results?.[0].L_City).toBe("Blythe");
        });

        test("Error response when specified id param is non-numeric", async () => {
            pool.query.mockResolvedValueOnce([[mockPropertyOriginalFieldNames]]);

            const response = await  request(app).get('/api/properties/invalid');
            expect(response.status).toBe(400);
            expect(response.body.status).toBe("bad request");
            expect(response.body.error).toBe("Please ensure listing ID is numeric.");
        });

        test("Error response when id param is less than 100000000", async () => {
            pool.query.mockResolvedValueOnce([[mockPropertyOriginalFieldNames]]);

            const response = await  request(app).get('/api/properties/1');
            expect(response.status).toBe(400);
            expect(response.body.status).toBe("bad request");
            expect(response.body.error).toBe("Please ensure listing ID is between 100000000 and 9999999999.");
        });

        test("Error response when id param is greater than 9999999999", async () => {
            pool.query.mockResolvedValueOnce([[mockPropertyOriginalFieldNames]]);

            const response = await  request(app).get('/api/properties/19999999999');
            expect(response.status).toBe(400);
            expect(response.body.status).toBe("bad request");
            expect(response.body.error).toBe("Please ensure listing ID is between 100000000 and 9999999999.");
        });

        test("404 error response when id param is not in database", async () => {
            pool.query.mockResolvedValueOnce([[]]);

            const response = await request(app).get('/api/properties/100000000');
            expect(response.status).toBe(404);
            expect(response.body.status).toBe("not found");
            expect(response.body.error).toBe("No listing was found for ID 100000000.");
        });

        test("Error response when database query fails", async () => {
            pool.query.mockRejectedValue(new Error("Database Connection Refused"));

            const response = await request(app).get('/api/properties/1001717885');

            expect(response.status).toBe(500);
            expect(response.body.status).toBe("internal server error");
            expect(response.body.error).toBe("Unable to connect to database.");
        });
    });

    describe("Testing /api/properties/:id/openhouses", () => {
        test("Successfully querying a property's openhouse events", async () => {
            pool.query.mockResolvedValueOnce([[mockPropertyOriginalFieldNames]]);
            pool.query.mockResolvedValueOnce([[mockOpenHouse]]);

            const response = await request(app).get('/api/properties/1174690153/openhouses');
            expect(response.status).toBe(200);
            expect(response.body.openhouses.length).toBe(1);
            expect(response.body.openhouses[0].L_ListingID).toBe("1174690153");
            expect(response.body.openhouses[0].L_DisplayId).toBe("1174690153");
            expect(response.body.openhouses[0].OpenHouseDate).toBe("2026-06-21T07:00:00.000Z");
        });

        test("Querying a property without an openhouse event returns an empty array", async () => {
            pool.query.mockResolvedValueOnce([[mockPropertyOriginalFieldNames]]);
            pool.query.mockResolvedValueOnce([[]]);

            const response = await request(app).get('/api/properties/1001717885/openhouses');
            expect(response.status).toBe(200);
            expect(response.body.openhouses.length).toBe(0);
        });

        test("404 error response when id param used to query for openhouse events is not in database", async () => {
            pool.query.mockResolvedValueOnce([[]]);
            pool.query.mockResolvedValueOnce([[]]);

            const response = await request(app).get('/api/properties/100000000');
            expect(response.status).toBe(404);
            expect(response.body.status).toBe("not found");
            expect(response.body.error).toBe("No listing was found for ID 100000000.");
        });

        test("Error response when database query fails", async () => {
            pool.query.mockRejectedValue(new Error("Database Connection Refused"));

            const response = await request(app).get('/api/properties/1174690153/openhouses');

            expect(response.status).toBe(500);
            expect(response.body.status).toBe("internal server error");
            expect(response.body.error).toBe("Unable to connect to database.");
        });
    });
});

