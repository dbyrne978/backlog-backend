const infoPageRouter = require('express').Router()
const MediaObj = require('../models/mediaObj')

let userData = { 'userName': 'Dan' }

infoPageRouter.get('/', (request, response) => {
  MediaObj.countDocuments({})
    .then((numOfDocs) => {
      response.send(
        `<p>${userData.userName}'s backlog contains ` +
            `${numOfDocs} pieces of media</p>` +
        `<p>${new Date()}</p>`
      )
    })
})

module.exports = infoPageRouter