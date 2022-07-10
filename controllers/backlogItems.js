const backlogItemsRouter = require('express').Router()
const BacklogItem = require('../models/backlogItem')

backlogItemsRouter.get('/', async (request, response) => {
  const backlogItems = await BacklogItem.find({})
  response.json(backlogItems)
})

backlogItemsRouter.get('/:id', async (request, response) => {
  const backlogItem = await BacklogItem.findById(request.params.id)
  backlogItem
    ? response.json(backlogItem)
    : response.status(404).end()
})

backlogItemsRouter.delete('/:id', async (request, response) => {
  await BacklogItem.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

backlogItemsRouter.post('/', (request, response, next) => {
  const body = request.body

  //save new backlogItem if title/medium combo doesn't already exist
  BacklogItem
    .findOne({ title: body.title, medium: body.medium })
    .then((existingTitleMediumCombo) => {
      if (existingTitleMediumCombo) {
        return response.status(400).json({
          error: 'title/medium combo already exists'
        })
      } else {
        const backlogItem = new BacklogItem({
          dateCreated: new Date(),
          title: body.title,
          medium: body.medium,
          progress: body.progress || false
        })

        backlogItem.save()
          .then(savedBacklogItem => {
            response.status(201).json(savedBacklogItem)
          })
          .catch(error => next(error))
      }
    })
})

backlogItemsRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const backlogItem = {
    title: body.title,
    medium: body.medium,
    progress: body.progress
  }

  BacklogItem.findByIdAndUpdate(
    request.params.id,
    backlogItem,
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedBacklogItem => {
      response.json(updatedBacklogItem)
    })
    .catch(error => next(error))
})

module.exports = backlogItemsRouter