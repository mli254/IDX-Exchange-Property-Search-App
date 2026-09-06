import { describe, test, expect} from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';

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

describe("PropertyCard renders properly", () => {
    test("Renders PropertyCard component", () => {
        render( 
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="/" element={<PropertyCard property={mockProperty} />}/>
                <Route path="/property/1001717885" element={<div>Property Detail Page</div>}/>
            </Routes>
        </MemoryRouter>
        );

        const linkElement = screen.getByRole('link', {name: "1 / 1 photos $2,850,000.00 3 beds | 2 baths | 2,200 sqft 4251 N Intake Boulevard Blythe, CA 92225"});
        expect(linkElement).toBeInTheDocument();
        expect(linkElement).toHaveAttribute('href', '/property/1001717885');

        fireEvent.click(linkElement);
        expect(screen.getByText('Property Detail Page')).toBeInTheDocument();
    });
});
