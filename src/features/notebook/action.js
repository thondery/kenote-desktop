// ------------------------------------
// Actions
// ------------------------------------
import * as types from './constant'
import * as httpService from '../../services/http'
import { getToken, getAuth } from '../../services/token'
import _ from 'lodash'
import * as Tools from '../../common/tools'
import moment from 'moment'
import * as notebookService from '../../proxys/notebook'

export function addNoteBookStart () {
  return {
    type: types.NOTEBOOK_CREATE_START
  }
}
export function addNoteBook (name) {
  return dispatch => {
    dispatch(httpService.createAction(types.NOTEBOOK_CREATE_BEGIN, null))
    setTimeout( () => {
      return new Promise(async (resolve, reject) => {
        try {
          let ret
          if (__DESKTOP__) {
            let user = getAuth()
            let isUnique = await notebookService.findOne({ name: name, user: user })
            if (isUnique) {
              ret = httpService.createPayload(null, {
                code: 1204,
                message: '笔记本名已存在'
              })
            }
            else {
              let notebook = await notebookService.addNotebook({
                name: name, 
                user: user
              })
              ret = httpService.createPayload(notebook)
            }
          }
          else {
            let token = getToken()
            ret = await httpService.post('/notebook/create', {
              accesstoken: token,
              name
            })
          }
          if (_.isError(ret)) {
            throw ret
          }
          dispatch(httpService.createAction(types.NOTEBOOK_CREATE_SUCCESS, ret))
          resolve(ret)
        } catch (error) {
          dispatch(httpService.createAction(types.NOTEBOOK_CREATE_FAILURE, error))
          reject(error)
        }
      })
    }, 500)
  }
}

export function cogNoteBookStart () {
  return {
    type: types.NOTEBOOK_SETTING_START
  }
}
export function cogNoteBook (name, _id) {
  return dispatch => {
    dispatch(httpService.createAction(types.NOTEBOOK_SETTING_BEGIN, null))
    setTimeout( () => {
      return new Promise(async (resolve, reject) => {
        try {
          let ret
          if (__DESKTOP__) {
            let user = getAuth()
            let isUnique = await notebookService.findOne({ name: name, user: user, _id: { $ne: _id } })
            if (isUnique) {
              ret = httpService.createPayload(null, {
                code: 1204,
                message: '笔记本名已存在'
              })
            }
            else {
              let notebook = await notebookService.updateNotebook({ _id: _id }, {
                name: name
              })
              ret = httpService.createPayload(notebook)
            }
          }
          else {
            let token = getToken()
            ret = await httpService.post(`/notebook/${_id}`, {
              accesstoken: token,
              name
            })
          }
          if (_.isError(ret)) {
            throw ret
          }
          dispatch(httpService.createAction(types.NOTEBOOK_SETTING_SUCCESS, ret))
          resolve(ret)
        } catch (error) {
          dispatch(httpService.createAction(types.NOTEBOOK_SETTING_FAILURE, error))
          reject(error)
        }
      })
    }, 500)
  }
}

export function getNoteBookList () {
  return dispatch => {
    dispatch(httpService.createAction(types.NOTEBOOK_LIST_BEGIN, null))
    setTimeout( () => {
      return new Promise(async (resolve, reject) => {
        try {
          let ret
          if (__DESKTOP__) {
            let user = getAuth()
            let notebook = await notebookService.getList(user)
            ret = httpService.createPayload(notebook)
          }
          else {
            let token = getToken()
            ret = await httpService.get('/notebook/list', {
              accesstoken: token
            })
          }
          if (_.isError(ret)) {
            throw ret
          }
          dispatch(httpService.createAction(types.NOTEBOOK_LIST_SUCCESS, ret))
          resolve(ret)
        } catch (error) {
          dispatch(httpService.createAction(types.NOTEBOOK_LIST_FAILURE, error))
          reject(error)
        }
      })
    }, 500)
  }
}

export function mergeNoteBook (data) {
  return dispatch => {
    dispatch(httpService.createAction(types.NOTEBOOK_MERGE_BEGIN, null))
    setTimeout( () => {
      return new Promise(async (resolve, reject) => {
        try {
          let user = getAuth()
          let notebook = await notebookService.mergeNotebookList(data, user)
          let ret = httpService.createPayload(notebook)
          if (_.isError(ret)) {
            throw ret
          }
          dispatch(httpService.createAction(types.NOTEBOOK_MERGE_SUCCESS, ret))
          resolve(ret)
        } catch (error) {
          dispatch(httpService.createAction(types.NOTEBOOK_MERGE_FAILURE, error))
          reject(error)
        }
      })
    }, 500)
  }
}

export function selectItem (index) {
  return {
    type: types.NOTEBOOK_LIST_SELECT,
    payload: index
  }
}

export function setJustify (value) {
  return {
    type: types.NOTEBOOK_LIST_JUSTIFY,
    payload: value
  }
}

export function sortByChange (value) {
  return {
    type: types.NOTEBOOK_LIST_SORTBY,
    payload: value
  }
}

export function filterChange (value) {
  return {
    type: types.NOTEBOOK_LIST_FILTER,
    payload: value
  }
}

export function rootNoteBookList (data = []) {
  return {
    type: types.NOTEBOOK_ROOT_LIST,
    payload: data
  }
}

export function removeNoteBook (_id) {
  return dispatch => {
    dispatch(httpService.createAction(types.NOTEBOOK_REMOVE_BEGIN, null))
    setTimeout( () => {
      return new Promise(async (resolve, reject) => {
        try {
          let ret
          if (__DESKTOP__) {
            let user = getAuth()
            let notebook = await notebookService.removeNotebook(_id, user)
            ret = httpService.createPayload(notebook)
          }
          else {
            let token = getToken()
            ret = await httpService.get(`/notebook/remove/${_id}`, {
              accesstoken: token
            })
          }
          dispatch(httpService.createAction(types.NOTEBOOK_REMOVE_SUCCESS, ret))
          resolve(ret)
        } catch (error) {
          dispatch(httpService.createAction(types.NOTEBOOK_REMOVE_FAILURE, error))
          reject(error)
        }
      })
    }, 500)
  }
}