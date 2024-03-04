export function validateJSONStructure(jsonData) {
  if (
    Array.isArray(jsonData) &&
    jsonData.length === 1 &&
    Array.isArray(jsonData[0]) &&
    jsonData[0].length > 0 &&
    jsonData[0].every(
      (obj) =>
        obj.hasOwnProperty("nombre") &&
        obj.hasOwnProperty("apellidos") &&
        obj.hasOwnProperty("direccindecorreo") &&
        obj.hasOwnProperty("grupos")
    )
  ) {
    return true;
  } else {
    return false;
  }
}
