const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const infoPageRouter = require('./controllers/infoPage')
const backlogItemsRouter = require('./controllers/backlogItems')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const config = require('./utils/config')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

// middleware
app.use(express.json())
app.use(cors())
app.use(express.static('build'))
app.use(middleware.morgan('[:date[clf]] :method :url :status ' +
    ':res[content-length] - :response-time ms -- :req-body'))

// routes
app.use('/api/login', loginRouter)
app.use('/info', infoPageRouter)
app.use('/api/backlogItems', backlogItemsRouter)
app.use('/api/users', usersRouter)

// more middleware
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app