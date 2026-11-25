/**
 * Converts a string to title case (first letter of each word capitalized).
 * @param {string} str - The input string to be converted.
 * @returns {string} The title-cased version of the input string.
 */
export function titleCase(str) {
  if (typeof str !== 'string' || str.trim().length === 0) {
    return '';
  }

  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
