"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var get_all_files_1 = __importDefault(require("./get-all-files"));
var fs_1 = __importDefault(require("fs"));
var FeatureHandler = /** @class */ (function () {
    function FeatureHandler(client, dir) {
        if (dir) {
            if (fs_1.default.existsSync(dir)) {
                var files = (0, get_all_files_1.default)(dir);
                var amount = files.length;
                if (amount > 0) {
                    console.log("Loaded " + amount + " listeners" + (amount === 1 ? '' : 's'));
                    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                        var file = files_1[_i];
                        var func = require(file);
                        if (typeof func === 'function') {
                            func(client);
                        }
                    }
                }
            }
            else {
                throw new Error("Listeners directory \"" + dir + "\" doesn't exist !");
            }
        }
    }
    return FeatureHandler;
}());
module.exports = FeatureHandler;
