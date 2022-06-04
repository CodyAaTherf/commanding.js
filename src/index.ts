import { Client , Guild } from 'discord.js'
import CommandHandler from './CommandHandler'
import ListenerHandler from './ListenerHandler'
import ICommand from './interfaces/ICommand'
import mongo from './mongo'

class commandingjs {
    private _defaultPrefix = '>'
    private _commandsDir = 'commands'
    private _listenersDir = ''
    private _mongo = ''
    private _syntaxError = 'Wrong Syntax!'
    private _prefixes: { [name: string] : string } = {}
    private _commandHandler: CommandHandler

    constructor(client: Client , commandsDir?: string , listenerDir?: string){
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

                if(listenerDir){
                    listenerDir = `${path}/${listenerDir}`
                }
            }
        }

        this._commandsDir = commandsDir || this._commandsDir
        this._listenersDir = listenerDir || this._listenersDir

        // new CommandHandler(this , client , this._commandsDir)
        this._commandHandler = new CommandHandler(this , client , this._commandsDir)

        if(this._listenersDir){
            new ListenerHandler(client , this._listenersDir)
        }

        setTimeout(() => {
            if(this._mongo){
                mongo(this._mongo)
            } else{
                console.warn("MongoDB connection URI isn't provided , some features might not work!")
            }
        } , 500)
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

    public get commands(): ICommand[]{
        return this._commandHandler.commands
    }

    public get commandAmount(): number{
        return this.commands.length
    }
}

export = commandingjs