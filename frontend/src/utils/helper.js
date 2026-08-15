function parseFirstPhoto(photosJSON) {
  if (!photosJSON) {
    return null;
  }
  try {
    const photos = JSON.parse(photosJSON);
    if (!Array.isArray(photos) || photos.length === 0) {
      return null;
    }
    return photos[0];
  } catch {
    console.log("JSON not able to parse the photo JSON string.");
    return null;
  }
}

function formatPrice(price, locale = "en-US", currency = "USD") {
  if (!price) {
    return null;
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(price);
}

function formatSQFT(sqft) {
  if (!sqft) {
    return null;
  }

  return sqft.toLocaleString();
}

function formatLocation(city, state, zip) {
  if (city && state && zip) {
    return `${city}, ${state} ${zip}`;
  }

  if (!city && state && zip) {
    return `${state} ${zip}`;
  }

  if (!state && city && zip) {
    return `${city}, ${zip}`;
  }

  if (!city && !state && parseInt(zip) > 0) {
    return `${zip}`;
  }

  if (!city && !state && parseInt(zip) < 1) {
    return "—";
  }
}

export { parseFirstPhoto, formatPrice, formatSQFT, formatLocation };