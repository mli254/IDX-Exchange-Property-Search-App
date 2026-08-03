import { describe, test, expect, vi} from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import PropertyFilters from '../components/PropertyFilters';

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

    test("Checks search functionality", () => {
        const onSearch = vi.fn();

        render( <PropertyFilters updateFilter={onSearch} />);
        fireEvent.click(screen.getByRole("button", {name: "Submit"}));

        expect(onSearch).toHaveBeenCalledTimes(1);
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
})