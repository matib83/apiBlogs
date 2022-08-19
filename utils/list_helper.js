const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if (blogs === (null || undefined)) return 0
  let sumLikes = 0
  blogs.forEach(blog => { sumLikes += blog.likes })
  return sumLikes
}

module.exports = {
  dummy,
  totalLikes
}
