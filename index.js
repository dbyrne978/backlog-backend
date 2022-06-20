const express = require('express')
const app = express()

app.use(express.json())

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

app.get('/', (request, response) => {
  response.send('<h1>Backlog API Front Page</h1>')
})

app.get('/api/db', (request, response) => {
  response.json(db)
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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})