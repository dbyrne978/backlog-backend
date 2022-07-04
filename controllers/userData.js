const userDataRouter = require('express').Router()

let userData = { 'userName': 'Dan' }

userDataRouter.get('/', (request, response) => {
  response.json(userData)
})

module.exports = userDataRouter