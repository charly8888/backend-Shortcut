import { nanoid } from 'nanoid'

async function dataUsers(fastify, options) {
  const collectionDataUsers = fastify.mongo.db.collection('dataUsers')

  fastify.get('/getUser/:user/:password', async (request, reply) => {
    console.log(request.params.user)
    const result = await collectionDataUsers.findOne({
      user: request.params.user,
      password: request.params.password,
    })

    if (!result) {
      reply
        .status(404)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send({ message: 'Usuario y/o contraseña no coinciden' })
    } else {
      return result
    }
  })

  const setUserBodyJsonSchema = {
    type: 'object',
    required: ['user', 'password'],
    properties: {
      user: { type: 'string' },
      password: { type: 'string' },
    },
  }

  const schema = {
    body: setUserBodyJsonSchema,
  }

  fastify.post('/setUser', { schema }, async (request, reply) => {
    const _id = nanoid()
    // console.log(request.body)
    const exist = await uxisteEsteUSer(request.body.user, collectionDataUsers)
    // console.log('existe el user?', exist)
    if (!exist) {
      const result = await collectionDataUsers.insertOne({
        _id,
        user: request.body.user,
        password: request.body.password,
      })
      return result
    } else {
      reply.status(409).send({ ErrorMessage: 'el usuario ya existe' })
    }
  })
}

async function uxisteEsteUSer(user, collectionDataUsers) {
  const result = await collectionDataUsers.findOne({ user })
  if (result) {
    // console.log('log', result)
    if (result.user === user) return true
  } else {
    return false
  }
}

export default dataUsers
