# TABLE OF CONTENTS

- [Installation](#installation)
- [Setup](#setup)
- [Creating a Command](#creating-a-command)

# Installation

**NPM**
```bash
npm i commanding.js
```

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