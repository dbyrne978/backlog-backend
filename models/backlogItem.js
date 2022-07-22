const mongoose = require('mongoose')

const backlogItemSchema = new mongoose.Schema({
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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

backlogItemSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('BacklogItem', backlogItemSchema)