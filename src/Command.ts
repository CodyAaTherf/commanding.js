import { Client , GuildMember , Message } from 'discord.js'
import commandingjs from '.'

interface configuration{
    names: string[] | string
    minArgs?: number
    maxArgs?: number
    syntaxError?: string
    expectedArgs?: string
    description?: string
    callback: Function
}

class Command {
    private instance: commandingjs
    private client: Client
    private _names: string[] = []
    private _minArgs: number = 0
    private _maxArgs: number = -1
    private _syntaxError?: string
    private _expectedArgs?: string
    private _description?: string
    private _cooldown: string[] = []
    private _callback: Function = () => {}

    constructor(
        instance: commandingjs ,
        client: Client ,
        names: string[] ,
        callback: Function ,
        { minArgs , maxArgs , syntaxError , expectedArgs , description }: configuration
    ){
        this.instance = instance
        this.client = client
        this._names = typeof names === 'string' ? [names] : names
        this._minArgs = minArgs || 0
        this._maxArgs = maxArgs === undefined ? -1 : maxArgs
        this._syntaxError = syntaxError
        this._expectedArgs = expectedArgs
        this._description = description
        this._callback = callback

        if(this._minArgs < 0){
            throw new Error(`Command "${names[0]}" cannon have a minimum arg count less than 0`)
        }

        if(this._maxArgs < -1){
            throw new Error(`Command "${names[0]}" cannot have a maximum arg count less than -1`)
        }

        if(this._maxArgs !== -1 && this._maxArgs < this._minArgs){
            throw new Error(`Command "${names[0]}" cannot have a max arg count less than it's min args count.`)
        }
    }

    public execute(message: Message , args: string[]){
        this._callback(
            message ,
            args ,
            args.join(' ') ,
            this.client ,
            // message.guild
            //     ? this.instance.prefixes[message.guild.id]
            //     : this.instance.defaultPrefix
            this.instance.getPrefix(message.guild) ,
            this.instance
        )
    }
    
    public get names(): string[] {
        return this.names
    }

    public get minArgs(): number {
        return this._minArgs
    }

    public get maxArgs(): number {
        return this._maxArgs
    }

    public get syntaxError(): string | undefined{
        return this._syntaxError
    }

    public get expectedArgs(): string | undefined {
        return this._expectedArgs
    }

    public get description(): string | undefined{
        return this._description
    }

    public setCooldown(member: GuildMember | string , seconds: number){
        if(typeof member !== 'string'){
            member = member.id
        }

        console.log(`Setting Cooldown of ${member} for ${seconds}s`)
    }

    public clearCooldown(member: GuildMember | string){
        if(typeof member !== 'string'){
            member = member.id
        }

        console.log(`Clearning Cooldown of ${member}`)
    }

    public get callback(): Function{
        return this._callback
    }
}

export = Command