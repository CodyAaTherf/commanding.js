import { Client , Guild } from 'discord.js'
import commandingjs from '.'

import Command from './Command'
import getAllFiles from './get-all-files'

import fs from 'fs'

class CommandHandler {
    private _commands: Map<String , Command> = new Map()

    constructor(instance: commandingjs , client: Client , dir: string){
        if(dir){
            if(fs.existsSync(dir)){
                // const files = fs
                //     .readdirSync(dir)
                //     .filter((file: string) => file.endsWith('.js'))

                const files = getAllFiles(dir)
                const amount = files.length

                if(amount > 0){
                    console.log(`Loaded ${amount} command${amount === 1 ? '' : 's'}`)

                    for(const file of files){
                        const configuration = require(file)
                        const { aliases , callback } = configuration

                        if(aliases && aliases.length && callback){
                            const command = new Command(instance , client , configuration)

                            for(const alias of aliases){
                                this._commands.set(alias.toLowerCase() , command)
                            }
                        }
                    }

                    client.on('message' , (message) => {
                        const guild: Guild | null = message.guild
                        let content: string = message.content
                        const prefix = instance.getPrefix(guild)

                        if(content.startsWith(prefix)){
                            content = content.substring(prefix.length)
                            const words = content.split(/ /g)
                            const firstElement = words.shift()

                            if(firstElement){
                                const alias = firstElement.toLowerCase()

                                const command = this._commands.get(alias)

                                if(command){
                                    command.execute(message , words)
                                }
                            }
                        }
                    })
                }
            } else{
                throw new Error(`Commands directory "${dir} doesn't exist !`)
            }
        }
    }
}

export = CommandHandler