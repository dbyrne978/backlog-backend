const express = require('express')
const app = express()

let db = {
  "userData": {
    "userName": "Dan"
  },
  "mediaObjArr": [
    {
      "id": 1,
      "title": "13 Sentinels",
      "medium": "Video Game",
      "progress": true
    },
    {
      "id": 2,
      "title": "Buffy: the Vampire Slayer",
      "medium": "TV Show",
      "progress": false
    },
    {
      "id": 3,
      "title": "Chronicle",
      "medium": "Movie",
      "progress": false
    },
    {
      "id": 4,
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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})