/**
 * actions that server sends
 */

type connectedAction = {
  type: 'connected'
  id: string
  token: string
}

type GetIdSuccessAction = {
  type: 'getIdSuccess'
  id: string
}

type ReuseIdSuccessAction = {
  type: 'reuseIdSuccess'
}

export type sendAction = connectedAction | ReuseIdSuccessAction

const actionCreators = {
  connected: (id: string, token: string): connectedAction => ({
    type: 'connected',
    id,
    token,
  }),

  getIdSuccess: (id: string): GetIdSuccessAction => ({
    type: 'getIdSuccess',
    id: id,
  }),
  reuseIdSuccess: (): ReuseIdSuccessAction => ({
    type: 'reuseIdSuccess',
  }),
}

export default actionCreators
