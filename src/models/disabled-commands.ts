import mongoose from 'mongoose'

const requiredStr = {
    type: String ,
    required: true
}

const disabledCommands = new mongoose.Schema({
    guildId: requiredStr ,
    command: requiredStr
})

export = mongoose.model('commandingjs-disable-commands' , disabledCommands)