const BacklogItem = require('../models/backlogItem')
const User = require('../models/user')

const initialBacklogItems = [
  {
    title: '13 Sentinels',
    medium: 'Video Game',
    dateCreated: new Date(),
    progress: false,
  },
  {
    title: 'John Wick',
    medium: 'Movie',
    dateCreated: new Date(),
    progress: false,
  },
]

const nonExistingId = async () => {
  const backlogItem = new BacklogItem({
    title: 'nonExistingId_test',
    medium: 'Video Game',
    date: new Date(),
    progress: false,
  })
  await backlogItem.save()
  await backlogItem.remove()

  return backlogItem._id.toString()
}

const backlogItemsInDb = async () => {
  const backlogItems = await BacklogItem.find({})
  return backlogItems.map(backlogItem => backlogItem.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBacklogItems,
  nonExistingId,
  backlogItemsInDb,
  usersInDb,
}