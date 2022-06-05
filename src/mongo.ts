import mongoose , { ConnectOptions , Connection } from 'mongoose'

const results: {
    [name: number]: string
} = {
    0: 'Disconnected' ,
    1: 'Connected' ,
    2: 'Connecting' ,
    3: 'Disconnecting'
}

const mongo = async(mongoPath: string) => {
    await mongoose.connect(mongoPath , {
        keepAlive: true ,
        useNewUrlParser: true ,
        useUnifiedTopology: true
    }  as ConnectOptions )
}

const state = results[mongoose.connection.readyState] || 'Unknown'

console.log('MongoDB Status:' , state);

export const getMongoConnection = (): Connection => {
    return mongoose.connection
}

export default mongo