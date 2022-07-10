const express = require('express')
const app = express()
const cors = require('cors')
const infoPageRouter = require('./controllers/infoPage')
const backlogItemsRouter = require('./controllers/backlogItems')
const userDataRouter = require('./controllers/userData')
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
app.use('/info', infoPageRouter)
app.use('/api/backlogItems', backlogItemsRouter)
app.use('/api/userData', userDataRouter)

// more middleware
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app