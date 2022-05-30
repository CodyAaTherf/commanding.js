import { Client , Guild } from 'discord.js'
import commandingjs from '.'

import Command from './Command'
import getAllFiles from './get-all-files'

import fs from 'fs'
import ICommand from './interfaces/ICommand'

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
                        let fileName: string | string[] = file
                            .replace(/\\/g , '/')
                            .split('/')

                        fileName = fileName[fileName.length - 1]
                        fileName = fileName.split('.')[0].toLowerCase()

                        const configuration = require(file)
                        // const { aliases , callback } = configuration
                        const{
                            name ,
                            commands ,
                            aliases ,
                            callback ,
                            execute ,
                            description ,
                        } = configuration

                        if(callback && execute){
                            throw new Error('Commands can have either "callback" or "execute".')
                        }

                        let names = commands || aliases

                        if(!name && (!names || names.length === 0)){
                            throw new Error(`Command "${file}" does not have "name" specified.`)
                        }

                        if(typeof names === 'string'){
                            names = [names]
                        }

                        if(names && !names.includes(name.toLowerCase())){
                            names.unshift(name.toLowerCase())
                        }

                        // if(aliases && aliases.length && callback){
                        //     const command = new Command(instance , client , configuration)

                        //     for(const alias of aliases){
                        //         this._commands.set(alias.toLowerCase() , command)
                        //     }
                        // }

                        if(!names.includes(fileName)){
                            names.unshift(fileName)
                        }

                        if(!description){
                            console.warn(`Command "${names[0]}" does not have "description" property.`)
                        }

                        const hasCallback = callback || execute

                        if(hasCallback){
                            const command = new Command(instance , client , names , callback || execute , configuration)

                            for(const name of names){
                                this._commands.set(name.toLowerCase() , command)
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

    public get commands(): ICommand[]{
        const results = new Map()

        this._commands.forEach(({ names , description = '' }) => {
            results.set(names[0] , {
                names ,
                description
            })
        })

        return Array.from(results.values())
    }
}

export = CommandHandler