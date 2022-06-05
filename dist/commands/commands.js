"use strict";
module.exports = {
    name: 'commands',
    aliases: ['cmds'],
    minArgs: 0,
    maxArgs: 0,
    description: 'Displays all the commands of the bot.',
    callback: function (message, args, text, prefix, client, instance) {
        var msg = 'Commands\n';
        for (var _i = 0, _a = instance.commands; _i < _a.length; _i++) {
            var command = _a[_i];
            var names = command.names, description = command.description;
            msg += "\n                **" + names.shift() + "**\n                ALiases: " + (names.length ? "\"" + names.join('" , "') + "\"" : 'None') + "\n                Description: " + (description || 'None') + "\n            ";
        }
        message.channel.send(msg);
    }
};
