#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var open_1 = __importDefault(require("open"));
var get_port_1 = __importDefault(require("get-port"));
var express_1 = __importDefault(require("express"));
var parcel_bundler_1 = __importDefault(require("parcel-bundler"));
var path_1 = __importDefault(require("path"));
var multer_1 = __importDefault(require("multer"));
var mime_types_1 = __importDefault(require("mime-types"));
var dateformat_1 = __importDefault(require("dateformat"));
var commander_1 = require("commander");
var fs = __importStar(require("fs"));
var SAVE_DIR = "output";
commander_1.program.version("0.0.1");
commander_1.program
    .arguments("<sketchFile>")
    .option("-p, --port <port>", "server port")
    .option("-o, --open", "open browser");
commander_1.program.parse(process.argv);
var sketchFilePath = commander_1.program.args[0];
function getTimeStamp() {
    var dateFormatStr = "yyyy.mm.dd-HH.MM.ss";
    return dateformat_1["default"](new Date(), dateFormatStr);
}
if (!fs.existsSync(SAVE_DIR)) {
    fs.mkdirSync(SAVE_DIR);
}
var multipartUpload = multer_1["default"]({
    storage: multer_1["default"].diskStorage({
        destination: function (req, file, callback) {
            callback(null, SAVE_DIR);
        },
        filename: function (req, file, callback) {
            var ext = mime_types_1["default"].extension(file.mimetype);
            callback(null, file.originalname + "-" + getTimeStamp() + "." + ext);
        }
    })
}).single("file");
// mostly copied from here https://parceljs.org/api.html
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
        var app, port, _a, bundler;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    app = express_1["default"]();
                    app.use(express_1["default"].static("dist"));
                    app.use("/favicon.ico", express_1["default"].static(path_1["default"].join(__dirname + "/images/favicon.ico")));
                    // also include assets at ./static relative to project directory
                    app.use("/static", express_1["default"].static("./static"));
                    _a = commander_1.program.port;
                    if (_a) return [3 /*break*/, 2];
                    return [4 /*yield*/, get_port_1["default"]()];
                case 1:
                    _a = (_b.sent());
                    _b.label = 2;
                case 2:
                    port = _a;
                    bundler = new parcel_bundler_1["default"](sketchFilePath, options);
                    app.use(bundler.middleware());
                    app.get("/", function (req, res) {
                        res.sendFile(path_1["default"].join(__dirname + "/index.html"));
                    });
                    app.post("/canvas-sketch-cli/saveBlob", multipartUpload, function (req, res) {
                        res.json({ msg: "DONE!" });
                    });
                    app.listen(port, function () {
                        console.log("Example app listening at http://localhost:" + port);
                    });
                    if (commander_1.program.open)
                        open_1["default"]("http://localhost:" + port);
                    return [2 /*return*/];
            }
        });
    });
})();
