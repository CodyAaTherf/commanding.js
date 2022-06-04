import { Client , Message } from 'discord.js'
import commandingjs from '..'

export = {
    name: 'commands' ,
    aliases: 'cmds' ,
    minArgs: 0 ,
    maxArgs: 0 ,
    callback: (
        message: Message ,
        args: string[] ,
        text: string ,
        prefix: string ,
        client: Client ,
        instance: commandingjs
    ) => {
        let msg = 'Commands\n'

        for(const command of instance.commands){
            const { names , description } = command

            msg += `
                **${names.shift()}**
                ALiases: ${names.length ? `"${names.join('" , "')}"` : 'None'}
                Description: ${description || 'None'}
            `
        }

        message.channel.send(msg)
    }
}