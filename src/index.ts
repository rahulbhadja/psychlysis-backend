import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import passport from 'passport'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import { connect } from './services/database'
import email from './routes/email'
import auth from './routes/index'

import survey from './routes/survey'

require('dotenv').config

const app = express()

const host = process.env.SERVER_HOST || '0.0.0.0'
const port = Number(process.env.SERVER_PORT) || 8080
const secret = process.env.SECRET_CODE || 'gDv4S8cv84YkmY8pW5e83Sq8&UwybDTg2D'

app.set('port', port)
app.use(morgan(':method :url :status :response-time'))
app.use(
  cors({
    origin: process.env.ORIGINS || [
      'http://0.0.0.0:3000',
      'http://localhost:3000',
    ],
    credentials: true,
  })
)
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
)

app.use(
  session({
    secret: secret,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60, //one hour
    },
  })
)
app.use(cookieParser(secret))
app.use(passport.initialize())
app.use(passport.session())

connect()

app.use('/email', email)
app.use('/survey', survey)
app.use('/auth', auth)

app.get('/', (req, res) => {
  res.send('Psychlysis backend version 1.1.1')
})

app.listen(port, host, function () {
  console.log(`Server running on ${port} and host is ${host}`)
})
