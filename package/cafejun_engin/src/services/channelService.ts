import { v4 } from 'uuid'
import prisma from '../lib/prisma'

// 세션이 채널에 들어가기 내용이기 때문에 채널에 대한 세션 내용이 트랙킹이 필요함
const channelService = {
  async create() {
    const id = v4()
    const channel = await prisma.channel.create({
      data: {
        id,
      },
    })
    return channel
  },
  async findById(id: string) {
    const channel = await prisma.channel.findUnique({
      where: {
        id,
      },
    })
  },
  async addUser(channelId: string, sessionId: string) {
    //const channelSession
    return prisma.channelSession.create({
      data: {
        channelId,
        sessionId,
      },
    })
  },
  async removeUser(sessionId: string) {
    return prisma.channelSession.deleteMany({
      where: {
        sessionId,
      },
    })
  },
  async listUsers(channelId: string) {
    const channelSessions = await prisma.channelSession.findMany({
      where: {
        channelId,
      },
      include: {
        session: {
          include: {
            user: true,
          },
        },
      },
    })
    const session = channelSessions.map(cs => ({
      id: cs.sessionId,
      user: JSON.parse(cs.session.user.json),
    }))
    return session
  },
}

export default channelService
