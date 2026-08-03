import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import api from '../api/client';

beforeEach(() => {
    globalThis.fetch = vi.fn();
})

afterEach(() => {
    vi.clearAllMocks();
})

describe('client.js Testing', () => {
    test('fetches from the backend without query params', async () => {
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
            Promise.resolve({
                json: () => Promise.resolve(mockResponse)
            })
        );

        const results = await api.fetchProperties();

        expect(results).toEqual(mockResponse);
        expect(fetch).toHaveBeenCalledWith('/api/properties');
    });

    test('fetches from the backend with query params', async () => {
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
            Promise.resolve({
                json: () => Promise.resolve(mockResponse)
            })
        );

        const results = await api.fetchProperties({
            limit: 10,
            offset: 1,
            minPrice: 100,
            maxPrice: 1000000,
            beds: 2,
            baths: 1,
            zipcode: "95060",
            city: "Santa Cruz"
        })

        expect(results).toEqual(mockResponse);
        expect(fetch).toHaveBeenCalledWith("/api/properties/?limit=10&offset=1&city=Santa Cruz&zipcode=95060&minPrice=100&maxPrice=1000000&beds=2&baths=1");
    });

    test('fetches from the backend when backend is down', async () => {
        expect.hasAssertions();
        const mockErrorResponse = {
            status: "internal server error",
            error: "Failed to reach backend.",
        }

        globalThis.fetch.mockRejectedValue(
            Promise.resolve({
                json: () => Promise.resolve(mockErrorResponse)
            })
        )

        const results = await api.fetchProperties({limit: 20, offset: 0});
        expect(results?.status).toBe("internal server error");
        expect(results?.error).toBe("Failed to reach backend.");
    });
})