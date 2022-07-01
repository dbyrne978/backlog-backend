const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
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