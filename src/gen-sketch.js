#!/usr/bin/env node

const open = require("open");
const getPort = require("get-port");
const express = require("express");
const Bundler = require("parcel-bundler");
const path = require("path");

// mostly copied from here https://parceljs.org/api.html

const myArgs = process.argv.slice(2);

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
};

(async function () {
  const app = express();
  app.use(express.static("dist"));

  const port = await getPort();

  const bundler = new Bundler(myArgs[0], options);

  app.use(bundler.middleware());

  app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/index.html"));
  });

  app.listen(port, () =>
    console.log(`Example app listening at http://localhost:${port}`)
  );

  open(`http://localhost:${port}`);
})();
