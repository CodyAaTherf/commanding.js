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
                        var fileName = file
                            .replace(/\\/g, '/')
                            .split('/');
                        fileName = fileName[fileName.length - 1];
                        fileName = fileName.split('.')[0].toLowerCase();
                        var configuration = require(file);
                        // const { aliases , callback } = configuration
                        var name_1 = configuration.name, commands = configuration.commands, aliases = configuration.aliases, callback = configuration.callback, execute = configuration.execute, description = configuration.description;
                        if (callback && execute) {
                            throw new Error('Commands can have either "callback" or "execute".');
                        }
                        var names = commands || aliases;
                        if (!name_1 && (!names || names.length === 0)) {
                            throw new Error("Command \"" + file + "\" does not have \"name\" specified.");
                        }
                        if (typeof names === 'string') {
                            names = [names];
                        }
                        if (names && !names.includes(name_1.toLowerCase())) {
                            names.unshift(name_1.toLowerCase());
                        }
                        // if(aliases && aliases.length && callback){
                        //     const command = new Command(instance , client , configuration)
                        //     for(const alias of aliases){
                        //         this._commands.set(alias.toLowerCase() , command)
                        //     }
                        // }
                        if (!names.includes(fileName)) {
                            names.unshift(fileName);
                        }
                        if (!description) {
                            console.warn("Command \"" + names[0] + "\" does not have \"description\" property.");
                        }
                        var hasCallback = callback || execute;
                        if (hasCallback) {
                            var command = new Command_1.default(instance, client, names, callback || execute, configuration);
                            for (var _a = 0, names_1 = names; _a < names_1.length; _a++) {
                                var name_2 = names_1[_a];
                                this._commands.set(name_2.toLowerCase(), command);
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
    Object.defineProperty(CommandHandler.prototype, "commands", {
        get: function () {
            var results = new Map();
            this._commands.forEach(function (_a) {
                var names = _a.names, _b = _a.description, description = _b === void 0 ? '' : _b;
                results.set(names[0], {
                    names: names,
                    description: description
                });
            });
            return Array.from(results.values());
        },
        enumerable: false,
        configurable: true
    });
    return CommandHandler;
}());
module.exports = CommandHandler;
