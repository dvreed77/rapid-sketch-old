import { canvasSketch, ISettings } from "rapid-sketch";

const settings: ISettings = {
  dimensions: [800, 800],
  name: "sketch2",
  animation: true,
  totalFrames: 200,
};

canvasSketch(() => {
  return ({ context, width, height, deltaTime, frame, ...args }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
    context.beginPath();

    const x = (frame / 200) * width;
    const y = height / 2;

    context.moveTo(x + 10, y);
    context.arc(x, y, 10, 0, 2 * Math.PI);

    context.lineWidth = 2;
    context.stroke();
  };
}, settings);
