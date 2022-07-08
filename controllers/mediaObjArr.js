const mediaObjArrRouter = require('express').Router()
const MediaObj = require('../models/mediaObj')

mediaObjArrRouter.get('/', async (request, response) => {
  const mediaObjArr = await MediaObj.find({})
  response.json(mediaObjArr)
})

mediaObjArrRouter.get('/:id', (request, response, next) => {
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

mediaObjArrRouter.delete('/:id', (request, response, next) => {
  MediaObj.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

mediaObjArrRouter.post('/', (request, response, next) => {
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

mediaObjArrRouter.put('/:id', (request, response, next) => {
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

module.exports = mediaObjArrRouter