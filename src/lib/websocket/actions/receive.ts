/**
 * actions that server receives
 */

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

const actionTypes = [
  'getId',
  'reuseId',
  'subscribe',
  'unsubscribe',
  'enter',
  'leave',
  'message',
  'listSessions',
]
// 예외적으로 따로 함
type MessageAction = {
  type: 'message'
  message: Message
}

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

type LIST_SESSIONS = {
  type: 'listSessions'
}

export type ReceiveAction =
  | GetIdAction
  | ReuseIdAction
  | SubscribeAction
  | UnsubscribeAction
  | EnterAction
  | LeaveAction
  | MessageAction
  | LIST_SESSIONS

export function isReceiveAction(object: any): object is ReceiveAction {
  if (!object?.type) return false
  return actionTypes.includes(object.type)
}
