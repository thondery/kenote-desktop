// ------------------------------------
// Reducer
// ------------------------------------
import * as types from './constant'
import initialState from './initialState'

const ACTION_HANDLERS = {
  [types.NOTES_CHANGE_PARAMS]: (state, action) => {
    return {
      ...state,
      notebook: action.payload
    }
  }
}

export default function Reducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}