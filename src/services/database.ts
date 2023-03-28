require('dotenv').config()

import Mongoose, { ConnectOptions } from 'mongoose'
let database: Mongoose.Connection

const dbUser = process.env.DB_USERNAME
const dbPassword = process.env.DB_PASSWORD
const dbDatabase = process.env.DB_DATABASE || 'psychlysis'
const mongoURI = `mongodb+srv://rahulbhadja:PbpheNNcF3p22JVJ@cluster0.hpaxq9x.mongodb.net/psychlysis?retryWrites=true&w=majority`
export const connect = () => {
  const uri = mongoURI
  if (database) {
    return
  }
  Mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  database = Mongoose.connection
  database.once('open', async () => {
    console.log('Connected to database')
  })
  database.on('error', () => {
    console.log('Error connecting to database')
  })
}
export const disconnect = () => {
  if (!database) {
    return
  }
  Mongoose.disconnect()
}
