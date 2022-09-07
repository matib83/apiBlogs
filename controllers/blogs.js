const blogsRouter = require('express').Router()
const Blog = require('../models/Blog')
const User = require('../models/User')
const userExtractor = require('../middleware/userExtractor')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response, next) => {
  // Extraigo el campo likes, title y url del post del blog
  const {
    title,
    author,
    url,
    likes
  } = request.body

  // console.log(request.body)
  if (!title || !url) {
    return response.status(400).json({
      error: 'required "title" and "url" fild is missing'
    })
  }

  // El middleware "userExtractor" que ya se ejecuto primero, utilizo el token de la request para obtener
  // el Id del usuario (si es válido) modificando el ID de la request para reeemplazarlo por el token decodificado
  const { userId } = request
  const user = await User.findById(userId)

  const newBlog = new Blog({
    title,
    author,
    url,
    likes: likes === undefined ? 0 : likes,
    user: user._id
  })

  // Almaceno los datos del blog en la base de datos
  const savedBlog = await newBlog.save()
  // console.log({ savedBlog })

  try {
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.get('/:id', async (request, response) => {
  const { id } = request.params

  const blog = await Blog.findById(id)
  console.log({ blog })
  if (blog) return response.json(blog)
  response.status(404).end()
})

blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
  const { id } = request.params
  const { userId } = request
  console.log('Prueba delete')
  console.log({ id })
  console.log({ userId })
  try {
    const user = await User.findById(userId)
    console.log({ user })
    const blog = await Blog.findById(id)
    console.log({ blog })
    if (!blog) return response.status(404).end()
    if (blog.user.toString() === user._id.toString()) {
      await Blog.findByIdAndDelete(id)
      return response.status(204).end()
    }
    return response.status(401).send({ error: 'It is not possible delete Blogs from another user' }).end()
  } catch (error) {
    next(error)
  }
})

// Ahora realizamos la peticion de PUT para modificar contenido
blogsRouter.put('/:id', async (request, response) => {
  const { id } = request.params
  const newBlogInfo = request.body

  const newBlog = await Blog.findByIdAndUpdate(id, newBlogInfo, { new: true })
  if (newBlog) return response.json(newBlog).status(204).end()
  response.status(404).end()
})

module.exports = blogsRouter
