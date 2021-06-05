import prisma from '../lib/prisma'

const sessionService = {
  async integrate(sessionId: string, userJSONString: any) {
    const parsed = JSON.parse(userJSONString)
    if (parsed.id === undefined) {
      const e = new Error('There is no id field in user json')
      throw e
    }
    // 사용자 존재 여부
    let user = await prisma.user.findUnique(parsed.id)
    // 없으면 새로 생성
    if (user) {
      await prisma.user.update({
        where: {
          id: parsed.id,
        },
        data: {
          json: userJSONString,
        },
      })
    } else {
      user = await prisma.user.create({
        data: {
          id: parsed.id,
          json: userJSONString,
        },
      })
    }
    // 세션을 만들고 사용자 연동 
    const session = await prisma.session.create({
      data: {
        id: sessionId,
        userId: user.id
      },
      include: { user: true }
    })
    // 세션을 만들고 사용자 연동 


    return session
  },
}

export default sessionService
