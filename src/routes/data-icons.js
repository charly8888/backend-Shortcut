import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid'
async function routeDB(fastify, options) {
  const collectionDataIcons = fastify.mongo.db.collection('dataIcons')

  fastify.get('/iconsData/:userName', async (request, reply) => {
    const authorization = request.headers.authorization.slice(8, -1)
    console.log(request.params.userName, request.headers.authorization)
    console.log("auth",authorization)
    let verificacion = null
    try {
      verificacion = jwt.verify(authorization, '1234')
    } catch (err) {
      console.error('err', err)
    }

    console.log('soniguales', verificacion)
    if (verificacion.user === request.params.userName) {
      console.log('los usuarios coinciden')

      const result = await collectionDataIcons.findOne({
        user: request.params.userName,
      })

      if (!result) {
        throw new Error('No documents found')
      }
      return result
    }
  })

  const animalBodyJsonSchema = {
    type: 'object',
    required: ['info', 'user'],
    properties: {
      info: { type: 'array' },
      user: { type: 'string' },
    },
  }

  const schema = {
    body: animalBodyJsonSchema,
  }

  fastify.post('/setInfo', { schema }, async (request, reply) => {
    const _id = nanoid()
    const result = await collectionDataIcons.insertOne({
      _id,
      info: request.body.info,
      user: request.body.user,
    })
    return result
  })

  fastify.delete('/setInfo/:userName', async (request, reply) => {
    const result = await collectionDataIcons.findOneAndDelete({
      user: request.params.userName,
    })
    return result
  })
}

export default routeDB
