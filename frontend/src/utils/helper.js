import { parseISO } from "date-fns";

/*  Takes in a JSON blob as an argument;
    either returns an array of absolute links to photos or an empty array if the photo array is considered
    malformed at any step of the process
*/
function parsePhotos(photosJSON) {
  // returns an empty array if the JSON supplied is null or otherwise falsy (e.g. "")
  if (!photosJSON) {
    return [];
  }

  // try-catch catches any errors in parsing the JSON with JSON.parse()
  try {
    const photos = JSON.parse(photosJSON);

    // checks if the parsed "photos" object is an array, otherwise considers the parsing a failure and returns an empty array
    if (!Array.isArray(photos)) {
      return [];
    }

    // ensures that each individual parsed photo in the arrat is an actual link (string) and is non-empty
    return photos.filter(
      (photo) =>
        (typeof photo === "string" || photo instanceof String) &&
        photo.trim() !== "",
    );
  } catch {
    // logs the error and returns an empty array
    console.error("unable to parse JSON string");
    return [];
  }
}

/*  Takes in a string in camel case format (e.g. CamelCaseString);
    converts the string by adding spaces between words
 */
function parseCamelCase(camelCaseString) {
  if (!camelCaseString) {
    return null;
  }
  // regex pattern can be matched multiple times due to the '/g' (generic) flag 
  // "|" will force the expression to match with only one or the other pattern on either side of the "|"
  const regex = /([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g;
  // adds a space between between matched pattern groups (i.e. expressions defined between '()')
  const convertedString = camelCaseString.replace(regex, "$1$4 $2$3$5");
  if (!convertedString) {
    // returns the original string if replacement fails
    return camelCaseString;
  }
  return convertedString;
}

/*  Takes in a string with commas (e.g. String,With,Commas);
    returns a string where a space has been added after each comma for formatting
 */
function parseCommas(commaString) {
  if (!commaString) {
    return null;
  }

  return commaString.replace(/,/g, ", ");
}

/*  Takes in a string in camel case format where items are separated by commas (e.g. CamelCaseString,SecondString);
    returns an array of strings where each item between commas has been parsed to include spaces
    * Essentially a helper function for parsing how some fields are stored in the MySQL database
 */
function parseCommaAndCamelCase(commaCamelString) {
  if (!commaCamelString) {
    return null;
  }

  // removes commas and places all items into an array
  const words = commaCamelString.split(",");

  // parses each item to add spaces between words, if applicable, and reassigns the item to its position in the array
  words.forEach((word, index, array) => {
    array[index] = `${parseCamelCase(word)}`;
  });

  return words;
}

/*  Takes in a raw number as the price;
    returns the number formatted in the currency indicated; default argument is USD
 */
function formatPrice(price, locale = "en-US", currency = "USD") {
  if (!price) {
    return null;
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(price);
}

/*  Takes in a raw number and returns the number as a string formatted with commas */
function formatNumber(number) {
  if (!number) {
    return null;
  }

  if (isNaN(number)) {
    return null;
  }

  return number.toLocaleString();
}

/*  Takes in three possible arguments related to location;
    checks for the existence of each and formats the resulting string accordingly
 */
function formatLocation(city, state, zip) {
  // all three arguments are present
  if (city && state && zip) {
    return `${city}, ${state} ${zip}`;
  }

  // one argument is missing
  if (!city && state && zip) {
    return `${state} ${zip}`;
  }

  if (!state && city && zip) {
    return `${city}, ${zip}`;
  }

  if (!zip && city && state) {
    return `${city}, ${state}`;
  }

  // two arguments are missing
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

  // all arguments are missing
  if (!city && !state && (parsedZip < 1 || isNaN(parsedZip))) {
    return "—";
  }
}

/*  Takes in an ISO date and uses the date-fns library to parse it into more a readable string;
    *Essentially a helper function for parsing the dates taken from the MySQL database
 */
function formatDate(dateLiteral) {
  const date = parseISO(dateLiteral);
  // options defines the format of the output
  // e.g. "long" will represent the month by name ("January") instead of a number ("1")
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString(undefined, options);
}

/*  Takes in a string representation of time and parses it into more a readable format;
    Format is: hh:mm:ss
    *Essentially a helper function for parsing the times taken from the MySQL database
 */
function formatTime(timeLiteral) {
  // takes out the first 2 digits in the string, excluding the semicolon, and parses it into a number
  let hours = parseInt(timeLiteral.slice(0, 2));
  if (isNaN(hours)) {
    return null;
  }
  // takes out the 3rd + 4th digits in the string, excluding the semicolons
  const minutes = timeLiteral.slice(2, 5);

  let time = "";

  // checks for 4 possible states: 
  // midnight (exactly 0), morning (1-11), noon (exactly 12), afternoon/evening (13-23)
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

// by exporting as individual functions, allows other files to only import functions that it needs
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