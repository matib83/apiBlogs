const blogsRouter = require('express').Router()
const Blog = require('../models/Blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  const newBlog = new Blog(request.body)
  console.log({ newBlog })
  // Extraigo el campo likes, title y url del post del blog
  const {
    title,
    url,
    likes
  } = newBlog

  if (likes === undefined) {
    newBlog.likes = 0
  }

  if (!title || !url) {
    return response.status(400).json({
      error: 'required "title" and "url" fild is missing'
    })
  }
  // Almaceno los datos del blog en la base de datos
  try {
    const savedBlog = await newBlog.save()
    console.log({ savedBlog })
    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.get('/:id', async (request, response, next) => {
  const { id } = request.params

  try {
    const blog = await Blog.findById(id)
    // console.log({ blog })
    if (blog) return response.json(blog)
    response.status(404).end()
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const { id } = request.params

  try {
    await Blog.findByIdAndDelete(id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

// Ahora realizamos la peticion de PUT para modificar contenido
blogsRouter.put('/:id', async (request, response, next) => {
  const { id } = request.params
  const newBlogInfo = request.body

  try {
    const newBlog = await Blog.findByIdAndUpdate(id, newBlogInfo, { new: true })
    if (newBlog) return response.json(newBlog).status(204).end()
    response.status(404).end()
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
