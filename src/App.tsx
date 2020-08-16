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
import { createBlobFromDataURL, saveBlob } from "./utils";
import { ISettings } from "./main";

export function App({
  sketch,
  settings,
}: {
  sketch: any;
  settings: ISettings;
}) {
  const [width, height] = settings.dimensions;
  const [isPlaying, setIsPlaying] = useState(false);
  const [frame, setFrame] = useState(0);
  const [canvasProps, setCanvasProps] = useState({
    canvas: null,
    context: null,
    width: null,
    height: null,
  });
  document.title = `${settings.name} | RapidSketch`;

  function handleUserKeyPress(e: KeyboardEvent) {
    if (settings.animation && e.code === "Space") {
      setIsPlaying((isPlaying) => !isPlaying);
    } else if (e.code === "KeyS" && !e.altKey && e.metaKey) {
      e.preventDefault();
      const dataURL = canvasProps.canvas.toDataURL();
      createBlobFromDataURL(dataURL).then((blob: any) => {
        saveBlob(blob, settings.name);
      });
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);

    if (canvasProps.context) {
      render();
    }

    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
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

  return (
    <div>
      <Canvas width={width} height={height} setCanvasProps={setCanvasProps} />

      {settings.animation && (
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
      )}
    </div>
  );
}
