const mongoose = require('mongoose')
const logger = require('../utils/logger')
const config = require('../utils/config')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

const mediaObjSchema = new mongoose.Schema({
  dateCreated: Date,
  title: {
    type: String,
    required: true
  },
  medium: {
    type: String,
    required: true
  },
  progress: Boolean,
})

mediaObjSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('MediaObj', mediaObjSchema)