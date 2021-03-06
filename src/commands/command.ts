import { Client , Message } from 'discord.js'
import commandingjs from '..'
import disabledCommands from '../models/disabled-commands'
import commandStatus from '../models/disabled-commands'

export = {
    name: 'command' ,
    commands: 'command' ,
    minArgs: 2 ,
    maxArgs: 2 ,
    expectedArgs: '<enable | disable> <Command Name>' ,
    description: 'Enable or Disable any command.' ,
    requiredPermissions: ['ADMINISTRATOR'] ,
    callback: async(
        message: Message ,
        args: string[] ,
        text: string ,
        client: Client ,
        prefix: string ,
        instance: commandingjs
    ) => {
        const newState = args.shift()?.toLowerCase()
        const name = args.shift()?.toLowerCase()

        if(newState !== 'enable' && newState !== 'disable'){
            message.reply('It must either be "enable" or "disable".')
            
            return
        }

        const { guild } = message

        if(!guild){
            message.reply("You cannot enable or disable commands in DMs.")

            return
        }

        for(const { names } of instance.commands){
            // @ts-ignore
            if(names.includes(name)){
                const mainCommand = names[0]

                const isDisabled = instance.commandHandler.isCommandDisabled(guild.id , mainCommand)

                if(newState === 'enable'){
                    if(!isDisabled){
                        message.reply("This command is already enabled !")

                        return
                    }

                    await disabledCommands.deleteOne({
                        guildId: guild.id ,
                        command: mainCommand
                    })

                    instance.commandHandler.enableCommand(guild.id , mainCommand)

                    message.reply(`"${mainCommand}" is now enabled !`)
                } else {
                    if(isDisabled){
                        message.reply("That command is already disabled !")

                        return
                    }

                    await new disabledCommands({
                        guildId: guild.id ,
                        command: mainCommand
                    }).save()

                    instance.commandHandler.disableCommand(guild.id , mainCommand)

                    message.reply(`"${mainCommand}" is now disabled !`)
                }

                return
            }
        }

        message.reply(`A command names "${name}" does not exist.`)
    }
}