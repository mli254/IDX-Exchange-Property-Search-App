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

  if (params.limit) {
    queries.push(`limit=${params.limit}`);
  }
  if (params.offset) {
    queries.push(`offset=${params.offset}`);
  }
  if (params.city) {
    queries.push(`city=${params.city}`);
  }
  if (params.zipcode) {
    queries.push(`zipcode=${params.zipcode}`);
  }
  if (params.minPrice) {
    queries.push(`minPrice=${params.minPrice}`);
  }
  if (params.maxPrice) {
    queries.push(`maxPrice=${params.maxPrice}`);
  }
  if (params.beds) {
    queries.push(`beds=${params.beds}`);
  }
  if (params.baths) {
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
    return { status: "internal server error", error: "Failed to reach backend.", message: e };
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
    console.log(e);
    return { status: "internal server error", error: "Failed to reach backend.", message: e };
  }
};

/*
    Sample Usage: 
    -----------------
    useEffect(() => {
        const loadSingleProperty = async () => {
        setLoading(true);

        const response = await api.fetchPropertyDetail("1118422731");
        if (response.error) {
            setError(true);
            setErrorMsg(response);
        } else {
            setSingleProperty(response);
        }

        setLoading(false);
        };

        loadSingleProperty();
    }, []);

*/

const api = {
  fetchProperties: fetchProperties,
  fetchPropertyDetail: fetchPropertyDetail,
};

export default api;
