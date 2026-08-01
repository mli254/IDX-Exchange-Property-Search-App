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
        <fieldset className="m-1 p-2 border-1 border-gray-300">
          <legend className="m-1 p-1 font-bold">
            Please enter filter values here:
          </legend>
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
            className="border-1 border-gray-200 p-1 m-1"
          />
          <div className="block mx-3 mt-1">
            <button
              type="submit"
              className="transition duration-200 mx-2 px-2 pb-1 border-1 border-gray-300 rounded-lg hover:bg-gray-300"
            >
              Submit
            </button>
            <button
              type="button"
              className="transition duration-200 mx-2 px-2 pb-1 border-1 border-gray-300 rounded-lg hover:bg-gray-300"
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
