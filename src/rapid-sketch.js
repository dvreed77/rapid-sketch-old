#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var openBrowser = require("open");
var getPort = require("get-port");
var express = require("express");
var Bundler = require("parcel-bundler");
var path = require("path");
var multer = require("multer");
var mime = require("mime-types");
var dateformat = require("dateformat");
function getTimeStamp() {
    var dateFormatStr = "yyyy.mm.dd-HH.MM.ss";
    return dateformat(new Date(), dateFormatStr);
}
console.log("dave asdsa");
var multipartUpload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, "./uploads");
        },
        filename: function (req, file, callback) {
            var ext = mime.extension(file.mimetype);
            callback(null, file.originalname + "-" + getTimeStamp() + "." + ext);
        }
    })
}).single("file");
// mostly copied from here https://parceljs.org/api.html
var myArgs = process.argv.slice(2);
// Bundler options
var options = {
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
    autoInstall: true
};
(function () {
    return __awaiter(this, void 0, void 0, function () {
        var app, port, bundler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = express();
                    app.use(express.static("dist"));
                    app.use("/favicon.ico", express.static(path.join(__dirname + "/images/favicon.ico")));
                    // also include assets at ./static relative to project directory
                    app.use("/static", express.static("./static"));
                    return [4 /*yield*/, getPort()];
                case 1:
                    port = _a.sent();
                    bundler = new Bundler(myArgs[0], options);
                    app.use(bundler.middleware());
                    app.get("/", function (req, res) {
                        res.sendFile(path.join(__dirname + "/index.html"));
                    });
                    app.post("/canvas-sketch-cli/saveBlob", multipartUpload, function (req, res) {
                        res.json({ msg: "DONE!" });
                    });
                    app.listen(port, function () {
                        console.log("Example app listening at http://localhost:" + port);
                    });
                    openBrowser("http://localhost:" + port);
                    return [2 /*return*/];
            }
        });
    });
})();
