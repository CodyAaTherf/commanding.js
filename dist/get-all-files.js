"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var fs_1 = __importDefault(require("fs"));
var getAllFiles = function (dir) {
    var files = fs_1.default.readdirSync(dir, { withFileTypes: true });
    var jsFiles = [];
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        if (file.isDirectory()) {
            jsFiles = __spreadArray(__spreadArray([], jsFiles, true), getAllFiles(dir + "/" + file.name), true);
        }
        else {
            jsFiles.push(dir + "/" + file.name);
        }
    }
    return jsFiles;
};
module.exports = getAllFiles;
