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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})