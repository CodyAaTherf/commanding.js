import { Client , Guild } from 'discord.js'
import commandingjs from '.'
import fs from 'fs'

import Command from './Command'
import getAllFiles from './get-all-files'
import ICommand from './interfaces/ICommand'
import disabledCommands from './models/disabled-commands'

class CommandHandler {
    private _commands: Map<String , Command> = new Map()
    private _disabled: Map<String , String[]> = new Map()

    constructor(instance: commandingjs , client: Client , dir: string){
        if(dir){
            if(fs.existsSync(dir)){
                const files = getAllFiles(dir)
                const amount = files.length

                if(amount > 0){
                    this.fetchDisabledCommands()

                    console.log(`Loaded ${amount} command${amount === 1 ? '' : 's'}`)

                    for(const file of files){
                        this.registerCommand(instance , client , file)
                    }

                    client.on('message' , (message) => {
                        const guild: Guild | null = message.guild
                        let content: string = message.content
                        const prefix = instance.getPrefix(guild)

                        if(content.startsWith(prefix)){
                            content = content.substring(prefix.length)
                            const args = content.split(/ /g)
                            const firstElement = args.shift()

                            if(firstElement){
                                const name = firstElement.toLowerCase()

                                const command = this._commands.get(name)

                                if(command){
                                    if(guild){
                                        const isDisabled = instance.commandHandler.isCommandDisabled(guild.id , command.names[0])
                                        // const isDisabled = instance.commandHandler.isCommandDisabled(guild.id , command.names)

                                        if(isDisabled){
                                            message.reply("This command is currectly disabled in this server!")

                                            return
                                        }
                                    }

                                    const { minArgs , maxArgs , expectedArgs } = command
                                    let { syntaxError = instance.syntaxError } = command

                                    if(
                                        (minArgs !== undefined && args.length < minArgs) ||
                                        (maxArgs !== undefined && maxArgs !== -1 && args.length > maxArgs)
                                    ){
                                        if(syntaxError){
                                            syntaxError = syntaxError.replace(/{PREFIX}/g , prefix)
                                        }

                                        syntaxError = syntaxError.replace(/{COMMAND}/g , name)
                                        syntaxError = syntaxError.replace(/ {ARGUMENTS}/g , expectedArgs ? ` ${expectedArgs}` : '')

                                        message.reply(syntaxError)
                                        return
                                    }

                                    command.execute(message , args)
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

    public registerCommand(
        instance: commandingjs ,
        client: Client ,
        file: string
    ){
        const configuration = require(file)

        const{
            name ,
            commands ,
            aliases ,
            callback ,
            execute ,
            run ,
            description
        } = configuration

        // if(callback && execute){
        //     throw new Error('Commands can have either "callback" or "execute"')
        // }

        let callBackCounter = 0
        if(callback) ++callBackCounter
        if(execute) ++callBackCounter
        if(run) ++callBackCounter

        if(callBackCounter > 1){
            throw new Error(`Commands can have either "callback" , "execute" or "run".`)
        }

        let names = commands || aliases || []

        if(!name && (!names || names.length === 0)){
            throw new Error(`Command "${file}" does not have "name" specified.`)
        }

        if(typeof names === 'string'){
            names = [names]
        }

        if(name && !names.includes(name.toLowerCase())){
            names.unshift(name.toLowerCase())
        }

        if(!description){
            console.warn(`Command "${names[0]}" does not have "description" property.`)
        }

        const hasCallback = callback || execute || run

        if(hasCallback){
            const command = new Command(
                instance ,
                client ,
                names ,
                callback || execute ,
                configuration
            )

            for(const name of names){
                this._commands.set(name.toLowerCase() , command)
            }
        }
    }

    public get commands(): ICommand[]{
        const results: { names: string[] ; description: string }[] = []

        this._commands.forEach(({ names , description = '' }) => {
            results.push({
                names: [...names] ,
                description
            })
        })

        // return Array.from(results.values())
        return results
    }

    public async fetchDisabledCommands(){
        const results: any[] = await disabledCommands.find({})

        for(const result of results){
            const { guildId , command } = result

            const array = this._disabled.get(guildId) || []
            array.push(command)

            this._disabled.set(guildId , array)
        }

        console.log(this._disabled);        
    }

    public disableCommand(guildId: string , command: string){
        const array = this._disabled.get(guildId) || []

        if(array && !array.includes(command)){
            array.push(command)
            this._disabled.set(guildId , array)
        }
    }

    public enableCommand(guildId: string , command: string){
        const array = this._disabled.get(guildId) || []
        const index = array ? array.indexOf(command) : -1

        if(array && index >= 0){
            array.splice(index , 1)
        }
    }

    public isCommandDisabled(guildId: string , command: string): boolean{
        const array = this._disabled.get(guildId)
        
        return(array && array.includes(command)) || false
    }
}

export = CommandHandler