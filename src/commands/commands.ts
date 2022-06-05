import { Client , Message } from 'discord.js'
import commandingjs from '..'

export = {
    name: 'commands' ,
    aliases: ['cmds'] ,
    minArgs: 0 ,
    maxArgs: 0 ,
    description: 'Displays all the commands of the bot.' ,
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
            const mainName = names.shift() || ''

            msg += `
                **${mainName}**
                ALiases: ${names.length ? `"${names.join('" , "')}"` : 'None'}
                Description: ${description || 'None'}
                Enabled: ${
                    message.guild
                        ? instance.commandHandler.isCommandDisabled(
                            message.guild.id ,
                            mainName
                        )
                        ? 'No'
                        : 'Yes'
                    : ''
                }
            `
        }

        message.channel.send(msg)
    }
}