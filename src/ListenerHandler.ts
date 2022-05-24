import { Client } from 'discord.js'
import getAllFiles from './get-all-files'
import fs from 'fs'

class ListenerHandler{
    constructor(client: Client , dir: string){
        if(dir){
            if(fs.existsSync(dir)){
                // const files = fs
                //     .readdirSync(dir)
                //     .filter((file: string) => file.endsWith('.js'))

                const files = getAllFiles(dir)
                const amount = files.length

                if(amount > 0){
                    console.log(`Loaded ${amount} listeners${amount === 1 ? '' : 's'}`)
                    
                    for(const file of files){
                        const func = require(file)
                        
                        if(typeof func === 'function'){
                            func(client)
                        }
                    }
                }
            } else {
                throw new Error(`Listeners directory "${dir}" doesn't exist !`)
            }
        }
    }
}

export = ListenerHandler