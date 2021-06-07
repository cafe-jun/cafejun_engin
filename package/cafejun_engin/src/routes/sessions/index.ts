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
      description: 'Integrate user data to session.\nUse this API to create or update the session.',
      params: IntegrateSessionParamsSchema,
      body: IntegrateSessionBodySchema
    },
  }, async (request) => {
    const { id } = request.params
    const { body } = request
    const userJSONString = JSON.stringify(body)
    return sessionService.integrate(id, userJSONString)
    // console.log(request.params.id, request.body)
    // return 'hello world'`
  })
}


export default sessions

