import { describe, test, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import Pagination from "../components/Pagination"

afterEach(() => {
    vi.clearAllMocks();
})

describe("Pagination renders properly", () => {
    const changePage = vi.fn( (pageNumber) => {
        return pageNumber;
    });

    test("First page renders properly", async () => {
        const currentPage = 1;   
        const itemsPerPage = 20;
        const totalItems = 53122;
        const loading = false;
        const pageNumbers = ["1", "2", "3", "...", "2657"];

        render( <Pagination 
            currentPage={currentPage} 
            itemsPerPage={itemsPerPage} 
            totalItems={totalItems}
            changePage={changePage}
            loading={loading}
            /> );

        expect(screen.getByText("Previous")).toBeInTheDocument();
        expect(screen.getByText("Next")).toBeInTheDocument();

        await expect(screen.getByRole("button", {name: "Previous"})).toBeDisabled();
        await expect(screen.getByRole("button", {name: "..."})).toBeDisabled();

        fireEvent.click(screen.getByRole("button", {name: "Next"}));
        expect(changePage).toHaveBeenCalledWith(currentPage + 1);

        pageNumbers.forEach( (page) => {
            expect(screen.getByText(page)).toBeInTheDocument();
            if (page !== "...") {
                fireEvent.click(screen.getByRole("button", {name: page}));
                expect(changePage).toHaveBeenCalledWith(parseInt(page));            
            }
        });
    });

    test("Last page renders properly", async () => {
        const currentPage = 2657;   
        const itemsPerPage = 20;
        const totalItems = 53122;
        const loading = false;
        const pageNumbers = ["1", "...", "2655", "2656", "2657"];

        render( <Pagination 
            currentPage={currentPage} 
            itemsPerPage={itemsPerPage} 
            totalItems={totalItems}
            changePage={changePage}
            loading={loading}
            /> );

        expect(screen.getByText("Previous")).toBeInTheDocument();
        expect(screen.getByText("Next")).toBeInTheDocument();

        await expect(screen.getByRole("button", {name: "Next"})).toBeDisabled();
        await expect(screen.getByRole("button", {name: "..."})).toBeDisabled();

        fireEvent.click(screen.getByRole("button", {name: "Previous"}));
        expect(changePage).toHaveBeenCalledWith(currentPage - 1);

        pageNumbers.forEach( (page) => {
            expect(screen.getByText(page)).toBeInTheDocument();
            if (page !== "...") {
                fireEvent.click(screen.getByRole("button", {name: page}));
                expect(changePage).toHaveBeenCalledWith(parseInt(page));            
            }
        });
    });

    test("Middle page renders properly", async () => {
        const currentPage = 1329;   
        const itemsPerPage = 20;
        const totalItems = 53122;
        const loading = false;  
        const pageNumbers = [1, 1327, 1328, 1329, 1330, 1331, 2657]; 

        render( <Pagination 
            currentPage={currentPage} 
            itemsPerPage={itemsPerPage} 
            totalItems={totalItems}
            changePage={changePage}
            loading={loading}
            /> );

        expect(screen.getByText("Previous")).toBeInTheDocument();
        expect(screen.getByText("Next")).toBeInTheDocument();
        expect(screen.getAllByText("...")[0]).toBeInTheDocument();
        expect(screen.getAllByText("...")[1]).toBeInTheDocument();

        await expect(screen.getAllByRole("button", {name: "..."})[0]).toBeDisabled();
        await expect(screen.getAllByRole("button", {name: "..."})[1]).toBeDisabled();

        fireEvent.click(screen.getByRole("button", {name: "Previous"}));
        expect(changePage).toHaveBeenCalledWith(currentPage - 1);
        fireEvent.click(screen.getByRole("button", {name: "Next"}));
        expect(changePage).toHaveBeenCalledWith(currentPage + 1);

        pageNumbers.forEach( (page) => {
            expect(screen.getByText(page)).toBeInTheDocument();
            fireEvent.click(screen.getByRole("button", {name: page}));
            expect(changePage).toHaveBeenCalledWith(page);
        });
    });

    test("Pagination has no ellipses when there are only 7 pages", () => {
        const currentPage = 3;   
        const itemsPerPage = 20;
        const totalItems = 140;
        const loading = false;   

        render( <Pagination 
            currentPage={currentPage} 
            itemsPerPage={itemsPerPage} 
            totalItems={totalItems}
            changePage={changePage}
            loading={loading}
            /> );

        for (let i = 1; i <= (Math.ceil(totalItems/itemsPerPage)); i++) {
            expect(screen.getByText(i)).toBeInTheDocument();
            fireEvent.click(screen.getByRole("button", {name: i}));
            expect(changePage).toHaveBeenCalledWith(i);
        }
        
        expect(screen.queryByText("...")).not.toBeInTheDocument();
    });

    test("Pagination hidden if there is only one page of results", async () => {
        const currentPage = 1;   
        const itemsPerPage = 20;
        const totalItems = 20;
        const loading = false;   

        render( <Pagination 
            currentPage={currentPage} 
            itemsPerPage={itemsPerPage} 
            totalItems={totalItems}
            changePage={changePage}
            loading={loading}
            /> );

        await expect(screen.getByRole("navigation")).toHaveClass("hidden");
    });

    test("Pagination buttons are disabled when data is loading", async () => {
        const currentPage = 1;   
        const itemsPerPage = 20;
        const totalItems = 53122;
        const loading = true;   
        const pageNumbers = ["1", "2", "3", "...", "2657"];

        render( <Pagination 
            currentPage={currentPage} 
            itemsPerPage={itemsPerPage} 
            totalItems={totalItems}
            changePage={changePage}
            loading={loading}
            /> );
        
        await expect(screen.getByRole("button", {name: "Previous"})).toBeDisabled();
        await expect(screen.getByRole("button", {name: "Next"})).toBeDisabled();

        pageNumbers.forEach( async (page) => {
            await expect(screen.getByRole("button", {name: page})).toBeDisabled();
        });
    });
});