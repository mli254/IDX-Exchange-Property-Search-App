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
    
    const queryString = queries.length ? "/api/properties/?" + queries.join('&') : "api/properties"

    try {
        const response = await fetch (`${queryString}`);

        if (response.ok) {
            return await response.json();
            // console.log(await response.json());
        }

    } catch (e) {
        console.log(e);
    }
}

const fetchPropertyDetail = async (id) => {
    try {
        console.log(id);
    } catch (e) {
        console.log(e);
    }
}

const api = {
    fetchProperties: fetchProperties,
    fetchPropertyDetail: fetchPropertyDetail,
}

export default api;