import fastify, { FastifyPluginAsync } from 'fastify'
import { IntegreatSessionParams } from '../../schema-types/sessions/integrate/params'
import IntegrateSessionParamsSchema from '../../schemas/sessions/integrate/params.json'
import { IntegreatSessionBody } from '../../schema-types/sessions/integrate/body'
import IntegrateSessionBodySchema from '../../schemas/sessions/integrate/body.json'
import sessionService from '../../services/sessionService'


const sessions: FastifyPluginAsync = async fastify => {
  //fastify.get('/', async (request, reply) => {})
  fastify.post<{ Params: IntegreatSessionParams; Body: IntegreatSessionBody }>('/:id', {
    schema: {
      description: 'Integreat user data to sessionyou can put any object type for user data schema\n User data must contain `id` field',
      params: IntegrateSessionParamsSchema,
      body: IntegrateSessionBodySchema
    },
  }, async (request) => {
    const { id } = request.params
    const { body } = request
    const userJSONString = JSON.stringify(body)
    sessionService.integrate(id, userJSONString)
    console.log(request.params.id, request.body)
    return 'hello world'
  })
}


export default sessions

