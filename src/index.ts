import { Client , Guild } from 'discord.js'
import path from 'path'

import CommandHandler from './CommandHandler'
import FeatureHandler from './FeatureHandler'
import ICommand from './interfaces/ICommand'
import mongo from './mongo'
import getAllFiles from './get-all-files'
import prefixes from './models/prefixes'

class commandingjs {
    private _defaultPrefix = '>'
    private _commandsDir = 'commands'
    private _featuresDir = ''
    private _mongo = ''
    private _syntaxError = 'Wrong Syntax!'
    private _prefixes: { [name: string] : string } = {}
    private _commandHandler: CommandHandler

    constructor(client: Client , commandsDir?: string , featureDir?: string){
        if(!client){
            throw new Error("Discord.jS Client isn't defined.")
        }

        if(!commandsDir){
            console.warn("Commands folder isn't defined. Using 'commands'")
        }

        if(module && module.parent){
            const { path } = module.parent

            if(path){
                commandsDir = `${path}/${commandsDir || this._commandsDir}`

                if(featureDir){
                    featureDir = `${path}/${featureDir}`
                }
            }
        }

        this._commandsDir = commandsDir || this._commandsDir
        this._featuresDir = featureDir || this._featuresDir

        this._commandHandler = new CommandHandler(this , client , this._commandsDir)

        if(this._featuresDir){
            new FeatureHandler(client , this._featuresDir)
        }

        setTimeout(() => {
            if(this._mongo){
                mongo(this._mongo)
            } else{
                console.warn("MongoDB connection URI isn't provided , some features might not work!")
            }
        } , 500)

        // Built in cmds

        for(const file of getAllFiles(
            path.join(__dirname , 'commands')
            )){
                this._commandHandler.registerCommand(this , client , file)
            }

        const loadPrefixes = async() => {
            const results: any[] = await prefixes.find({})

            for(const result of results){
                const { _id , prefix } = result

                this._prefixes[_id] = prefix
            }

            console.log(this._prefixes);            
        }

        loadPrefixes()
    }

    public get mongoPath(): string{
        return this._mongo
    }
    
    public setMongoPath(mongoPath: string): commandingjs{
        this._mongo = mongoPath
        return this
    }

    public get syntaxError(): string{
        return this._syntaxError
    }

    public setSyntaxError(syntaxError: string): commandingjs{
        this._syntaxError = syntaxError
        return this
    }

    public get prefixes(){
        return this._prefixes
    }

    public get defaultPrefix(): string{
        return this._defaultPrefix
    }

    public setDefaultPrefix(defaultPrefix: string): commandingjs{
        this._defaultPrefix = defaultPrefix
        return this
    }

    public getPrefix(guild: Guild | null): string{
        return this._prefixes[guild ? guild.id : ''] || this._defaultPrefix
    }

    public setPrefix(guild: Guild | null , prefix: string){
        if(guild){
            this._prefixes[guild.id] = prefix
        }
    }

    public get commandHandler(): CommandHandler{
        return this._commandHandler
    }

    public get commands(): ICommand[]{
        return this._commandHandler.commands
    }

    public get commandAmount(): number{
        return this.commands.length
    }
}

export = commandingjs