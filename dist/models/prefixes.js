"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var mongoose_1 = __importDefault(require("mongoose"));
var requiredStr = {
    type: String,
    required: true
};
var prefixSchema = new mongoose_1.default.Schema({
    _id: requiredStr,
    prefix: requiredStr
});
module.exports = mongoose_1.default.model('commandingjs-prefixes', prefixSchema);
