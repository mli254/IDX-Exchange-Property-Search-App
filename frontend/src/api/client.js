const fetchProperties = async (params) => {
  /*
        params = {
            limit       offset      city    zipcode
            minPrice    maxPrice    beds    baths
        }

        url format:
        http://localhost:5000/api/properties/?param=value&...
    */
  const queries = [];

  if (params && params.limit) {
    queries.push(`limit=${params.limit}`);
  }
  if (params && params.offset) {
    queries.push(`offset=${params.offset}`);
  }
  if (params && params.sortBy) {
    queries.push(`sortBy=${params.sortBy}`);
  }
  if (params && params.sortOrder) {
    queries.push(`sortOrder=${params.sortOrder}`);
  }
  if (params && params.city) {
    queries.push(`city=${params.city}`);
  }
  if (params && params.zipcode) {
    queries.push(`zipcode=${params.zipcode}`);
  }
  if (params && params.minPrice) {
    queries.push(`minPrice=${params.minPrice}`);
  }
  if (params && params.maxPrice) {
    queries.push(`maxPrice=${params.maxPrice}`);
  }
  if (params && params.beds) {
    queries.push(`beds=${params.beds}`);
  }
  if (params && params.baths) {
    queries.push(`baths=${params.baths}`);
  }

  const queryString = queries.length
    ? "/api/properties/?" + queries.join("&")
    : "/api/properties";

  try {
    const response = await fetch(`${queryString}`);

    if (response.ok) {
      return await response.json();
    } else {
      const errResponse = await response.json();
      console.log(errResponse);
      return errResponse;
    }
  } catch (e) {
    console.log(e);
    return {
      status: "internal server error",
      error: "Failed to reach backend.",
      message: e,
    };
  }
};

const fetchPropertyDetail = async (id) => {
  try {
    const response = await fetch(`/api/properties/${id}`);

    if (response.ok) {
      return await response.json();
    } else {
      const errResponse = await response.json();
      console.log(errResponse);
      return errResponse;
    }
  } catch (e) {
    return {
      status: "internal server error",
      error: "Failed to reach backend.",
      message: e,
    };
  }
};

const fetchPropertyOpenhouses = async (id) => {
  try {
    const response = await fetch(`/api/properties/${id}/openhouses`);

    if (response.ok) {
      return await response.json();
    } else {
      const errResponse = await response.json();
      console.log(errResponse);
      return errResponse;
    }
  } catch (e) {
    return {
      status: "internal server error",
      error: "Failed to reach backend.",
      message: e,
    };
  }
};

const api = {
  fetchProperties: fetchProperties,
  fetchPropertyDetail: fetchPropertyDetail,
  fetchPropertyOpenhouses: fetchPropertyOpenhouses,
};

export default api;
