import { Client , Message } from 'discord.js'
import commandingjs from '..'
import prefixes from '../models/prefixes'

export = {
    name: 'prefix' ,
    commands: ['prefix'] ,
    minArgs: 0 ,
    maxArgs: 1 ,
    expectedArgs: '(New Prefix)' ,
    description: 'Shows current prefix of the bot / Changes prefix.' ,
    requiredPermissions: ['ADMINISTRATOR'] ,
    callback: async(
        message: Message ,
        args: string[] ,
        text: string ,
        client: Client ,
        prefix: string ,
        instance: commandingjs
    ) => {
        if(args.length === 0){
            message.reply(`The current prefix is "${prefix}"`)
        } else{
            const { guild } = message

            if(guild){
                const { id } = guild

                await prefixes.findOneAndUpdate(
                    {
                        _id: id
                    } ,
                    {
                        _id: id ,
                        prefix: text
                    } ,
                    {
                        upsert: true
                    }
                )

                instance.setPrefix(guild , text)

                message.reply(`Prefix changed to "${text}`)
            } else{
                message.reply("You cannot change prefixes in DMs.")
            }
        }
    }
}