import external from '../../externalModules.js';
import { draw, fillBox } from '../../drawing/index.js';

/**
 * Fills in the brush mask data with new data.
 * @export @public @method
 * @name drawBrushPixels
 *
 * @param  {Object[]} pointerArray        The array of points to draw.
 * @param  {number[]} labelMap2D          The labelmap to modify.
 * @param  {number}   columns               The number of columns in the mask.
 * @param  {boolean} [shouldErase = false] If true the modified mask pixels will be set to 0, rather than 1.
 * @returns {void}
 */
function drawBrushPixels(
  pointerArray,
  labelmap3D,
  imageIdIndex,
  segmentIndex,
  columns,
  shouldErase = false
) {
  const getPixelIndex = (x, y) => y * columns + x;

  const pixelData = labelmap3D.labelmaps2D[imageIdIndex].pixelData;

  pointerArray.forEach(point => {
    const spIndex = getPixelIndex(point[0], point[1]);

    if (shouldErase) {
      if (pixelData[spIndex] === segmentIndex) {
        pixelData[spIndex] = 0;
      }
    } else {
      pixelData[spIndex] = segmentIndex;
    }
  });

  labelmap3D.labelmaps2D[imageIdIndex].invalidated = true;

  // If Erased the last pixel, delete the pixelData array.
  if (shouldErase && !pixelData.some(element => element !== 0)) {
    delete labelmap3D.labelmaps2D[imageIdIndex];
  }
}

/**
 * Draws the brush data to the canvas.
 * @export @public @method
 *
 * @param  {Object[]} pointerArray Array of points to draw.
 * @param  {Object} context      The canvas context.
 * @param  {string} color        The color to draw the pixels.
 * @param  {HTMLElement} element      The element on which the canvas resides.
 * @returns {void}
 */
function drawBrushOnCanvas(pointerArray, context, color, element) {
  const canvasPtTL = external.cornerstone.pixelToCanvas(element, {
    x: 0,
    y: 0,
  });
  const canvasPtBR = external.cornerstone.pixelToCanvas(element, {
    x: 1,
    y: 1,
  });
  const sizeX = canvasPtBR.x - canvasPtTL.x;
  const sizeY = canvasPtBR.y - canvasPtTL.y;

  draw(context, context => {
    pointerArray.forEach(point => {
      const canvasPt = external.cornerstone.pixelToCanvas(element, {
        x: point[0],
        y: point[1],
      });
      const boundingBox = {
        left: canvasPt.x,
        top: canvasPt.y,
        width: sizeX,
        height: sizeY,
      };

      fillBox(context, boundingBox, color);
    });
  });
}

export { drawBrushPixels, drawBrushOnCanvas };
