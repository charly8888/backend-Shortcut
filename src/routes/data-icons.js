import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid'

function confirmarAutorizacion(request) {
  const authorization = request.headers.authorization.slice(8, -1)
  let verificacion = null
  try {
    verificacion = jwt.verify(authorization, process.env.JWT_TOKEN)
  } catch (err) {
    console.error('err', err)
  }
  return verificacion
}

async function routeDB(fastify, options) {
  const collectionDataIcons = fastify.mongo.db.collection('dataIcons')

  fastify.get('/iconsData/:userName', async (request, reply) => {
    // console.log(request.params.userName, request.headers.authorization)
    // console.log('auth', authorization)
    const verificacion = confirmarAutorizacion(request)
    // console.log('soniguales', verificacion)
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

  const schemaForIcons = {
    type: 'object',
    required: ['info', 'user'],
    properties: {
      info: { type: 'array' },
      user: { type: 'string' },
    },
  }

  const schema = {
    body: schemaForIcons,
  }

  fastify.put('/setInfo/:userName', { schema }, async (request, reply) => {
    const verificacion = confirmarAutorizacion(request)
    console.log(request.params.userName)
    // console.log(request.body.user)
    if (verificacion.user === request.params.userName) {
      try {
        const findDocument = await collectionDataIcons.findOne({
          user: request.params.userName,
        })
        // console.log(findDocument)

        if (!findDocument) {
          const _id = nanoid()
          console.log('no existe el documento')
          const result = await collectionDataIcons.insertOne({
            _id,
            info: request.body.info,
            user: request.params.userName,
          })
          return result
        } else {

          const update = await collectionDataIcons.updateOne(
            { user: request.params.userName },
            {
             $set:{
               info: request.body.info,
             }
            }
          )
          console.log('result existente', update)
          return update
        }
      } catch (error) {
        console.log(error)
      }

      // console.log('los usuarios coinciden')
    }
  })

  fastify.delete('/setInfo/:userName', async (request, reply) => {
    const result = await collectionDataIcons.findOneAndDelete({
      user: request.params.userName,
    })
    return result
  })
}

export default routeDB
