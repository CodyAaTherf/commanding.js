"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var Command_1 = __importDefault(require("./Command"));
var get_all_files_1 = __importDefault(require("./get-all-files"));
var fs_1 = __importDefault(require("fs"));
var CommandHandler = /** @class */ (function () {
    function CommandHandler(instance, client, dir) {
        var _this = this;
        this._commands = new Map();
        if (dir) {
            if (fs_1.default.existsSync(dir)) {
                // const files = fs
                //     .readdirSync(dir)
                //     .filter((file: string) => file.endsWith('.js'))
                var files = (0, get_all_files_1.default)(dir);
                var amount = files.length;
                if (amount > 0) {
                    console.log("Loaded " + amount + " command" + (amount === 1 ? '' : 's'));
                    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                        var file = files_1[_i];
                        var configuration = require(file);
                        var aliases = configuration.aliases, callback = configuration.callback;
                        if (aliases && aliases.length && callback) {
                            var command = new Command_1.default(instance, client, configuration);
                            for (var _a = 0, aliases_1 = aliases; _a < aliases_1.length; _a++) {
                                var alias = aliases_1[_a];
                                this._commands.set(alias.toLowerCase(), command);
                            }
                        }
                    }
                    client.on('message', function (message) {
                        var guild = message.guild;
                        var content = message.content;
                        var prefix = instance.getPrefix(guild);
                        if (content.startsWith(prefix)) {
                            content = content.substring(prefix.length);
                            var words = content.split(/ /g);
                            var firstElement = words.shift();
                            if (firstElement) {
                                var alias = firstElement.toLowerCase();
                                var command = _this._commands.get(alias);
                                if (command) {
                                    command.execute(message, words);
                                }
                            }
                        }
                    });
                }
            }
            else {
                throw new Error("Commands directory \"" + dir + " doesn't exist !");
            }
        }
    }
    return CommandHandler;
}());
module.exports = CommandHandler;
