import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { Reducers } from '../features'

const rootReducer = combineReducers({
  routing: routerReducer,
  ...Reducers
})

export default rootReducer