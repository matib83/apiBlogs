const uniqueValidator = require('mongoose-unique-validator')
const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  passwordHash: String,
  blogs: [{
    type: Schema.Types.ObjectId, // Para avisar que es un array de objetos de Id (poniendo los [] primero) y {} luego
    ref: 'Blog' // Referencia a Notas, para utilizar unas funcionalidades especiales
  }]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
    // crudos de la BD, por eso puedo utilizar delete
    delete returnedObject.passwordHash
  }
})

userSchema.plugin(uniqueValidator) // Para validar que un campo es unico y no puede repetirse en toda la BD

const User = model('User', userSchema)

module.exports = User
