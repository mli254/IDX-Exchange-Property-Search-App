export default function PropertyFilters() {
  return (
    <>
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
          name="city-filter"
          placeholder="Enter city name..."
          className="border-1 border-gray-200 p-1 m-1"
        />
      </fieldset>
    </>
  );
}
