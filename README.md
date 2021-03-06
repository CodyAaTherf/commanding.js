# TABLE OF CONTENTS

- [Installation](#installation)
- [Setup](#setup)
- [Changing Default Prefix](#prefixes)
- [Creating a Command](#creating-a-command)
- [Usage of minArgs and maxArgs](#minargs--maxargs)
- [Syntax Errors](#syntax-error)
    - [Global Syntax Errors](#global-syntax-error)
    - [Per Command Syntax Error](#per-command-syntax-error)
- [Permissions](#permissions)
- [MongoDB Connection](#mongodb-connection)
- [Built in Commands](#built-in-commands)
- [Sources](#sources)

# Installation

**NPM**
```bash
npm i commanding.js
```

You can install the latest work in progress by -

```bash
npm i "https://github.com/CodyAaTherf/commanding.js#dev"
```

Note that these features are still in work in progress and some might not have been completed yet and your bot might break. You can check on to [here](https://github.com/CodyAaTherf/commandingjs-tests) to know more!

# Setup

How to setup commanding.js -

```js
const { Client , Intents } = require('discord.js')
const CommandingJS = require('commanding.js')
const { token } = require('./config.json')

const client = new Client({ intents: [Intents.FLAGS.GUILDS , Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready' , () => {
    console.log("Ready!");

    new CommandingJS(client , 'commands')
})

client.login(token)
```

# Prefixes

The default prefix of the bot on installing this package will be - `>` .
You can change it in your main file using -

```js
new CommandingJS(client)
    .setDefaultPrefix('!')
```

# Creating a Command

Here's how to create a ping command -

```js
module.exports = {
    name: 'ping' , // required
    commands: ['p'] ,
    description: 'Ping' , // optional
    callback: (message) => {
      message.reply('Pong!')
    }
}
```

You can either use `commands: ['']` or `aliases: ['']` , either works but you have to use one atleast.

Users can use `>ping` or `>p` and use the command.

# minArgs & maxArgs

Minimum and Maximum number of args a user has to use before they can use the command. In this example the bot will ping the user you ping.

```js
// ping-member.js

module.exports = {
    name: 'ping-member' ,
    commands: ['ping-member' , 'pingmember' , 'pm'] ,
    description: 'Bot pings the member you ping' ,
    minArgs: 1 ,
    maxArgs: 1 ,
    callback: (message) => {
        const { mentions } = message
        const target = mentions.users.first()

        if(target){
            message.channel.send(`Hello , ${target} !`)
        }
    }
}
```

Note - `minArgs` cannot be less than `maxArgs` or you will get an error.

# Syntax Error

## Global Syntax Error -

The default syntaxError is `Wrong Syntax` !
You can change it in your main file using -

```js
new CommandingJS(client)
    .setSyntaxError("")
```

## Per-Command Syntax Error -

You can specify the syntax error for each command using -

```js
module.exports = {
    name: 'ping-member' ,
    commands: ['ping-member' , 'pingmember' , 'pm'] ,
    description: 'Bot pings the member you ping' ,
    syntaxError: 'wrong symtax! use {PREFIX}{COMMAND} <@mention>' ,
    minArgs: 1 ,
    maxArgs: 1 ,
    callback: (message) => {
        const { mentions } = message
        const target = mentions.users.first()

        if(target){
            message.channel.send(`Hello , ${target} !`)
        }
    }
}
```

You can use -
`{PREFIX}` - to show the bot's perfix on the Error

`{COMMAND}` - command name

# Permissions

Making a ban command or any other command that requires permissions? You can do it by -

```js
module.exports = {
    name: 'ping' ,
    commands: ['p'] , // or aliases: ['p'] . either works
    description: 'Ping' ,
    requiredPermissions: ['ADMINISTRATOR'] ,
    callback: (message) => {
      message.reply('Pong!')
    }
}
```

[Here](./src/permissions.ts) are all the permissions that you might have to use.

# MongoDB Connection

MongoDB Connection is optional. You will need it to use the built in commands or any commands that you use that requires to save data.
You can define it in the main file using -

```js
// index file

const config = require('./config.json')

new CommandingJS(client)
    .setMongoPath(config.mongo_uri)
```

config.json

```json
{
    "token": "" ,
    "mongo_uri": ""
}
```

# Built in commands -

`>prefix` - Displays the prefix of the bot

`>prefix <new prefix>` - Changes the prefix of the bot. It is supported per server. Required MongoDB Connection. See [MongoDB Connection](#mongodb-connection) to know to to connect to MongoDB.

`>command <enable | disable> <command name>` - Enable or Disable any command. It is supported per server. Requires MongoDB Connection. 

`>commands` - Displays **all** the current commands of the bot.

# SOURCES

All these snippets have come from [Commanding.JS Test Repository](https://github.com/CodyAaTherf/commandingjs-tests). It has been maintained by me itself.