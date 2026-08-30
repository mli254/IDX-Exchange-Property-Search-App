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
    console.error("unable to parse JSON string");
    return [];
  }
}

function parseCamelCase(camelCaseString) {
  if (!camelCaseString) {
    return null;
  }
  const regex = /([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g;
  const convertedString = camelCaseString.replace(regex, "$1$4 $2$3$5");
  if (!convertedString) {
    return camelCaseString;
  }
  return convertedString;
}

function parseCommas(commaString) {
  if (!commaString) {
    return null;
  }

  return commaString.replace(/,/g, ", ");
}

function parseCommaAndCamelCase(commaCamelString) {
  if (!commaCamelString) {
    return null;
  }

  const words = commaCamelString.split(",");

  words.forEach((word, index, array) => {
    array[index] = `${parseCamelCase(word)}`;
  });

  return words;
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

function formatNumber(number) {
  if (!number) {
    return null;
  }

  if (isNaN(number)) {
    return null;
  }

  return number.toLocaleString();
}

function formatLocation(city, state, zip) {
  // all present
  if (city && state && zip) {
    return `${city}, ${state} ${zip}`;
  }

  // one is missing
  if (!city && state && zip) {
    return `${state} ${zip}`;
  }

  if (!state && city && zip) {
    return `${city}, ${zip}`;
  }

  if (!zip && city && state) {
    return `${city}, ${state}`;
  }

  // two are missing
  const parsedZip = parseInt(zip);
  if (!city && !state && parsedZip > 0) {
    return `${zip}`;
  }

  if (!city && !zip && state) {
    return `${state}`;
  }

  if (!zip && !state && city) {
    return `${city}`;
  }

  // all missing
  if (!city && !state && (parsedZip < 1 || isNaN(parsedZip))) {
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
  parseCamelCase,
  parseCommaAndCamelCase,
  parseCommas,
  formatPrice,
  formatNumber,
  formatLocation,
  formatDate,
  formatTime,
};