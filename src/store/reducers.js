import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { Reducers } from '../features'
import appReducer from '../containers/reducer'

const rootReducer = combineReducers({
  routing         : routerReducer,
  Root            : appReducer,
  ...Reducers
})

export default rootReducer