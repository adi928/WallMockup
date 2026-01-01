/**
 * Calculate pixels per inch based on wall image width and real wall width
 * @param {number} imageWidth - Width of the wall image in pixels
 * @param {number} realWidthInches - Actual width of the wall in inches
 * @returns {number} Pixels per inch ratio
 */
export function calculatePixelsPerInch(imageWidth, realWidthInches) {
  if (!realWidthInches || realWidthInches <= 0) return 0;
  return imageWidth / realWidthInches;
}

/**
 * Convert real-world inches to display pixels
 * @param {number} inches - Size in inches
 * @param {number} pixelsPerInch - Conversion ratio
 * @returns {number} Size in pixels
 */
export function inchesToPixels(inches, pixelsPerInch) {
  return inches * pixelsPerInch;
}

/**
 * Get scaled dimensions for a painting
 * @param {number} widthInches - Painting width in inches
 * @param {number} heightInches - Painting height in inches
 * @param {number} pixelsPerInch - Conversion ratio
 * @returns {{width: number, height: number}} Dimensions in pixels
 */
export function getScaledDimensions(widthInches, heightInches, pixelsPerInch) {
  return {
    width: inchesToPixels(widthInches, pixelsPerInch),
    height: inchesToPixels(heightInches, pixelsPerInch)
  };
}
