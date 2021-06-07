/**
 * actions that server receives
 */

import { Description } from './common'

/**
 * 사용자가 접속을 하게 되면 해당 아이디에 맞는 토큰 발급
 * 재접속을 하게 될때는 자기가 들고 있던 Id를 그대로 사용할수 있게
 */

type GetIdAction = {
  type: 'getId'
  id: string
  token: string
}

type ReuseIdAction = {
  type: 'reuseId'
  id: string
  token: string
}

type SubscribeAction = {
  type: 'subscribe'
  key: string
}

type UnsubscribeAction = {
  type: 'unsubscribe'
  key: string
}

type EnterAction = {
  type: 'enter'
  channel: string
}

type LeaveAction = {
  type: 'leave'
}

// 예외적으로 따로 함
type MessageAction = {
  type: 'message'
  message: Message
}

type ListSessionAction = {
  type: 'listSessions'
}
type CallAction = {
  type: 'call'
  to: string
  description: Description
}

type AnswerAction = {
  type: 'answer'
  to: string
  description: Description
}

type CandidatedAciton = {
  type: 'candidate'
  to: string
  candidate: any
}

const actionTypes = [
  'getId',
  'reuseId',
  'subscribe',
  'unsubscribe',
  'enter',
  'leave',
  'message',
  'listSessions',
  'call',
  'answer',
  'candidate',
]

export type Message =
  | {
      type: 'text'
      text: string
    }
  | {
      type: 'mute'
      value: boolean
    }
  | {
      type: 'custom'
      value: any
    }

export type ReceiveAction =
  | GetIdAction
  | ReuseIdAction
  | SubscribeAction
  | UnsubscribeAction
  | EnterAction
  | LeaveAction
  | MessageAction
  | ListSessionAction
  | CallAction
  | AnswerAction
  | CandidatedAciton

export function isReceiveAction(object: any): object is ReceiveAction {
  if (!object?.type) return false
  return actionTypes.includes(object.type)
}
