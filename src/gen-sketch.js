#!/usr/bin/env node

// import Bundler from "parcel-bundler";
// import Path from "path";
const Bundler = require("parcel-bundler");
const path = require("path");

const myArgs = process.argv.slice(2);

console.log(myArgs);

// Single entrypoint file location:
// const entryFiles = Path.join(__dirname, "./index.html");
// const entryFiles = [myArgs[0], Path.join(__dirname, "./main.ts")];
const entryFiles = myArgs[0];
// OR: Multiple files with globbing (can also be .js)
// const entryFiles = './src/*.js';
// OR: Multiple files in an array

// Bundler options
const options = {
  outDir: "./dist", // The out directory to put the build files in, defaults to dist
  // outFile: "index.html", // The name of the outputFile
  outFile: "entry.js",
  // outFile: "index.html",
  publicUrl: "/", // The url to serve on, defaults to '/'
  watch: true, // Whether to watch the files and rebuild them on change, defaults to process.env.NODE_ENV !== 'production'
  cache: true, // Enabled or disables caching, defaults to true
  cacheDir: ".cache", // The directory cache gets put in, defaults to .cache
  contentHash: false, // Disable content hash from being included on the filename
  global: "moduleName", // Expose modules as UMD under this name, disabled by default
  minify: false, // Minify files, enabled if process.env.NODE_ENV === 'production'
  scopeHoist: false, // Turn on experimental scope hoisting/tree shaking flag, for smaller production bundles
  target: "browser", // Browser/node/electron, defaults to browser
  bundleNodeModules: true, // By default, package.json dependencies are not included when using 'node' or 'electron' with 'target' option above. Set to true to adds them to the bundle, false by default
  https: false,
  // https: {
  //   // Define a custom {key, cert} pair, use true to generate one or false to use http
  //   cert: "./ssl/c.crt", // Path to custom certificate
  //   key: "./ssl/k.key", // Path to custom key
  // },
  logLevel: 3, // 5 = save everything to a file, 4 = like 3, but with timestamps and additionally log http requests to dev server, 3 = log info, warnings & errors, 2 = log warnings & errors, 1 = log errors, 0 = log nothing
  hmr: true, // Enable or disable HMR while watching
  hmrPort: 0, // The port the HMR socket runs on, defaults to a random free port (0 in node.js resolves to a random free port)
  sourceMaps: true, // Enable or disable sourcemaps, defaults to enabled (minified builds currently always create sourcemaps)
  hmrHostname: "", // A hostname for hot module reload, default to ''
  detailedReport: false, // Prints a detailed report of the bundles, assets, filesizes and times, defaults to false, reports are only printed if watch is disabled
  autoInstall: true, // Enable or disable auto install of missing dependencies found during bundling
};

// (async function () {
//   // Initializes a bundler using the entrypoint location and options provided
//   const bundler = new Bundler(entryFiles, options);
//   bundler.serve();
//   // Run the bundler, this returns the main bundle
//   // Use the events if you're using watch mode as this promise will only trigger once and not for every rebuild
//   // const bundle = await bundler.bundle();
// })();

// const Bundler = require('parcel-bundler');
const express = require("express");
const app = express();
app.use(express.static("dist"));
// const file = 'index.html'; // Pass an absolute path to the entrypoint here
// const options = {}; // See options section of api docs, for the possibilities

// Initialize a new bundler using a file and options
// const bundler = new Bundler(file, options);

// Let express use the bundler middleware, this will let Parcel handle every request over your express server
// app.use(bundler.middleware());

// Listen on port 8080

const port = 3000;

const bundler = new Bundler(entryFiles, options);

// Let express use the bundler middleware, this will let Parcel handle every request over your express server
app.use(bundler.middleware());

// app.get("/", (req, res) => res.send("Hello World!"));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

// app.listen(8080);
