const express = require('express')
const app = express()
const cors = require('cors')
const infoPageRouter = require('./controllers/infoPage')
const mediaObjArrRouter = require('./controllers/mediaObjArr')
const userDataRouter = require('./controllers/userData')
const middleware = require('./utils/middleware')

// middleware
app.use(express.json())
app.use(cors())
app.use(express.static('build'))
app.use(middleware.morgan('[:date[clf]] :method :url :status ' +
    ':res[content-length] - :response-time ms -- :req-body'))

// routes
app.use('/info', infoPageRouter)
app.use('/api/mediaObjArr', mediaObjArrRouter)
app.use('/api/userData', userDataRouter)

// more middleware
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app