import { v4 } from 'uuid'
import WebSocket = require('ws')
import { Message, ReceiveAction } from './actions/receive'
import actionCreators from './actions/send'
import { createHmac } from 'crypto'
import subscription from './redis/subscription'
import channelHelper from './channelHelper'
import prefixer from './redis/prefixer'
import rtcHelper from './rtcHelper'
import { Description } from './actions/common'
import sessionService from '../../services/sessionService'
import channelService from '../../services/channelService'

const { SESSION_SECRET_KEY } = process.env

if (!SESSION_SECRET_KEY) {
  console.warn('SESSION_SECRET_KEY is not defined')
}

class Session {
  id: string
  private token: string
  private currentChannel: string | null = null
  // 함수의 비어있는 배열
  private unsubscriptionMap = new Map<string, () => void>()
  // 세션이 끊길때 사용
  //  private subscribedTo: Set<string> = new Set()

  constructor(private socket: WebSocket) {
    this.id = v4()
    this.token = createHmac('sha256', SESSION_SECRET_KEY!)
      .update(this.id)
      .digest('hex')
    this.informConnected()
  }

  sendJSON(data: any) {
    this.socket.send(JSON.stringify(data))
  }

  private informConnected() {
    const action = actionCreators.connected(this.id, this.token)
    this.sendJSON(action)
  }

  // getId() {
  //   return this.id
  // }
  handle(action: ReceiveAction) {
    switch (action.type) {
      case 'getId': {
        this.handleGetId()
        break
      }
      case 'reuseId': {
        break
      }
      case 'subscribe': {
        this.handleSubscribe(action.type)
        //console.log(`action.key : :${action.key}  , this : ${this}`)
        //console.dir(this)
        // subscription.subscribe(action.key, this)
        break
      }
      case 'unsubscribe': {
        this.handleUnsubscribe(action.key)
        break
      }
      case 'enter': {
        this.handleEnter(action.channel)
        break
      }
      case 'leave': {
        this.handleLeave()
        break
      }
      case 'message': {
        this.handleMessage(action.message)
        break
      }
      case 'listSessions': {
        this.handleListSessions()
        break
      }
      case 'call': {
        this.handleCall(action.to, action.description)
        break
      }
      case 'answer': {
        this.handleAnswer(action.to, action.description)
        break
      }
      case 'candidate': {
        this.handleCandidate(action.to, action.candidate)
        break
      }
    }
  }
  subscriibe(key: string) {
    const unsubscribe = subscription.subscribe(key, this)
    this.unsubscriptionMap.set(key, unsubscribe)
  }
  unsubscribe(key: string) {
    const unsubscribe = this.unsubscriptionMap.get(key)
    unsubscribe?.()
    //subscription.unsubscribe(key, this)
    this.unsubscriptionMap.delete(key)
  }
  private handleGetId(): void {
    const action = actionCreators.getIdSuccess(this.id)
    this.sendJSON(action)
  }
  private handleSubscribe(key: string) {
    this.subscriibe(key)
    // const unsubscribe = subscription.subscribe(key, this)
    // this.unsubscriptionMap.set(key, unsubscribe)
    const action = actionCreators.subscriptionSuccess(key)
    this.sendJSON(action)
  }

  private handleUnsubscribe(key: string) {
    this.unsubscribe(key)
    // subscription.unsubscribe(key, this)
    // this.unsubscriptionMap.delete(key)
  }

  private async handleEnter(channelId: string) {
    //const key = `channel:${channel}`
    // const unsubscribe = subscription.subscribe(key, this)
    // this.unsubscriptionMap.set(key, unsubscribe)
    // // subscribe direct

    // const directKey = prefixer.direct(this.id)
    // const unsubscribeDirect = subscription.subscribe(directKey, this)
    // this.unsubscriptionMap.set(directKey, unsubscribeDirect)

    // subscribe public
    const channel = channelService.findById(channelId)
    if (!channel) {
      // TODO:: send Error 
      return
    }
    const user = await sessionService.getUserBySessionId(this.id)
    if (!user) {
      // TODO: send Error
      return
    }
    this.subscriibe(prefixer.channel(channelId))
    //this.subscriibe(prefixer.direct(this.id))

    channelHelper.enter(channelId, this.id, user)
    this.currentChannel = channelId
  }
  private handleLeave() {
    if (!this.currentChannel) return
    this.unsubscribe(prefixer.channel(this.currentChannel))
    this.unsubscribe(prefixer.direct(this.id))

    // const key = prefixer.channel(this.currentChannel)
    // const unsubscribe = this.unsubscriptionMap.get(key)
    // unsubscribe?.()
    // this.unsubscriptionMap.delete(key)

    // subscription.unsubscribe(`channel:${this.currentChannel}`, this)

    channelHelper.leave(this.currentChannel, this.id)
    this.currentChannel = null
  }

  handleCall(to: string, description: Description) {
    rtcHelper.call({
      from: this.id,
      to,
      description,
    })
  }

  handleAnswer(to: string, description: Description) {
    rtcHelper.answer({
      from: this.id,
      to,
      description,
    })
  }
  handleCandidate(to: string, candidate: any) {
    rtcHelper.candidate({
      from: this.id,
      to,
      candidate,
    })
  }

  private handleMessage(message: Message) {
    console.log(message, this.currentChannel)
    if (!this.currentChannel) return
    channelHelper.message(this.currentChannel, this.id, message)
  }

  async handleListSessions() {
    // 채널이 없으면 아무것도 안하게 한다
    if (!this.currentChannel) return
    try {
      const sessions = await channelHelper.listSessions(this.currentChannel)
      this.sendJSON(actionCreators.listSessionsSuccess(sessions))
    } catch (e) {
      console.error(e)
    }
  }
  // channel 구독 해지
  // redis sessions 에서sessionId 제거하기
  dispose() {
    const fns = Array.from(this.unsubscriptionMap.values())
    fns.forEach(fn => fn())
    // unsubscribe
    // remove from channel
    if (!this.currentChannel) return
    channelHelper.leave(this.currentChannel, this.id)
  }

  public sendSubscriptionMessage(key: string, message: any) {
    // direct
    // if (/^direct:/.test(key)) {
    //   return
    // }
    //const action = actionCreators.subscriptionMessage(key, message)
    //this.sendJSON(action)
    this.sendJSON(message)
  }
}

export default Session
