import { v4 } from 'uuid'
import WebSocket = require('ws')
import { Message, ReceiveAction } from './actions/receive'
import actionCreators from './actions/send'
import { createHmac } from 'crypto'
import { globalSubscriber } from './redis/createRedisClient'
import subscription from './redis/subscription'
import channelHelper from './channelHelper'

const { SESSION_SECRET_KEY } = process.env

if (!SESSION_SECRET_KEY) {
  console.warn('SESSION_SECRET_KEY is not defined')
}

class Session {
  id: string
  private token: string
  private currentChannel: string | null = null
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
        console.log('what')
        this.handleLeave()
        break
      }
      case 'message': {
        this.handleMessage(action.message)
        break
      }
    }
  }
  private handleGetId(): void {
    const action = actionCreators.getIdSuccess(this.id)
    this.sendJSON(action)
  }
  private handleSubscribe(key: string) {
    subscription.subscribe(key, this)
    const action = actionCreators.subscriptionSuccess(key)
    this.sendJSON(action)
  }

  private handleUnsubscribe(key: string) {
    subscription.unsubscribe(key, this)
  }

  private handleEnter(channel: string) {
    subscription.subscribe(`channel:${channel}`, this)
    channelHelper.enter(channel, this.id)
    this.currentChannel = channel
  }
  private handleLeave() {
    console.log('여기 출력')
    if (!this.currentChannel) return
    subscription.unsubscribe(`channel:${this.currentChannel}`, this)
    channelHelper.leave(this.currentChannel, this.id)
    this.currentChannel = null
  }

  private handleMessage(message: Message) {
    console.log(message, this.currentChannel)
    if (!this.currentChannel) return
    channelHelper.message(this.currentChannel, this.id, message)
  }

  public sendSubscriptionMessage(key: string, message: any) {
    const action = actionCreators.subscriptionMessage(key, message)
    this.sendJSON(action)
  }
}

export default Session
