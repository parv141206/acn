const form = document.querySelector("#packet-header-input-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const header = formData.get("header");
  console.log(header);
  const splittedHeader = splitString(header);

  const headerFields = {
    version: splittedHeader[0],
    hlen: splittedHeader[1],
    service: splittedHeader[2],
    totalLength: splittedHeader[3],
    id: splittedHeader[4],
    fragDetails: splittedHeader[5],
    timeToLive: splittedHeader[6],
    protocol: splittedHeader[7],
    checksum: splittedHeader[8],
  };

  // Log each field using a loop
  for (const [key, value] of Object.entries(headerFields)) {
    console.log(
      `${
        key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")
      }: ${value}`
    );
  }

  // Create output string
  const outputString = Object.entries(headerFields)
    .map(
      ([key, value]) =>
        `${
          key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " ")
        }: ${value} | ${hexToDecimal(value)}`
    )
    .join("\n");

  console.log(outputString);
});

function splitString(s) {
  const lengths = [1, 1, 2, 4, 4, 4, 2, 2, 4];
  const result = [];
  let index = 0;

  while (index < s.length) {
    for (const length of lengths) {
      if (index < s.length) {
        result.push(s.slice(index, index + length));
        index += length;
      } else {
        break;
      }
    }
  }

  return result;
}
/**
 * Converts a hexadecimal string to a decimal number.
 * @param {string} hex - The hexadecimal string to convert.
 * @returns {number} - The decimal representation of the hexadecimal string.
 */
function hexToDecimal(hex) {
  // Remove any leading '0x' or '0X' and convert to lowercase
  hex = hex.replace(/^0x/i, "").toLowerCase();

  // Parse the hexadecimal string to a decimal number
  const decimal = parseInt(hex, 16);

  // Check if the conversion was successful
  if (isNaN(decimal)) {
    throw new Error("Invalid hexadecimal string");
  }

  return decimal;
}
