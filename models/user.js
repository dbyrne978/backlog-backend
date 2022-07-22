const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  dateCreated: Date,
  username: String,
  passwordHash: String,
  backlogItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BacklogItem'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User