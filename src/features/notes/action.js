// ------------------------------------
// Actions
// ------------------------------------
import * as types from './constant'

export function changeParams (value) {
  return {
    type: types.NOTES_CHANGE_PARAMS,
    payload: value
  }
}