import * as httpService from '../services/http'
import * as storageService from '../services/storage'
import * as notebookService from '../proxys/notebook'
import * as deleteService from '../proxys/delete'
import * as syncdataService from '../proxys/syncdata'
import { getToken, setToken, getAuth, setAuth } from '../services/token'
import { rootNoteBookList } from '../features/notebook/action'
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
const ROOT_MAINWINDOW_MODAL_OPENED    = 'ROOT_MAINWINDOW_MODAL_OPENED'
const ROOT_MAINWINDOW_MODAL_CLOSED    = 'ROOT_MAINWINDOW_MODAL_CLOSED'

const ROOT_SYNCDATA_REQUEST_BENGIN    = 'ROOT_SYNCDATA_REQUEST_BENGIN'
const ROOT_SYNCDATA_REQUEST_FAILURE   = 'ROOT_SYNCDATA_REQUEST_FAILURE'
const ROOT_SYNCDATA_REQUEST_SUCCESS   = 'ROOT_SYNCDATA_REQUEST_SUCCESS'

const ROOT_SYNCDATA_TEMPSAVE_BEGIN    = 'ROOT_SYNCDATA_TEMPSAVE_BEGIN'
const ROOT_SYNCDATA_TEMPSAVE_FAILURE  = 'ROOT_SYNCDATA_TEMPSAVE_FAILURE'
const ROOT_SYNCDATA_TEMPSAVE_SUCCESS  = 'ROOT_SYNCDATA_TEMPSAVE_SUCCESS'

const ROOT_SYNCDATA_MERGE_BEGIN       = 'ROOT_SYNCDATA_MERGE_BEGIN'
const ROOT_SYNCDATA_MERGE_FAILURE     = 'ROOT_SYNCDATA_MERGE_FAILURE'
const ROOT_SYNCDATA_MERGE_SUCCESS     = 'ROOT_SYNCDATA_MERGE_SUCCESS'
const ROOT_SYNCDATA_MERGE_PENDING     = 'ROOT_SYNCDATA_MERGE_PENDING'

const ROOT_SYNCDATA_SEND_BENGIN       = 'ROOT_SYNCDATA_SEND_BENGIN'
const ROOT_SYNCDATA_SEND_FAILURE      = 'ROOT_SYNCDATA_SEND_FAILURE'
const ROOT_SYNCDATA_SEND_SUCCESS      = 'ROOT_SYNCDATA_SEND_SUCCESS'

const ROOT_SYNCDATA_ALL_END           = 'ROOT_SYNCDATA_ALL_END'

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
            let notebook = await notebookService.getList(auth._id)
            ret = httpService.createPayload({
              auth,
              notebook: notebook || []
            })
          }
          else {
            let accesstoken = _.has(auth, 'accesskey') && auth.accesskey
            ret = await httpService.post(`/accesstoken`, { accesstoken })
            let { data, status } = ret
            if (status.code === 0) {
              storageService.setItem('auth', {
                ...data.auth,
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
        setToken(null)
        setAuth(null)
        dispatch(httpService.createAction(ROOT_MAINWINDOW_LOGOUT_SUCCESS, ret))
      } catch (error) {
        dispatch(httpService.createAction(ROOT_MAINWINDOW_LOGOUT_FAILURE, error))
      }
    }, 500)
  }
}
export function openModal (name, opts = null) {
  return {
    type: ROOT_MAINWINDOW_MODAL_OPENED,
    payload: {
      name: name,
      opts: opts
    }
  }
}
export function closeModal () {
  return {
    type: ROOT_MAINWINDOW_MODAL_CLOSED
  }
}
// 向服务器发送同步请求
export function syncDataRequest () {
  return dispatch => {
    dispatch(httpService.createAction(ROOT_SYNCDATA_REQUEST_BENGIN, null))
    setTimeout( () => {
      return new Promise(async (resolve, reject) => {
        try {
          let token = getToken()
          let user = getAuth()
          let { lastUpdateCount, lastSyncTime } = await syncdataService.getInfo(user)
          let ret = await httpService.post(`/syncdata`, {
            accesstoken: token,
            lastUpdateCount, 
            lastSyncTime
          })
          if (_.isError(ret)) {
            throw ret
          }
          dispatch(httpService.createAction(ROOT_SYNCDATA_REQUEST_SUCCESS, ret))
          resolve(ret)
        } catch (error) {
          dispatch(httpService.createAction(ROOT_SYNCDATA_REQUEST_FAILURE, error))
          reject(error)
        }
      })
    }, 500)
  }
}
// 暂存临时数据
export function syncTempDataSave () {
  return dispatch => {
    dispatch(httpService.createAction(ROOT_SYNCDATA_TEMPSAVE_BEGIN, null))
    return new Promise(async (resolve, reject) => {
      try {
        let user = getAuth()
        let data = {}
        data.notebook = await notebookService.getListBySync(user)
        data.delete = await deleteService.getDelete(user)
        let ret = httpService.createPayload(data)
        dispatch(httpService.createAction(ROOT_SYNCDATA_TEMPSAVE_SUCCESS, ret))
        resolve(ret)
      } catch (error) {
        dispatch(httpService.createAction(ROOT_SYNCDATA_TEMPSAVE_FAILURE, error))
        reject(error)
      }
    })
  }
}
// 设置合并状态
export function syncMergeData (tag, data = null) {
  const _type = {
    'begin'   : ROOT_SYNCDATA_MERGE_BEGIN,
    'success' : ROOT_SYNCDATA_MERGE_SUCCESS,
    'failure' : ROOT_SYNCDATA_MERGE_FAILURE,
    'pending' : ROOT_SYNCDATA_MERGE_PENDING,
  }
  return httpService.createAction(_type[tag], data)
}

// 向服务器发送更改数据
export function syncDataSend (data) {
  return dispatch => {
    dispatch(httpService.createAction(ROOT_SYNCDATA_SEND_BENGIN, null))
    return new Promise(async (resolve, reject) => {
      try {
        let user = getAuth()
        let token = getToken()
        let ret = await httpService.post(`/syncdata/send`, {
          accesstoken: token,
          payload: data
        })
        dispatch(httpService.createAction(ROOT_SYNCDATA_SEND_SUCCESS, ret))
        resolve(ret)
      } catch (error) {
        dispatch(httpService.createAction(ROOT_SYNCDATA_SEND_FAILURE, error))
        reject(error)
      }
    })
  }
}

// 结束同步操作
export function syncDataAllEnd (lastUpdateCount, lastSyncTime) {
  return {
    type: ROOT_SYNCDATA_ALL_END,
    payload: {
      lastUpdateCount,
      lastSyncTime
    }
  }
}


export const actions = {
  initialMain,
  loginMain,
  logoutMain,
  openModal,
  closeModal,
  syncDataRequest,
  syncTempDataSave,
  syncMergeData,
  syncDataSend,
  syncDataAllEnd,
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
      mainWindowAuth: null,
      noteBookList: []
    }
  },
  [ROOT_MAINWINDOW_INITIAL_SUCCESS]: (state, action) => {
    let { payload } = action
    let { data, status } = payload
    let auth, notebook = []
    if (status.code === 0) {
      auth = data.auth
      notebook = data.notebook
      setToken(auth.accesskey)
      setAuth(auth._id)
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
      mainWindowAuth: auth,
      noteBookList: notebook
    }
  },
  [ROOT_MAINWINDOW_INITIAL_FAILURE]: (state, action) => {
    return {
      ...state,
      offlineMode: true,
      initialMainWidow: false,
      initialMainPending: false,
      initialMainError: 1000,
      initialMainMessage: '无法连接服务器'
    }
  },
  [ROOT_MAINWINDOW_LOGIN_BEGIN]: (state, action) => {
    let { payload } = action
    return {
      ...state,
      loginMainPending: true,
      loginMainError: undefined,
      loginMainMessage: undefined,
      mainWindowAuth: null,
      noteBookList: []
    }
  },
  [ROOT_MAINWINDOW_LOGIN_SUCCESS]: (state, action) => {
    let { payload } = action
    let { data, status } = payload
    let auth
    if (status.code === 0) {
      storageService.setItem('auth', data)
      setToken(data.accesskey)
      setAuth(data._id)
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
  },
  [ROOT_MAINWINDOW_MODAL_OPENED]: (state, action) => {
    let { payload } = action
    return {
      ...state,
      modelOpened: payload.name,
      modelOption: payload.opts
    }
  },
  [ROOT_MAINWINDOW_MODAL_CLOSED]: (state, action) => {
    return {
      ...state,
      modelOpened: undefined,
      modelOption: null
    }
  },
  //
  [ROOT_SYNCDATA_REQUEST_BENGIN]: (state, action) => {
    return {
      ...state,
      syncPending: true,
      syncProgress: 'pull:begin',
      syncError: null,
    }
  },
  [ROOT_SYNCDATA_REQUEST_SUCCESS]: (state, action) => {
    let { payload } = action
    let { data, status } = payload
    let opts = null
    if (status.code == 0) {
      opts = {
        syncPending: true,
        syncPullData: data,
        syncProgress: 'pull:after',
      }
    }
    else {
      opts = {
        syncPending: false,
        syncPullData: null,
        syncProgress: 'end',
        syncError: status,
      }
    }
    return {
      ...state,
      ...opts
    }
  },
  [ROOT_SYNCDATA_REQUEST_FAILURE]: (state, action) => {
    let { error } = action
    return {
      ...state,
      syncPending: false,
      syncPullData: null,
      syncProgress: 'end',
      syncError: error,
    }
  },
  [ROOT_SYNCDATA_TEMPSAVE_BEGIN]: (state, action) => {
    return {
      ...state,
      syncPending: true,
      syncTempData: null,
      syncProgress: 'temp:begin',
      syncError: null,
    }
  },
  [ROOT_SYNCDATA_TEMPSAVE_SUCCESS]: (state, action) => {
    let { payload } = action
    let { data, status } = payload
    let opts = null
    if (status.code == 0) {
      opts = {
        syncPending: true,
        syncTempData: data,
        syncProgress: 'temp:after',
      }
    }
    else {
      opts = {
        syncPending: false,
        syncTempData: null,
        syncProgress: 'end',
        syncError: status,
      }
    }
    return {
      ...state,
      ...opts
    }
  },
  [ROOT_SYNCDATA_TEMPSAVE_FAILURE]: (state, action) => {
    let { error } = action
    return {
      ...state,
      syncPending: false,
      syncProgress: 'end',
      syncError: error,
    }
  },
  [ROOT_SYNCDATA_MERGE_BEGIN]: (state, action) => {
    return {
      ...state,
      syncPending: true,
      syncProgress: 'merge:begin',
      syncError: null,
    }
  },
  [ROOT_SYNCDATA_MERGE_PENDING]: (state, action) => {
    let { payload } = action
    return {
      ...state,
      syncPending: true,
      syncProgress: `merge:pending:${payload}`,
      syncError: null,
    }
  },
  [ROOT_SYNCDATA_MERGE_SUCCESS]: (state, action) => {
    let { payload } = action
    return {
      ...state,
      syncPending: true,
      syncProgress: 'merge:after',
      syncError: null,
    }
  },
  [ROOT_SYNCDATA_MERGE_FAILURE]: (state, action) => {
    let { error } = action
    return {
      ...state,
      syncPending: false,
      syncProgress: 'end',
      syncError: error,
    }
  },
  [ROOT_SYNCDATA_SEND_BENGIN]: (state, action) => {
    return {
      ...state,
      syncPending: true,
      syncProgress: 'push:begin',
      syncError: null,
    }
  },
  [ROOT_SYNCDATA_SEND_SUCCESS]: (state, action) => {
    let { payload } = action
    let { data, status } = payload
    let opts = null
    if (status.code == 0) {
      opts = {
        syncPending: true,
        syncProgress: 'push:after',
        //lastUpdateCount: data.updateCount,
        //lastSyncTime: data.fullSyncBefore,
        syncPushReslut: data
      }
    }
    else {
      opts = {
        syncPending: false,
        syncProgress: 'end',
        syncError: status,
      }
    }
    return { ...state, ...opts }
  },
  [ROOT_SYNCDATA_SEND_FAILURE]: (state, action) => {
    let { error } = action
    return {
      ...state,
      syncPending: false,
      syncProgress: 'end',
      syncError: error,
    }
  },
  [ROOT_SYNCDATA_ALL_END]: (state, action) => {
    let { payload } = action
    return {
      ...state,
      ...payload,
      syncTempData: null,
      syncPending: false,
      syncPullData: null,
      syncPushReslut: null,
      syncProgress: 'end',
      syncError: null,
    }
  },
  //
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
  modelOpened: undefined,
  modelOption: null,
  noteBookList: [],
  //
  syncTempData: null,  // 向服务器同步时暂存的临时数据
  lastUpdateCount: 0,  // 最后向服务器更新的USN
  lastSyncTime: 0,   // 最后向服务器更新的时间戳
  syncPending: false,   // 是否在同步中
  syncPullData: null,   // 同步拉取的数据
  syncPushReslut: null,  // 推送服务器返回数据
  syncLog: [],   // 同步日志
  syncProgress: 'end',   // begin => 开始 | pull => 拉取 | marge => 合并 | diff => 解决冲突 | push => 推送 | end => 结束
  syncError: null,   // 同步错误
  //
  
}

export default function rootReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}