import { FastifyPluginAsync } from 'fastify'
import channelService from '../../services/channelService'
import { channel } from 'diagnostic_channel'

const channels: FastifyPluginAsync = async fastify => {
    fastify.post('/', {
        schema: {
            description: 'create channel',
            response: {
                200: {
                    description: 'success response',
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string'
                        },
                    },
                    example: {
                        id: 'c7fcff7d-4dd6-4e43-b4ae-18b1138a8216',
                    }
                },
            },
        },
    },
        async () => {
            return channelService.create()
        })
}

export default channel