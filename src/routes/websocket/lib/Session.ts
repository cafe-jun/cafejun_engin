import { v4 } from 'uuid'

class Session {
  private id: string

  constructor() {
    this.id = v4()
  }
  getId() {
    return this.id
  }
}

export default Session
