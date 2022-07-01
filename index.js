require('dotenv').config()
const morgan = require('morgan')
const express = require('express')
const cors = require('cors')
const app = express()
const MediaObj = require('./models/mediaObj')

// hard-coded data
let userData = {
  'userName': 'Dan'
}

// middleware
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('req-body', (req, res) => JSON.stringify(req.body))
app.use(morgan('[:date[clf]] :method :url :status :res[content-length] - ' +
    ':response-time ms -- :req-body'))

// routes
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

app.get('/api/mediaObjArr', (request, response) => {
  MediaObj.find({}).then(mediaObjArr => {
    response.json(mediaObjArr)
  })
})

app.get('/api/mediaObjArr/:id', (request, response, next) => {
  MediaObj.findById(request.params.id)
    .then(mediaObj => {
      if (mediaObj) {
        response.json(mediaObj)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/mediaObjArr/:id', (request, response, next) => {
  MediaObj.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/mediaObjArr', (request, response, next) => {
  const body = request.body

  //save new mediaObj if title/medium combo doesn't already exist
  MediaObj
    .findOne({ title: body.title, medium: body.medium })
    .then((existingTitleMediumCombo) => {
      if (existingTitleMediumCombo) {
        return response.status(400).json({
          error: 'title/medium combo already exists'
        })
      } else {
        const mediaObj = new MediaObj({
          dateCreated: new Date(),
          title: body.title,
          medium: body.medium,
          progress: body.progress || false
        })

        mediaObj.save()
          .then(savedMediaObj => {
            response.json(savedMediaObj)
          })
          .catch(error => next(error))
      }
    })
})

app.put('/api/mediaObjArr/:id', (request, response, next) => {
  const body = request.body

  const mediaObj = {
    title: body.title,
    medium: body.medium,
    progress: body.progress
  }

  MediaObj.findByIdAndUpdate(
    request.params.id,
    mediaObj,
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedMediaObj => {
      response.json(updatedMediaObj)
    })
    .catch(error => next(error))
})

// more middleware
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

// listener
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})