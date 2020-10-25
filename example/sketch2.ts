import { canvasSketch, ISettings } from "rapid-sketch";

const settings: ISettings = {
  dimensions: [800, 800],
  name: "sketch2",
  animation: true,
};

canvasSketch(() => {
  return ({ context, width, height, deltaTime, ...args }) => {
    console.log(args);
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
    context.beginPath();
    context.moveTo(Math.random() * width, Math.random() * height);
    context.lineTo(100, 100);

    context.lineWidth = 2;
    context.stroke();
  };
}, settings);
