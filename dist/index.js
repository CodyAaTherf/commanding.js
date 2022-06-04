"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var CommandHandler_1 = __importDefault(require("./CommandHandler"));
var ListenerHandler_1 = __importDefault(require("./ListenerHandler"));
var mongo_1 = __importDefault(require("./mongo"));
var commandingjs = /** @class */ (function () {
    function commandingjs(client, commandsDir, listenerDir) {
        var _this = this;
        this._defaultPrefix = '>';
        this._commandsDir = 'commands';
        this._listenersDir = '';
        this._mongo = '';
        this._syntaxError = 'Wrong Syntax!';
        this._prefixes = {};
        if (!client) {
            throw new Error("Discord.jS Client isn't defined.");
        }
        if (!commandsDir) {
            console.warn("Commands folder isn't defined. Using 'commands'");
        }
        if (module && module.parent) {
            var path = module.parent.path;
            if (path) {
                commandsDir = path + "/" + (commandsDir || this._commandsDir);
                if (listenerDir) {
                    listenerDir = path + "/" + listenerDir;
                }
            }
        }
        this._commandsDir = commandsDir || this._commandsDir;
        this._listenersDir = listenerDir || this._listenersDir;
        // new CommandHandler(this , client , this._commandsDir)
        this._commandHandler = new CommandHandler_1.default(this, client, this._commandsDir);
        if (this._listenersDir) {
            new ListenerHandler_1.default(client, this._listenersDir);
        }
        setTimeout(function () {
            if (_this._mongo) {
                (0, mongo_1.default)(_this._mongo);
            }
            else {
                console.warn("MongoDB connection URI isn't provided , some features might not work!");
            }
        }, 500);
    }
    Object.defineProperty(commandingjs.prototype, "mongoPath", {
        get: function () {
            return this._mongo;
        },
        enumerable: false,
        configurable: true
    });
    commandingjs.prototype.setMongoPath = function (mongoPath) {
        this._mongo = mongoPath;
        return this;
    };
    Object.defineProperty(commandingjs.prototype, "syntaxError", {
        get: function () {
            return this._syntaxError;
        },
        enumerable: false,
        configurable: true
    });
    commandingjs.prototype.setSyntaxError = function (syntaxError) {
        this._syntaxError = syntaxError;
        return this;
    };
    Object.defineProperty(commandingjs.prototype, "prefixes", {
        get: function () {
            return this._prefixes;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(commandingjs.prototype, "defaultPrefix", {
        get: function () {
            return this._defaultPrefix;
        },
        enumerable: false,
        configurable: true
    });
    commandingjs.prototype.setDefaultPrefix = function (defaultPrefix) {
        this._defaultPrefix = defaultPrefix;
        return this;
    };
    commandingjs.prototype.getPrefix = function (guild) {
        return this._prefixes[guild ? guild.id : ''] || this._defaultPrefix;
    };
    Object.defineProperty(commandingjs.prototype, "commands", {
        get: function () {
            return this._commandHandler.commands;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(commandingjs.prototype, "commandAmount", {
        get: function () {
            return this.commands.length;
        },
        enumerable: false,
        configurable: true
    });
    return commandingjs;
}());
module.exports = commandingjs;
