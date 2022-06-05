import mongoose from 'mongoose'

const requiredStr = {
    type: String ,
    required: true
}

const prefixSchema = new mongoose.Schema({
    _id: requiredStr ,
    prefix: requiredStr
})

export = mongoose.model('commandingjs-prefixes' , prefixSchema)