const ERROR_HANDLERS = {
  CastError: res =>
    res.status(400).send({ error: 'id used is malformed' }), // error por una solicitud desconocida

  defaultError: res => res.status(500).end() // Error de nuestro servidor
}

module.exports = (error, request, response, next) => {
  console.log('Entrando al handleError')
  console.log(request.path) // Puedo saBER QUE PATH ME ESTAN PIDIENDO ACCEDER
  console.error({ error }) // esto normalmente se envía a un servicio o sitio para saber que ocurrio algo
  console.error(error.name) // Lo utiliza para ver que error esta llegando
  const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError

  handler(response, error)
}
