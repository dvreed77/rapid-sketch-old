import React, { useEffect, useState } from "react";
import { Canvas } from "./Canvas";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

export function App({ sketch, settings }: { sketch: any; settings: any }) {
  const [width, height] = settings.dimensions;
  const [isPlaying, setIsPlaying] = useState(false);
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

  return (
    <div>
      <Canvas width={width} height={height} sketch={sketch} />
      {isPlaying ? (
        <FontAwesomeIcon icon={faPlay} />
      ) : (
        <FontAwesomeIcon icon={faPause} />
      )}
    </div>
  );
}
