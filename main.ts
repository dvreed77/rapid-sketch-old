export interface ISketch {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
}

export interface ISettings {
  dimensions?: [number, number];
}

export function canvasSketch(
  sketch: () => (arg0: ISketch) => any,
  settings: ISettings = {}
) {
  const canvas = document.getElementsByTagName("canvas").item(0);

  canvas.width = settings.dimensions[0];
  canvas.height = settings.dimensions[1];

  const context = canvas.getContext("2d");

  const s = sketch();

  s({ context, width: settings.dimensions[0], height: settings.dimensions[1] });
}
