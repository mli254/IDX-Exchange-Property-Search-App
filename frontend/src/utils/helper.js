import { parseISO } from "date-fns";

function parsePhotos(photosJSON) {
  if (!photosJSON) {
    return [];
  }

  try {
    const photos = JSON.parse(photosJSON);

    if (!Array.isArray(photos)) {
      return [];
    }

    return photos.filter(
      (photo) =>
        (typeof photo === "string" || photo instanceof String) &&
        photo.trim() !== "",
    );
  } catch {
    console.log("unable to parse JSON string");
    return [];
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

function formatDate(dateLiteral) {
  const date = parseISO(dateLiteral);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString(undefined, options);
}

function formatTime(timeLiteral) {
  let hours = parseInt(timeLiteral.slice(0, 2));
  if (isNaN(hours)) {
    return null;
  }
  const minutes = timeLiteral.slice(2, 5);

  let time = "";

  if (hours === 0) {
    time += `12`;
    time += `${minutes}`;
    time += " AM";
  } else if (hours < 12) {
    time += `${hours}`;
    time += `${minutes}`;
    time += " AM";
  } else if (hours === 12) {
    time += `12`;
    time += `${minutes}`;
    time += " PM";
  } else {
    hours = hours % 12;
    time += `${hours}`;
    time += `${minutes}`;
    time += " PM";
  }

  return time;
}

export {
  parsePhotos,
  formatPrice,
  formatSQFT,
  formatLocation,
  formatDate,
  formatTime,
};
