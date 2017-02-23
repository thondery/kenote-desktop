import * as httpService from '../services/http'
import * as storageService from '../services/storage'
import _ from 'lodash'
// ------------------------------------
// Constants
// ------------------------------------
const ROOT_MAINWINDOW_INITIAL_BEGIN   = 'ROOT_MAINWINDOW_INITIAL_BEGIN'
const ROOT_MAINWINDOW_INITIAL_FAILURE = 'ROOT_MAINWINDOW_INITIAL_FAILURE'
const ROOT_MAINWINDOW_INITIAL_SUCCESS = 'ROOT_MAINWINDOW_INITIAL_SUCCESS'
const ROOT_MAINWINDOW_LOGIN_BEGIN     = 'ROOT_MAINWINDOW_LOGIN_BEGIN'
const ROOT_MAINWINDOW_LOGIN_FAILURE   = 'ROOT_MAINWINDOW_LOGIN_FAILURE'
const ROOT_MAINWINDOW_LOGIN_SUCCESS   = 'ROOT_MAINWINDOW_LOGIN_SUCCESS'
const ROOT_MAINWINDOW_LOGOUT_BEGIN    = 'ROOT_MAINWINDOW_LOGOUT_BEGIN'
const ROOT_MAINWINDOW_LOGOUT_FAILURE  = 'ROOT_MAINWINDOW_LOGOUT_FAILURE'
const ROOT_MAINWINDOW_LOGOUT_SUCCESS  = 'ROOT_MAINWINDOW_LOGOUT_SUCCESS'

// ------------------------------------
// Actions
// ------------------------------------
export function initialMain () {
  return dispatch => {
    dispatch(httpService.createAction(ROOT_MAINWINDOW_INITIAL_BEGIN, null))
    setTimeout( () => {
      return new Promise(async (resolve, reject) => {
        try {
          let auth = await storageService.getItem('auth')
          let ret
          if (__DESKTOP__) {
            ret = httpService.createPayload(auth)
          }
          else {
            let accesstoken = _.has(auth, 'accesskey') && auth.accesskey
            ret = await httpService.post(`/accesstoken`, { accesstoken })
            let { data, status } = ret
            if (status.code === 0) {
              storageService.setItem('auth', {
                ...data,
                accesskey: accesstoken
              })
            }
          }
          if (_.isError(ret)) {
            throw ret
          }
          dispatch(httpService.createAction(ROOT_MAINWINDOW_INITIAL_SUCCESS, ret))
          resolve(ret)
        } catch (error) {
          dispatch(httpService.createAction(ROOT_MAINWINDOW_INITIAL_FAILURE, error))
          reject(error)
        }
      })
    }, 500)
  }
}
export function loginMain (username, password) {
  return dispatch => {
    dispatch(httpService.createAction(ROOT_MAINWINDOW_LOGIN_BEGIN, null))
    setTimeout( () => {
      return new Promise(async (resolve, reject) => {
        try {
          let ret = await httpService.post(`/login`, { username, password })
          if (_.isError(ret)) {
            throw ret
          }
          dispatch(httpService.createAction(ROOT_MAINWINDOW_LOGIN_SUCCESS, ret))
          resolve(ret)
        } catch (error) {
          dispatch(httpService.createAction(ROOT_MAINWINDOW_LOGIN_FAILURE, error))
          reject(error)
        }
      })
    }, 500)
  }
}
export function logoutMain () {
  return dispatch => {
    dispatch(httpService.createAction(ROOT_MAINWINDOW_LOGOUT_BEGIN, null))
    setTimeout( () => {
      try {
        let ret = null
        storageService.removeItem('auth')
        dispatch(httpService.createAction(ROOT_MAINWINDOW_LOGOUT_SUCCESS, ret))
      } catch (error) {
        dispatch(httpService.createAction(ROOT_MAINWINDOW_LOGOUT_FAILURE, error))
      }
    }, 500)
  }
}
export const actions = {
  initialMain,
  loginMain,
  logoutMain
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [ROOT_MAINWINDOW_INITIAL_BEGIN]: (state, action) => {
    return {
      ...state,
      offlineMode: true,
      initialMainWidow: true,
      initialMainPending: true,
      initialMainError: undefined,
      initialMainMessage: undefined,
      mainWindowAuth: null
    }
  },
  [ROOT_MAINWINDOW_INITIAL_SUCCESS]: (state, action) => {
    let { payload } = action
    let { data, status } = payload
    let auth
    if (status.code === 0) {
      auth = data
    }
    else {
      //storageService.removeItem('auth')
    }
    return {
      ...state,
      offlineMode: false,
      initialMainWidow: false,
      initialMainPending: false,
      initialMainError: status.code,
      initialMainMessage: status.message,
      mainWindowAuth: auth
    }
  },
  [ROOT_MAINWINDOW_INITIAL_FAILURE]: (state, action) => {
    return {
      ...state,
      offlineMode: true,
      initialMainWidow: false,
      initialMainPending: false,
      initialMainError: 1000,
      initialMainMessage: '无法连接服务器',
      mainWindowAuth: null
    }
  },
  [ROOT_MAINWINDOW_LOGIN_BEGIN]: (state, action) => {
    let { payload } = action
    return {
      ...state,
      loginMainPending: true,
      loginMainError: undefined,
      loginMainMessage: undefined,
      mainWindowAuth: null
    }
  },
  [ROOT_MAINWINDOW_LOGIN_SUCCESS]: (state, action) => {
    let { payload } = action
    let { data, status } = payload
    let auth
    if (status.code === 0) {
      storageService.setItem('auth', data)
      auth = data
    }
    return {
      ...state,
      loginMainPending: false,
      loginMainError: status.code,
      loginMainMessage: status.message,
      mainWindowAuth: auth
    }
  },
  [ROOT_MAINWINDOW_LOGIN_FAILURE]: (state, action) => {
    console.log('kkk')
    return {
      ...state,
      loginMainPending: false,
      loginMainError: 1000,
      loginMainMessage: '无法连接服务器',
      mainWindowAuth: null
    }
  },
  [ROOT_MAINWINDOW_LOGOUT_BEGIN]: (state, action) => {
    return {
      ...state,
      logoutMainPending: true
    }
  },
  [ROOT_MAINWINDOW_LOGOUT_SUCCESS]: (state, action) => {
    return {
      ...state,
      logoutMainPending: false,
      mainWindowAuth: null
    }
  },
  [ROOT_MAINWINDOW_LOGOUT_FAILURE]: (state, action) => {
    return {
      ...state,
      logoutMainPending: false
    }
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  offlineMode: true,
  initialMainWidow: true,
  initialMainPending: false,
  initialMainError: undefined,
  initialMainMessage: undefined,
  mainWindowAuth: null,
  loginMainPending: false,
  loginMainError: undefined,
  loginMainMessage: undefined,
  logoutMainPending: false,
}

export default function rootReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}