const { Schema, model } = require('mongoose')

const blogSchema = new Schema({
  // Hago el titulo requerido y la url requerida y unica
  title: {
    type: String,
    requiered: true
  },
  author: String,
  url: {
    type: String,
    requiered: true
  },
  likes: Number
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Blog = model('Blog', blogSchema)
module.exports = Blog
