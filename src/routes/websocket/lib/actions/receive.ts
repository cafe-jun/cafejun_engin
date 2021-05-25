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

const actionTypes = ['getId', 'reuseId']

export type ReceiveAction = GetIdAction | ReuseIdAction

export function isReceiveAction(object: any): object is ReceiveAction {
  if (!object?.type) return false
  return actionTypes.includes(object.type)
}
