const blogsRouter = require('express').Router()
const Blog = require('../models/Blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const newBlog = new Blog(request.body)
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
  console.log({ newBlog })
  // Almaceno los datos del blog en la base de datos
  const saveBlog = await newBlog.save()
  response.status(201).json(saveBlog)
})

blogsRouter.get('/:id', async (request, response) => {
  const { id } = request.params
  console.log({ id })

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

module.exports = blogsRouter
