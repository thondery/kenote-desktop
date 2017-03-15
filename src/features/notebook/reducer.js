// ------------------------------------
// Reducer
// ------------------------------------
import * as types from './constant'
import initialState from './initialState'
import * as storageService from '../../services/storage'
import _ from 'lodash'
import * as notebookService from '../../proxys/notebook'

const ACTION_HANDLERS = {
  [types.NOTEBOOK_CREATE_START]: (state, action) => {
    return {
      ...state,
      addStart: true,
      addPending: false,
      addError: null,
      addStatus: null
    }
  },
  [types.NOTEBOOK_CREATE_BEGIN]: (state, action) => {
    return {
      ...state,
      addStart: false,
      addPending: true,
      addError: null,
      addStatus: null
    }
  },
  [types.NOTEBOOK_CREATE_SUCCESS]: (state, action) => {
    let { payload } = action
    let { data, status } = payload
    if (status.code === 0) {
      console.log(data)
      state.noteBook.unshift(data)
    }
    console.log(state.noteBook)
    return {
      ...state,
      addPending: false,
      addError: null,
      addStatus: status,
      noteBook: state.noteBook
    }
  },
  [types.NOTEBOOK_CREATE_FAILURE]: (state, action) => {
    let { error } = action
    return {
      ...state,
      addPending: false,
      addError: error,
      addStatus: {
        code: 1000,
        message: '无法连接服务器'
      }
    }
  },
  [types.NOTEBOOK_SETTING_START]: (state, action) => {
    return {
      ...state,
      cogStart: true,
      cogPending: false,
      cogError: null,
      cogStatus: null
    }
  },
  [types.NOTEBOOK_SETTING_BEGIN]: (state, action) => {
    return {
      ...state,
      cogStart: false,
      cogPending: true,
      cogError: null,
      cogStatus: null
    }
  },
  [types.NOTEBOOK_SETTING_SUCCESS]: (state, action) => {
    let { payload } = action
    let { data, status } = payload
    if (status.code === 0) {
      //console.log(data)
      //state.noteBook.unshift(data)
      let updateIndex = _.findIndex(state.noteBook, { _id: data._id })
      state.noteBook[updateIndex] = data

    }
    //console.log(state.noteBook)
    return {
      ...state,
      cogPending: false,
      cogError: null,
      cogStatus: status,
      noteBook: state.noteBook
    }
  },
  [types.NOTEBOOK_SETTING_FAILURE]: (state, action) => {
    let { error } = action
    return {
      ...state,
      cogPending: false,
      cogError: error,
      cogStatus: {
        code: 1000,
        message: '无法连接服务器'
      }
    }
  },
  [types.NOTEBOOK_LIST_BEGIN]: (state, action) => {
    return {
      ...state,
      listPending: true,
      listError: null,
      listStatus: null
    }
  },
  [types.NOTEBOOK_LIST_SUCCESS]: (state, action) => {
    let { payload } = action
    let { data, status } = payload
    let noteBook = []
    if (status.code === 0) {
      noteBook = data
    }
    return {
      ...state,
      listInitial: false,
      listPending: false,
      listError: null,
      listStatus: status,
      noteBook: noteBook
    }
  },
  [types.NOTEBOOK_LIST_FAILURE]: (state, action) => {
    let { error } = action
    return {
      ...state,
      listPending: false,
      listError: error,
      listStatus: {
        code: 1000,
        message: '无法连接服务器'
      }
    }
  },
  [types.NOTEBOOK_ROOT_LIST]: (state, action) => {
    let { payload } = action
    return {
      ...state,
      listInitial: false,
      noteBook: payload
    }
  },
  [types.NOTEBOOK_MERGE_BEGIN]: (state, action) => {
    return {
      ...state,
      mergePending: true
    }
  },
  [types.NOTEBOOK_MERGE_SUCCESS]: (state, action) => {
    return {
      ...state,
      mergePending: false
    }
  },
  [types.NOTEBOOK_MERGE_FAILURE]: (state, action) => {
    return {
      ...state,
      mergePending: false
    }
  },
  [types.NOTEBOOK_LIST_SELECT]: (state, action) => {
    return {
      ...state,
      selectIndex: action.payload
    }
  },
  [types.NOTEBOOK_LIST_JUSTIFY]: (state, action) => {
    return {
      ...state,
      listJustify: action.payload
    }
  },
  [types.NOTEBOOK_LIST_SORTBY]: (state, action) => {
    return {
      ...state,
      listSortBy: action.payload
    }
  },
  [types.NOTEBOOK_LIST_FILTER]: (state, action) => {
    return {
      ...state,
      listFilter: action.payload
    }
  },
  [types.NOTEBOOK_REMOVE_BEGIN]: (state, action) => {
    return {
      ...state,
      removePending: true,
      removeError: null,
      removeStatus: null,
    }
  },
  [types.NOTEBOOK_REMOVE_SUCCESS]: (state, action) => {
    let { payload } = action
    let { data, status } = payload
    let list = state.noteBook
    if (status.code === 0) {
      console.log(data)
      for (let e of data) {
        list = _.filter(list, o => e !== (__DESKTOP__ ? o.clientId : o._id) )
      }
    }
    return {
      ...state,
      removePending: false,
      removeError: null,
      removeStatus: status,
      noteBook: list
    } 
  },
  [types.NOTEBOOK_REMOVE_FAILURE]: (state, action) => {
    let { error } = action
    return {
      ...state,
      removePending: false,
      removeError: error,
      removeStatus: {
        code: 1000,
        message: '无法连接服务器'
      }
    }
  },
}

export default function Reducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}