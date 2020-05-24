import { canvasSketch, ISettings } from "./main";

const settings: ISettings = {
  dimensions: [11, 8.5],
  units: "in",
  pixelsPerInch: 300,
};

canvasSketch(() => {
  return ({ context, width, height }) => {
    context.beginPath();
    context.moveTo(2, 2);
    context.lineTo(7, 5);
    context.lineWidth = 0.03;

    // context.lineTo(1000, 1000);
    context.stroke();
  };
}, settings);
