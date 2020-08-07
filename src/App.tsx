import React, { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faStepBackward,
  faStepForward,
} from "@fortawesome/free-solid-svg-icons";
import "./index.css";

export function App({ sketch, settings }: { sketch: any; settings: any }) {
  const [width, height] = settings.dimensions;
  const [isPlaying, setIsPlaying] = useState(false);
  const [frame, setFrame] = useState(0);
  const [canvasProps, setCanvasProps] = useState({
    context: null,
    width: null,
    height: null,
  });
  document.title = `${settings.name} | RapidSketch`;

  function handleUserKeyPress(e) {
    if (e.code === "Space") {
      setIsPlaying((isPlaying) => !isPlaying);
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);

    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, []);

  useEffect(() => {
    if (canvasProps.context) {
      const { context, width, height } = canvasProps;
      render();
    }
  }, [canvasProps]);

  const requestRef = React.useRef(null);

  const animate = () => {
    if (isPlaying) {
      render();
      setFrame((frame) => frame + 1);
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying]);

  function render() {
    const { context, width, height } = canvasProps;
    sketch()({ context, width, height });
  }

  const d = 3;
  return (
    <div>
      <Canvas width={width} height={height} setCanvasProps={setCanvasProps} />

      <div className="mx-auto text-center mt-5">
        <span className="border rounded px-2 py-2 select-none">
          <span className="font-mono">
            Frame{" "}
            <span
              style={{ minWidth: "5rem" }}
              className="inline-block text-right"
            >
              {frame}/100
            </span>
          </span>

          <FontAwesomeIcon
            className="fill-current text-gray-500 hover:text-gray-600 cursor-pointer mx-1"
            icon={faStepBackward}
          />
          {isPlaying ? (
            <FontAwesomeIcon
              className="fill-current text-gray-500 hover:text-gray-600 cursor-pointer mx-1"
              onClick={() => setIsPlaying((isPlaying) => !isPlaying)}
              icon={faPlay}
            />
          ) : (
            <FontAwesomeIcon
              className="fill-current text-gray-500 hover:text-gray-600 cursor-pointer mx-1"
              onClick={() => setIsPlaying((isPlaying) => !isPlaying)}
              icon={faPause}
            />
          )}
          <FontAwesomeIcon
            className="fill-current text-gray-500 hover:text-gray-600 cursor-pointer mx-1"
            icon={faStepForward}
          />
        </span>
      </div>
    </div>
  );
}
