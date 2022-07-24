const backlogItemsRouter = require('express').Router()
const BacklogItem = require('../models/backlogItem')
const User = require('../models/user')

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

backlogItemsRouter.post('/', async (request, response) => {
  const user = await User.findById(request.body.userId)

  const newBacklogItem = new BacklogItem({
    dateCreated: new Date(),
    title: request.body.title,
    medium: request.body.medium,
    progress: request.body.progress || false,
    user: user._id,
  })

  const existingTitleMediumCombo = await BacklogItem.findOne({
    title: newBacklogItem.title,
    medium: newBacklogItem.medium
  })

  if (existingTitleMediumCombo) {
    response.status(400).json({ error: 'title/medium combo already exists' })
  } else {
    const savedBacklogItem = await newBacklogItem.save()
    user.backlogItems = user.backlogItems.concat(savedBacklogItem._id)
    await user.save()
    response.status(201).json(savedBacklogItem)
  }
})

backlogItemsRouter.put('/:id', async (request, response) => {
  const editedBacklogItem = {
    title: request.body.title,
    medium: request.body.medium,
    progress: request.body.progress
  }

  const updatedBacklogItem = await BacklogItem.findByIdAndUpdate(
    request.params.id,
    editedBacklogItem,
    { new: true, runValidators: true, context: 'query' }
  )
  response.json(updatedBacklogItem)
})

module.exports = backlogItemsRouter