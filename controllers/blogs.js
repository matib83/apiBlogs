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
  const savedBlog = await newBlog.save()
  console.log({ savedBlog })
  response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (request, response, next) => {
  const { id } = request.params

  const blog = await Blog.findById(id)
  // console.log({ blog })
  if (blog) return response.json(blog)
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const { id } = request.params

  await Blog.findByIdAndDelete(id)
  response.status(204).end()
})

// Ahora realizamos la peticion de PUT para modificar contenido
blogsRouter.put('/:id', async (request, response, next) => {
  const { id } = request.params
  const newBlogInfo = request.body

  const newBlog = await Blog.findByIdAndUpdate(id, newBlogInfo, { new: true })
  if (newBlog) return response.json(newBlog).status(204).end()
  response.status(404).end()
})

module.exports = blogsRouter
