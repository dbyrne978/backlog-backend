const morgan = require('morgan')
const express = require('express')
const cors = require('cors')
const app = express()

// data
let db = {
  "userData": {
    "userName": "Dan"
  },
  "mediaObjArr": [
    {
      "id": 1,
      "dateCreated": new Date(),
      "title": "13 Sentinels",
      "medium": "Video Game",
      "progress": true
    },
    {
      "id": 2,
      "dateCreated": new Date(),
      "title": "Buffy: the Vampire Slayer",
      "medium": "TV Show",
      "progress": false
    },
    {
      "id": 3,
      "dateCreated": new Date(),
      "title": "Chronicle",
      "medium": "Movie",
      "progress": false
    },
    {
      "id": 4,
      "dateCreated": new Date(),
      "title": "Blood of Elves",
      "medium": "Book",
      "progress": true
    }
  ]
}

// middleware
app.use(express.json())
app.use(cors())

morgan.token('req-body', (req, res) => JSON.stringify(req.body))
app.use(morgan('[:date[clf]] :method :url :status :res[content-length] - ' +
    ':response-time ms -- :req-body'))

// routes
app.get('/info', (request, response) => {
  response.send(
    `<p>${db.userData.userName}'s backlog contains ` +
        `${db.mediaObjArr.length} pieces of media</p>` +
    `<p>${new Date()}</p>`
  )
})

app.get('/api/db', (request, response) => {
  response.json(db)
})

app.get('/api/db/userData', (request, response) => {
  response.json(db.userData)
})

app.get('/api/db/mediaObjArr', (request, response) => {
  response.json(db.mediaObjArr)
})

app.get('/api/db/mediaObjArr/:id', (request, response) => {
  const id = Number(request.params.id)
  const mediaObj = db.mediaObjArr.find(mediaObj => mediaObj.id === id)
  
  if (mediaObj) {
    response.json(mediaObj)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/db/mediaObjArr/:id', (request, response) => {
  const id = Number(request.params.id)
  db.mediaObjArr = db.mediaObjArr.filter(mediaObj => mediaObj.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const maxId = db.mediaObjArr.length > 0
    ? Math.max(...db.mediaObjArr.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/db/mediaObjArr', (request, response) => {
  const body = request.body

  if (!body.title) {
    return response.status(400).json({ 
      error: 'title missing' 
    })
  }

  if (!body.medium) {
    return response.status(400).json({ 
      error: 'medium missing' 
    })
  }

  const titleMediumPairs = db.mediaObjArr.map(n => `${n.title}/${n.medium}`)
  if (titleMediumPairs.includes(`${body.title}/${body.medium}`)) {
    return response.status(400).json({ 
      error: 'title/medium combo already exists' 
    })
  }
  
  const mediaObj = {
    id: generateId(),
    dateCreated: new Date(),
    title: body.title,
    medium: body.medium,
    progress: body.progress || false
  }

  db.mediaObjArr = db.mediaObjArr.concat(mediaObj)

  response.json(mediaObj)
})

// more middleware
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// listener
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})