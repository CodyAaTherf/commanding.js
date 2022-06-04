# TABLE OF CONTENTS

- [Installation](#installation)
- [Setup](#setup)
- [Creating a Command](#creating-a-command)
- [Usage of minArgs and maxArgs](#minargs--maxargs)
- [Changing Default Prefix](#prefixes)
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

# Prefixes

The default prefix of the bot on installing this package will be - `>` .
You can change it in your main file using -

```js
new CommandingJS(client)
    .setDefaultPrefix('!')
```

# SOURCES

All these snippets have come from [Commanding.JS Test Repository](https://github.com/CodyAaTherf/commandingjs-tests). It has been maintained by me itself.