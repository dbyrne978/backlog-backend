const MediaObj = require('../models/mediaObj')

const initialMediaObjArr = [
  {
    title: '13 Sentinels',
    medium: 'Video Game',
    date: new Date(),
    progress: false,
  },
  {
    title: 'John Wick',
    medium: 'Movie',
    date: new Date(),
    progress: false,
  },
]

const nonExistingId = async () => {
  const mediaObj = new MediaObj({
    title: 'nonExistingId_test',
    medium: 'Video Game',
    date: new Date(),
    progress: false,
  })
  await mediaObj.save()
  await mediaObj.remove()

  return mediaObj._id.toString()
}

const mediaObjArrInDb = async () => {
  const mediaObjArr = await MediaObj.find({})
  return mediaObjArr.map(mediaObj => mediaObj.toJSON())
}

module.exports = {
  initialMediaObjArr, nonExistingId, mediaObjArrInDb
}