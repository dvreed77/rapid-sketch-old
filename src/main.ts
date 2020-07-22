import { convertDistance, units } from "./utils/convertDistance";
var mime = require("mime-types");

export * from "./utils/convertDistance";
export * from "./utils/defined";

export interface ISketch {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  units: units;
}

export interface ISettings {
  dimensions?: [number, number];
  units?: units;
  pixelsPerInch?: number;
  name: string;
}

function createBlobFromDataURL(dataURL) {
  return new Promise((resolve) => {
    const splitIndex = dataURL.indexOf(",");
    if (splitIndex === -1) {
      resolve(new window.Blob());
      return;
    }
    const base64 = dataURL.slice(splitIndex + 1);
    const byteString = window.atob(base64);
    const type = dataURL.slice(0, splitIndex);
    const mimeMatch = /data:([^;]+)/.exec(type);
    const mime = (mimeMatch ? mimeMatch[1] : "") || undefined;
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    resolve(new window.Blob([ab], { type: mime }));
  });
}

function saveBlob(blob: Blob, name: string) {
  const form = new window.FormData();
  // form.append("dave", "cool");
  form.append("file", blob, name);
  return window
    .fetch("/canvas-sketch-cli/saveBlob", {
      method: "POST",
      cache: "no-cache",
      credentials: "same-origin",
      body: form,
    })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return res.text().then((text) => {
          throw new Error(text);
        });
      }
    })
    .catch((err) => {
      // Some issue, just bail out and return nil hash
      // console.warn(`There was a problem exporting ${opts.filename}`);
      console.error(err);
      return undefined;
    });
}
// export function saveDataURL (dataURL, opts = {}) {
//   return createBlobFromDataURL(dataURL)
//     .then(blob => saveBlob(blob, opts));
// }

export function canvasSketch(
  sketch: () => (arg0: ISketch) => any,
  { dimensions, units = "px", pixelsPerInch = 72, name = "UNK" }: ISettings
) {
  const [width, height] = dimensions;

  document.title = `${name} | RapidSketch`;

  const realWidth = convertDistance(width, units, "px", {
    pixelsPerInch,
    precision: 4,
  });

  const realHeight = convertDistance(height, units, "px", {
    pixelsPerInch,
    precision: 4,
  });

  // Calculate Canvas Style Size
  const [parentWidth, parentHeight] = [window.innerWidth, window.innerHeight];
  let styleWidth = Math.round(realWidth);
  let styleHeight = Math.round(realHeight);
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

  // Calculate Canvas Width
  let canvasWidth = Math.round(2 * realWidth);
  let canvasHeight = Math.round(2 * realHeight);

  // Calculate Scale
  const scaleX = canvasWidth / width;
  const scaleY = canvasHeight / height;

  // Get Canvas Element and adjust all sizing
  const canvas = document.getElementsByTagName("canvas").item(0);
  const context = canvas.getContext("2d");

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  canvas.style.width = `${styleWidth}px`;
  canvas.style.height = `${styleHeight}px`;

  context.scale(scaleX, scaleY);

  const returnedData = sketch()({ context, width, height, units });

  const handler = (ev) => {
    ev.preventDefault();
    // if (!opt.enabled()) return;

    if (ev.keyCode === 83 && !ev.altKey && (ev.metaKey || ev.ctrlKey)) {
      // Cmd + S
      console.log("SAVE");

      // Save Canvas
      const dataURL = canvas.toDataURL();

      createBlobFromDataURL(dataURL).then((blob: any) => {
        saveBlob(blob, name);
      });

      returnedData.forEach(({ data, ext }) => {
        const blob = new Blob([data], { type: mime.lookup(ext) });
        saveBlob(blob, name);
      });
    }
  };

  window.addEventListener("keydown", handler);
  window.addEventListener("resize", () => console.log("resize"));
}

function save(text) {
  const blob = new Blob([text], { type: "image/svg+xml" });

  const link = document.createElement("a");
  link.style.visibility = "hidden";
  link.target = "_blank";
  link.download = "filename";
  link.href = window.URL.createObjectURL(blob);
  document.body.appendChild(link);
  link.onclick = () => {
    link.onclick = () => {};
    setTimeout(() => {
      // window.URL.revokeObjectURL(blob);
      if (link.parentElement) link.parentElement.removeChild(link);
      link.removeAttribute("href");
      // resolve({ filename, client: false });
    });
  };
  link.click();
}
