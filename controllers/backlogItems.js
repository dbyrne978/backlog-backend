const backlogItemsRouter = require('express').Router()
const BacklogItem = require('../models/backlogItem')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

backlogItemsRouter.get('/', async (request, response) => {
  const backlogItems = await BacklogItem
    .find({}).populate('user', { username: 1 })
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

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

backlogItemsRouter.post('/', async (request, response) => {
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const newBacklogItem = new BacklogItem({
    dateCreated: new Date(),
    title: request.body.title,
    medium: request.body.medium,
    progress: request.body.progress || false,
    user: user._id,
  })

  const existingTitleMediumCombo = await BacklogItem.findOne({
    title: newBacklogItem.title,
    medium: newBacklogItem.medium,
    user: newBacklogItem.user,
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