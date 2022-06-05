"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var mongoose_1 = __importDefault(require("mongoose"));
var requiredStr = {
    type: String,
    required: true
};
var disabledCommands = new mongoose_1.default.Schema({
    guildId: requiredStr,
    command: requiredStr
});
module.exports = mongoose_1.default.model('commandingjs-disabled-commands', disabledCommands);
