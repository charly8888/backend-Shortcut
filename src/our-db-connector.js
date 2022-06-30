import fastifyMongo from '@fastify/mongodb'

async function dbConnector(fastify, options) {
  fastify.register(fastifyMongo, {
    url: 'mongodb://localhost:27017/data',
  })
}
export default dbConnector
