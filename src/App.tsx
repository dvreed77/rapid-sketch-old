import React, { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faStepBackward,
  faStepForward,
  faFastBackward,
  faFastForward,
} from "@fortawesome/free-solid-svg-icons";
import "./index.css";
import { createBlobFromDataURL, saveBlob } from "./utils";
import { ISettings } from "./main";
import mime from "mime-types";

function useRefState(
  initialState: any
): [React.MutableRefObject<any>, (state: any) => void] {
  const [state, _setState] = React.useState(initialState);

  const stateRef = React.useRef(state);
  const setState = (state: any) => {
    stateRef.current = state;
    _setState(state);
  };

  return [stateRef, setState];
}

export function App({
  sketch,
  settings,
}: {
  sketch: any;
  settings: ISettings;
}) {
  const [width, height] = settings.dimensions;
  const [isPlaying, setIsPlaying] = useState(false);
  const [frame, setFrame] = useRefState(0);
  const [canvasProps, setCanvasProps] = useState({
    canvas: null,
    context: null,
    width: null,
    height: null,
  });
  document.title = `${settings.name} | RapidSketch`;

  useEffect(() => {
    function handleUserKeyPress(e: KeyboardEvent) {
      if (settings.animation && e.code === "Space") {
        if (frame.current < settings.totalFrames) {
          setIsPlaying((isPlaying) => !isPlaying);
        } else {
          setIsPlaying(false);
        }
      }
    }

    window.addEventListener("keydown", handleUserKeyPress);

    if (canvasProps.context) {
      render();
    }

    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  });

  useEffect(() => {
    function handleUserKeyPress(e: KeyboardEvent) {
      if (e.code === "KeyS" && !e.altKey && e.metaKey) {
        e.preventDefault();
        const dataURL = canvasProps.canvas.toDataURL();
        createBlobFromDataURL(dataURL).then((blob: any) => {
          saveBlob(blob, settings.name);
        });
      } else if (e.code === "KeyP" && !e.altKey && e.metaKey) {
        e.preventDefault();

        const { context, width, height } = canvasProps;

        // TODO: better name than r
        const r = sketch()({ context, width, height });

        r.forEach(({ data, extension }) => {
          const blob = new Blob([data], {
            type: mime.lookup(extension) as string,
          });
          saveBlob(blob, settings.name);
        });
      }
    }

    window.addEventListener("keydown", handleUserKeyPress);

    if (canvasProps.context) {
      render();
    }

    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, [canvasProps]);

  const requestRef = React.useRef(null);

  React.useEffect(() => {
    const animate = () => {
      if (isPlaying) {
        setFrame(
          frame.current < settings.totalFrames
            ? frame.current + 1
            : frame.current
        );
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(requestRef.current);
    }

    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying]);

  React.useEffect(() => {
    if (frame.current < settings.totalFrames) {
      render();
    } else {
      setIsPlaying(false);
    }
  }, [frame]);

  function render() {
    const { context, width, height } = canvasProps;
    if (!context) return;
    sketch()({ context, width, height, frame: frame.current });
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
                {frame.current}/{settings.totalFrames}
              </span>
            </span>

            <FontAwesomeIcon
              className="fill-current text-gray-500 hover:text-gray-600 cursor-pointer mx-1"
              onClick={() => setFrame(0)}
              icon={faFastBackward}
            />
            <FontAwesomeIcon
              className="fill-current text-gray-500 hover:text-gray-600 cursor-pointer mx-1"
              onClick={() =>
                setFrame((frame) => (frame > 0 ? frame - 1 : frame))
              }
              icon={faStepBackward}
            />
            {isPlaying ? (
              <FontAwesomeIcon
                className="fill-current text-gray-500 hover:text-gray-600 cursor-pointer mx-1"
                onClick={() => setIsPlaying(false)}
                icon={faPause}
              />
            ) : (
              <FontAwesomeIcon
                className="fill-current text-gray-500 hover:text-gray-600 cursor-pointer mx-1"
                onClick={() =>
                  setIsPlaying(frame.current < settings.totalFrames)
                }
                icon={faPlay}
              />
            )}
            <FontAwesomeIcon
              className="fill-current text-gray-500 hover:text-gray-600 cursor-pointer mx-1"
              onClick={() =>
                setFrame((frame) =>
                  frame < settings.totalFrames ? frame + 1 : frame
                )
              }
              icon={faStepForward}
            />

            <FontAwesomeIcon
              className="fill-current text-gray-500 hover:text-gray-600 cursor-pointer mx-1"
              onClick={() => setFrame(settings.totalFrames)}
              icon={faFastForward}
            />
          </span>
        </div>
      )}
    </div>
  );
}
