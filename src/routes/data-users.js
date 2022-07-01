import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid'
async function dataUsers(fastify, options) {
  const collectionDataUsers = fastify.mongo.db.collection('dataUsers')

  fastify.post('/getUser', async (request, reply) => {
    console.log(request.body)

    const result = await collectionDataUsers.findOne({
      user: request.body.user,
    })

    if (!result) {
      reply
        .status(404)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send({ message: 'Usuario y/o contraseña no coinciden' })
    } else if (result) {
      const pswHash = result.password
      // console.log('pswHash', pswHash)
      const iguales = await bcryptjs.compare(request.body.password, pswHash)
      console.log('¿Son iguales?', iguales)

      if (!iguales) {
        reply
          .status(404)
          .header('Content-Type', 'application/json; charset=utf-8')
          .send({ message: 'Usuario y/o contraseña no coinciden' })
      } else {
        const payload = {
          user: result.user,
          idUser: result._id,
        }

        const token = jwt.sign(payload, '1234')

        return {
          user: result.user,
          jwt: token,
        }
      }
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
    const password = request.body.password
    const user = request.body.user
    const hashedPassword = await bcryptjs.hash(password, 10)
    // console.log('password hasheada ', hashedPassword)
    const exist = await uxisteEsteUSer(request.body.user, collectionDataUsers)
    // console.log('existe el user?', exist)
    if (!exist) {
      const result = await collectionDataUsers.insertOne({
        _id,
        user,
        password: hashedPassword,
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
