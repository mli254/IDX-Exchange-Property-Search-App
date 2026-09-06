import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import api from '../api/client';

const mockErrorResponse = {
    status: "",
    error: "",
};

beforeEach(() => {
    globalThis.fetch = vi.fn();
});

afterEach(() => {
    vi.resetAllMocks();
});

describe("Testing frontend API functions from client.js", () => {
    describe("Testing fetchProperties: ", () => {
        test("Successfully fetches from /api/properties without query params", async () => {
            expect.hasAssertions();
            const mockResponse = {
                total: 53122,
                limit: 20,
                offset: 0,
                results: [{
                    ListingID: "1000291026"
                }]
            };

            globalThis.fetch.mockResolvedValue(
                {
                    json: () => mockResponse
                }
            );

            const results = await api.fetchProperties();
            expect(results).toEqual(mockResponse);
            expect(fetch).toHaveBeenCalledWith('/api/properties');
        });

        test("Successfully fetches from /api/properties with all possible query params", async () => {
            expect.hasAssertions();
            const mockResponse = {
                total: 2,
                limit: 10,
                offset: 1,
                results: [{
                    ListingID: "1170102295"
                }]
            };

            globalThis.fetch.mockResolvedValue(
                {
                    json: () => mockResponse
                }
            );

            const results = await api.fetchProperties({
                limit: 10,
                offset: 1,
                sortBy: "date-listed",
                sortOrder: "desc",
                minPrice: 100,
                maxPrice: 1000000,
                beds: 2,
                baths: 1,
                zipcode: "95060",
                city: "Santa Cruz"
            });
            expect(results).toEqual(mockResponse);
            expect(fetch).toHaveBeenCalledWith('/api/properties/?limit=10&offset=1&sortBy=date-listed&sortOrder=desc&city=Santa Cruz&zipcode=95060&minPrice=100&maxPrice=1000000&beds=2&baths=1');
        });

        test("Error messages propagate from backend", async () => {
            expect.hasAssertions();
            const mockError = {
                status: "bad request",
                error: "Parameter error occurred."
            };
            globalThis.fetch.mockResolvedValue(
                {
                    json: () => mockError
                }
            );

            const results = await api.fetchProperties({limit: 20, offset: 0});
            expect(results.status).toBe("bad request");
            expect(results.error).toBe("Parameter error occurred.");
        });

        test("Error response if fetching while the backend is down", async () => {
            expect.hasAssertions();
            globalThis.fetch.mockRejectedValue(
                {
                    json: () => mockErrorResponse
                }
            );

            const results = await api.fetchProperties({limit: 20, offset: 0});
            expect(results.status).toBe("internal server error");
            expect(results.error).toBe("Failed to reach backend.");
        });
    });

    describe("Testing fetchPropertyDetail: ", () => {
        test("Successfully fetches from /api/properties/1000291026", async () => {
            expect.hasAssertions();
            const mockResponse = {
                results: [{
                    ListingID: "1000291026"
                }]
            };
            globalThis.fetch.mockResolvedValue(
                {
                    json: () => mockResponse
                }
            );

            const results = await api.fetchPropertyDetail(1000291026);
            expect(results).toEqual(mockResponse);
            expect(fetch).toHaveBeenCalledWith('/api/properties/1000291026');
        });

        test("Error messages propagate from backend", async () => {
            expect.hasAssertions();
            const mockError = {
                status: "bad request",
                error: "Parameter error occurred."
            };
            globalThis.fetch.mockResolvedValue(
                {
                    json: () => mockError
                }
            );

            const results = await api.fetchPropertyDetail(1000291026);
            expect(results.status).toBe("bad request");
            expect(results.error).toBe("Parameter error occurred.");
        });

        test("Error response if fetching while the backend is down", async () => {
            expect.hasAssertions();
            globalThis.fetch.mockRejectedValue(
                {
                    json: () => mockErrorResponse
                }
            );

            const results = await api.fetchPropertyDetail(1000291026);
            expect(results.status).toBe("internal server error");
            expect(results.error).toBe("Failed to reach backend.");
        });
    });    
    
    describe("Testing fetchPropertyOpenhouses: ", () => {
        test("Successfully fetches from /api/properties/1174690153/openhouses", async () => {
            expect.hasAssertions();
            const mockResponse = {
                openhouses: [{
                    ListingID: "1000291026"
                }]
            };
            globalThis.fetch.mockResolvedValue(
                {
                    json: () => mockResponse
                }
            );

            const results = await api.fetchPropertyOpenhouses(1174690153);
            expect(results).toEqual(mockResponse);
            expect(fetch).toHaveBeenCalledWith('/api/properties/1174690153/openhouses');
        });

        test("Error messages propagate from backend", async () => {
            expect.hasAssertions();
            const mockError = {
                status: "bad request",
                error: "Parameter error occurred."
            };
            globalThis.fetch.mockResolvedValue(
                {
                    json: () => mockError
                }
            );

            const results = await api.fetchPropertyOpenhouses(1174690153);
            expect(results.status).toBe("bad request");
            expect(results.error).toBe("Parameter error occurred.");
        });

        test("Error response if fetching while the backend is down", async () => {
            expect.hasAssertions();
            globalThis.fetch.mockRejectedValue(
                {
                    json: () => mockErrorResponse
                }
            );

            const results = await api.fetchPropertyOpenhouses(1174690153);
            expect(results.status).toBe("internal server error");
            expect(results.error).toBe("Failed to reach backend.");
        });
    });
});