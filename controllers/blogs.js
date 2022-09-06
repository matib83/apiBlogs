const blogsRouter = require('express').Router()
const Blog = require('../models/Blog')
const User = require('../models/User')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  // Extraigo el campo likes, title y url del post del blog
  const {
    title,
    author,
    url,
    likes,
    userId
  } = request.body

  if (!title || !url) {
    return response.status(400).json({
      error: 'required "title" and "url" fild is missing'
    })
  }

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

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
  const { id } = request.params

  const blog = await Blog.findById(id)
  console.log({ blog })
  if (blog) return response.json(blog)
  response.status(404).end()
})

blogsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params

  await Blog.findByIdAndDelete(id)
  response.status(204).end()
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
