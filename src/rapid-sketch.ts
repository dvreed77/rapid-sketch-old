#!/usr/bin/env node

import openBrowser from "open";
import getPort from "get-port";
import express from "express";
import Bundler from "parcel-bundler";
import path from "path";
import multer from "multer";
import mime from "mime-types";
import dateformat from "dateformat";
import { program } from "commander";
import * as fs from "fs";
import ParcelBundler from "parcel-bundler";

const SAVE_DIR = "output";

program.version("0.0.1");

program
  .arguments("<sketchFile>")
  .option("-p, --port <port>", "server port")
  .option("-o, --open", "open browser");

program.parse(process.argv);
const sketchFilePath = program.args[0];

function getTimeStamp() {
  const dateFormatStr = `yyyy.mm.dd-HH.MM.ss`;
  return dateformat(new Date(), dateFormatStr);
}

if (!fs.existsSync(SAVE_DIR)) {
  fs.mkdirSync(SAVE_DIR);
}

var multipartUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, SAVE_DIR);
    },
    filename: function (req, file, callback) {
      const ext = mime.extension(file.mimetype);
      callback(null, `${file.originalname}-${getTimeStamp()}.${ext}`);
    },
  }),
}).single("file");

// mostly copied from here https://parceljs.org/api.html
// Bundler options
const options = {
  outDir: "./dist",
  outFile: "entry.js",
  publicUrl: "/",
  watch: true,
  cache: true,
  cacheDir: ".cache",
  contentHash: false,
  global: "moduleName",
  minify: false,
  scopeHoist: false,
  target: "browser",
  bundleNodeModules: true,
  https: false,
  logLevel: 3,
  hmr: true,
  hmrPort: 0,
  sourceMaps: true,
  hmrHostname: "",
  detailedReport: false,
  autoInstall: true,
} as ParcelBundler.ParcelOptions;

(async function () {
  const app = express();
  app.use(express.static("dist"));

  app.use(
    "/favicon.ico",
    express.static(path.join(__dirname + "/images/favicon.ico"))
  );

  // also include assets at ./static relative to project directory
  app.use("/static", express.static("./static"));

  const port = program.port || (await getPort());

  const bundler = new Bundler(sketchFilePath, options);

  app.use(bundler.middleware());

  app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/index.html"));
  });

  app.post("/canvas-sketch-cli/saveBlob", multipartUpload, (req, res) => {
    res.json({ msg: "DONE!" });
  });

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });

  if (program.open) openBrowser(`http://localhost:${port}`);
})();
