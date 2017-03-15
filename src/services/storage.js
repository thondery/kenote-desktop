import _ from 'lodash'
import * as Tools from '../common/tools'
import moment from 'moment'

const localforage = __DESKTOP__ 
                  ? window.storage 
                  : require('localforage')



export function getItem (key) {
  if (__DESKTOP__) {
    return new Promise( (resolve, reject) => {
      localforage.get(key, (error, data) => {
        if (error) {
          reject(error)
        }
        else {
          data = isEmptyObject(data) ? null : data
          resolve(data)
        }
      })
    })
  }
  else {
    return localforage.getItem(key)
  }
}

export async function setItem (key, value) {
  if (value === null) return Promise.reject('StorageService Error: value should not be null or undefined')
  if (__DESKTOP__) {
    return await new Promise( (resolve, reject) => {
      localforage.set(key, value, error => {
        if (error) {
          reject(error)
        }
      })
    })
  }
  else {
    return await localforage.setItem(key, value)
  }
}

export async function removeItem (key) {
  if (__DESKTOP__) {
    return await new Promise( (resolve, reject) => {
      localforage.remove(key, error => {
        if (error) {
          reject(error)
        }
      })
    })
  }
  else {
    return await localforage.removeItem(key)
  }
}

export async function clear () {
  if (__DESKTOP__) {
    return await new Promise( (resolve, reject) => {
      localforage.clear( error => {
        if (error) {
          reject(error)
        }
      })
    })
  }
  else {
    return await localforage.clear()
  }
}

export function findByItem (key, query) {
  return getItem(key)
    .then( ret => {
      return _.isArray(ret) ? _.find(ret, query) : ret
    })
}

export function findIndexByItem (key, query) {
  return getItem(key)
    .then( ret => {
      return _.isArray(ret) ? _.findIndex(ret, query) : -1
    })
}

export function filterByItem (key, query) {
  return getItem(key)
    .then( ret => {
      ret = _.isArray(ret) ? ret : [ret]
      return _.filter(ret, query)
    })
}

export async function insert (key, doc) {
  let collection = await getItem(key) || []
  if (!_.isArray(collection)) collection = [collection]
  let times = moment()
  collection.unshift({
    ...doc,
    client_id: Tools.clientId(),
    create_at: times,
    update_at: times,
    is_sync: true
  })
  return setItem(key, collection)
}

export async function update (key, query, doc) {
  let collection = await getItem(key) || []
  if (!_.isArray(collection)) collection = [collection]
  let times = moment()
  let updateIndex = await findIndexByItem(key, query)
  if (updateIndex === -1) return
  collection[updateIndex] = {
    ...collection[updateIndex],
    ...doc,
    update_at: times,
    is_sync: true
  }
  return setItem(key, collection)
}

export async function deleteMany (key, query) {
  let collection = await getItem(key) || []
  if (!_.isArray(collection)) collection = [collection]
  let deleteIndex = await findIndexByItem(key, query)
  collection.splice(deleteIndex, 1)
  return setItem(key, collection)
}

/*
 * sync_data_push
 * - type          add | update | delete
 * - collection    key for storge
 * - query         query
 */

// 获取需要删除的数据
export async function getSyncDataByDelete (key) {
  let collection = await filterByItem('sync_data_push', { type: 'delete', collection: key })
  return collection
}
// 添加需要变更的数据到 sync_data_push
export async function setSyncData () {

  
}

// 添加到废纸篓
export async function addByTrash () {}
// 从废纸篓还原
export async function restoreByTrash () {}
// 从废纸篓移除
export async function removeByTrash () {}
// 清空废纸篓
export async function cleanByTrash () {}

function isEmptyObject (e) {
  for (let t in e)
    return !1
  return !0
}

export async function appInfo (key = null) {
  let appInfo = await storageService.getItem('app')
  console.log(appInfo)
  return key ? appInfo[key] : appInfo
}

export async function auth () {
  let auth = await storageService.getItem('auth')
  return auth
}