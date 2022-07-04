const morgan = require('morgan')
const express = require('express')
const app = express()
const cors = require('cors')
const MediaObj = require('./models/mediaObj')
const logger = require('./utils/logger')
const mediaObjArrRouter = require('./controllers/mediaObjArr')

// hard-coded data
let userData = {
  'userName': 'Dan'
}

// middleware
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('req-body', (req) => JSON.stringify(req.body))
app.use(morgan('[:date[clf]] :method :url :status :res[content-length] - ' +
    ':response-time ms -- :req-body'))

// routes
app.use('/api/mediaObjArr', mediaObjArrRouter)

app.get('/info', (request, response) => {
  MediaObj.countDocuments({})
    .then((numOfDocs) => {
      response.send(
        `<p>${userData.userName}'s backlog contains ` +
            `${numOfDocs} pieces of media</p>` +
        `<p>${new Date()}</p>`
      )
    })
})

app.get('/api/userData', (request, response) => {
  response.json(userData)
})

// more middleware
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

module.exports = app