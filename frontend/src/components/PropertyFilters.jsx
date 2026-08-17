import { useState } from "react";

export default function PropertyFilters({
  filterValues,
  defaultParams,
  updateFilter,
  clearFilter,
}) {
  const [tempFilter, setTempFilter] = useState({ ...filterValues });

  function handleChange(event) {
    const { name, value } = event.target;
    setTempFilter({
      ...tempFilter,
      [name]: value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    updateFilter(tempFilter);
  }

  function handleClear() {
    setTempFilter({ ...defaultParams });
    clearFilter();
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <fieldset className="w-[90%] md:w-[70%] m-1 p-2 border-1 border-gray-300 rounded-md">
          <legend className="m-1 p-1 font-bold">
            Please enter filter values here:
          </legend>
          <div className="grid grid-cols-2">
            <div>
              <label htmlFor="city-filter" className="font-bold mx-3">
                City:{" "}
              </label>
              <input
                type="text"
                id="city-filter"
                name="city"
                placeholder="Enter city name..."
                value={tempFilter.city}
                onChange={handleChange}
                className="bg-white border-1 border-gray-200 p-1 m-1 placeholder:text-sm"
              />
            </div>
            <div>
              <label htmlFor="zip-filter" className="font-bold mx-3">
                Zipcode:{" "}
              </label>
              <input
                type="text"
                id="zip-filter"
                name="zipcode"
                placeholder="Enter zipcode..."
                value={tempFilter.zipcode}
                onChange={handleChange}
                className="bg-white border-1 border-gray-200 p-1 m-1 placeholder:text-sm"
              />
            </div>
            <div>
              <label htmlFor="minPrice-filter" className="font-bold mx-3">
                Minimum Price:{" "}
              </label>
              <input
                type="text"
                id="minPrice-filter"
                name="minPrice"
                placeholder="Enter the minimum price..."
                value={tempFilter.minPrice}
                onChange={handleChange}
                className="bg-white border-1 border-gray-200 p-1 m-1 placeholder:text-sm"
              />
            </div>
            <div>
              <label htmlFor="maxPrice-filter" className="font-bold mx-3">
                Maximum Price:{" "}
              </label>
              <input
                type="text"
                id="maxPrice-filter"
                name="maxPrice"
                placeholder="Enter the maximum price..."
                value={tempFilter.maxPrice}
                onChange={handleChange}
                className="bg-white border-1 border-gray-200 p-1 m-1 placeholder:text-sm"
              />
            </div>
            <div>
              <label htmlFor="beds-filter" className="font-bold mx-3">
                Number of Beds:{" "}
              </label>
              <input
                type="text"
                id="beds-filter"
                name="beds"
                placeholder="Enter the number of beds..."
                value={tempFilter.beds}
                onChange={handleChange}
                className="bg-white border-1 border-gray-200 p-1 m-1 placeholder:text-sm"
              />
            </div>
            <div>
              <label htmlFor="baths-filter" className="font-bold mx-3">
                Number of Baths:{" "}
              </label>
              <input
                type="text"
                id="baths-filter"
                name="baths"
                placeholder="Enter the number of baths..."
                value={tempFilter.baths}
                onChange={handleChange}
                className="bg-white border-1 border-gray-200 p-1 m-1 placeholder:text-sm"
              />
            </div>
          </div>
          <div className="block mx-3 mt-4 mb-2">
            <button
              type="submit"
              className="transition duration-200 mx-2 px-3 py-1 font-bold text-white bg-blue-900 rounded-lg hover:bg-sky-700"
              // "font-bold text-white bg-blue-900 rounded-lg px-2 disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-sky-700"
            >
              Submit
            </button>
            <button
              type="button"
              className="transition duration-200 mx-2 px-3 py-1 font-bold text-white bg-blue-900 rounded-lg hover:bg-sky-700"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </fieldset>
      </form>
    </>
  );
}