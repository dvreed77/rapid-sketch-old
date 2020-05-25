import { convertDistance, units } from "./utils2/convertDistance";

export interface ISketch {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
}

export interface ISettings {
  dimensions?: [number, number];
  units?: units;
  pixelsPerInch?: number;
}

export function canvasSketch(
  sketch: () => (arg0: ISketch) => any,
  { dimensions, units = "px", pixelsPerInch = 72 }: ISettings
) {
  const canvas = document.getElementsByTagName("canvas").item(0);

  const [width, height] = dimensions;

  const devicePixelRatio = window.devicePixelRatio;

  const basePixelRatio = 1;

  const pixelRatio = basePixelRatio;

  const realWidth = convertDistance(width, units, "px", {
    pixelsPerInch,
    precision: 4,
  });

  const realHeight = convertDistance(height, units, "px", {
    pixelsPerInch,
    precision: 4,
  });

  const [parentWidth, parentHeight] = [window.innerWidth, window.innerHeight];

  console.log(realWidth, realHeight);

  let styleWidth, styleHeight;
  let canvasWidth, canvasHeight;

  styleWidth = Math.round(realWidth);
  styleHeight = Math.round(realHeight);

  const aspect = width / height;
  const windowAspect = parentWidth / parentHeight;
  const scaleToFitPadding = 40;
  const maxWidth = Math.round(parentWidth - scaleToFitPadding * 2);
  const maxHeight = Math.round(parentHeight - scaleToFitPadding * 2);
  if (styleWidth > maxWidth || styleHeight > maxHeight) {
    if (windowAspect > aspect) {
      styleHeight = maxHeight;
      styleWidth = Math.round(styleHeight * aspect);
    } else {
      styleWidth = maxWidth;
      styleHeight = Math.round(styleWidth / aspect);
    }
  }

  canvasWidth = Math.round(2 * realWidth);
  canvasHeight = Math.round(2 * realHeight);

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  console.log("W,H", width, height);
  console.log("CW, CH", canvasWidth, canvasHeight);
  console.log("SW, SH", styleWidth, styleHeight);

  canvas.style.width = `${styleWidth}px`;
  canvas.style.height = `${styleHeight}px`;

  window.addEventListener("resize", () => console.log("resize"));

  const { width: w2, height: h2 } = canvas.getBoundingClientRect();

  console.log(w2, h2, window.innerWidth, window.innerHeight);

  const context = canvas.getContext("2d");

  const scaleX = canvasWidth / width;
  const scaleY = canvasHeight / height;

  context.scale(scaleX, scaleY);

  const s = sketch();

  s({ context, width, height });
}
