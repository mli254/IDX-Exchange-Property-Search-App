import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import PropertyFilters from '../components/PropertyFilters';

const DEFAULT_PARAMS = {
    city: "",
    zipcode: "",
    minPrice: "",
    maxPrice: "",
    beds: "",
    baths: "",
  };

afterEach(() => {
    vi.clearAllMocks();
});

describe("PropertyFilters renders properly", () => {
    test("Renders PropertyCard component", () => {
        render( <PropertyFilters />);
        
        expect(screen.getByText("Please enter filter values here:")).toBeInTheDocument();
        expect(screen.getByText("City:")).toBeInTheDocument();
        expect(screen.getByText("Zipcode:")).toBeInTheDocument();
        expect(screen.getByText("Minimum Price:")).toBeInTheDocument();
        expect(screen.getByText("Maximum Price:")).toBeInTheDocument();
        expect(screen.getByText("Number of Beds:")).toBeInTheDocument();
        expect(screen.getByText("Number of Baths:")).toBeInTheDocument();
    });

    test("Checks search functionality", async () => {
        const onSearch = vi.fn();
        render( <PropertyFilters 
            filterValues={DEFAULT_PARAMS} 
            defaultParams={DEFAULT_PARAMS} 
            updateFilter={onSearch} />);
        await userEvent.type(screen.getByRole("textbox", {name: "City:"}), "Santa Cruz");
        await userEvent.type(screen.getByRole("textbox", {name: "Zipcode:"}), "95060");
        await userEvent.type(screen.getByRole("textbox", {name: "Minimum Price:"}), "1000");
        await userEvent.type(screen.getByRole("textbox", {name: "Maximum Price:"}), "1000000");
        await userEvent.type(screen.getByRole("textbox", {name: "Number of Beds:"}), "3");
        await userEvent.type(screen.getByRole("textbox", {name: "Number of Baths:"}), "2");

        fireEvent.click(screen.getByRole("button", {name: "Submit"}));

        expect(onSearch).toHaveBeenCalledTimes(1);
        expect(onSearch.mock.calls[0][0].city).toBe("Santa Cruz");
        expect(onSearch.mock.calls[0][0].zipcode).toBe("95060");
        expect(onSearch.mock.calls[0][0].minPrice).toBe("1000");
        expect(onSearch.mock.calls[0][0].maxPrice).toBe("1000000");
        expect(onSearch.mock.calls[0][0].beds).toBe("3");
        expect(onSearch.mock.calls[0][0].baths).toBe("2");        
    });

    test("Checks clear functionality", () => {
        const onClear = vi.fn();

        render(<PropertyFilters clearFilter={onClear} />);
        fireEvent.click(screen.getByRole("button", {name: "Clear"}));

        expect(onClear).toHaveBeenCalledTimes(1);
        expect(screen.getByPlaceholderText("Enter city name...")).toBeInTheDocument;
        expect(screen.getByPlaceholderText("Enter zipcode...")).toBeInTheDocument;
        expect(screen.getByPlaceholderText("Enter the minimum price...")).toBeInTheDocument;
        expect(screen.getByPlaceholderText("Enter the maximum price...")).toBeInTheDocument;
        expect(screen.getByPlaceholderText("Enter the number of beds...")).toBeInTheDocument;
        expect(screen.getByPlaceholderText("Enter the number of baths...")).toBeInTheDocument;
    });
});