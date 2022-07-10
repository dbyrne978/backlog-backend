const infoPageRouter = require('express').Router()
const BacklogItem = require('../models/backlogItem')

let userData = { 'userName': 'Dan' }

infoPageRouter.get('/', (request, response) => {
  BacklogItem.countDocuments({})
    .then((numOfDocs) => {
      response.send(
        `<p>${userData.userName}'s backlog contains ` +
            `${numOfDocs} pieces of media</p>` +
        `<p>${new Date()}</p>`
      )
    })
})

module.exports = infoPageRouter