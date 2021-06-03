import { FastifyPluginAsync } from 'fastify'

const sessions: FastifyPluginAsync = async fastify => {
  fastify.get('/', async (request, reply) => {})
}

export default sessions
