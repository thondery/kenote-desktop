
import { DB } from '../services/nedb'
import moment from 'moment'
import * as deleteService from './delete'
import _ from 'lodash'

/*
 * 字段结构
 * - clientId      客户端标识
 * - serverId      服务端标识
 * - name          笔记本名称
 * - user          用户标识
 * - createAt      创建时间，以服务端为准
 * - updateAt      更新时间，以服务端为准
 * - is_sync       是否需要同步
 */
const Model = __DESKTOP__ ? DB('notebook') : {}

export function insert (info) {
  return new Promise( (resolve, reject) => {
    Model.insert(info, (err, doc) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(doc)
      }
    })
  })
}

export function update (query, info, options = {}) {
  return new Promise( (resolve, reject) => {
    Model.update(query, info, options, (err, numAffected, affectedDocuments) => {
      if (err) {
        reject(err)
      }
      else {
        resolve({
          numAffected, 
          affectedDocuments
        })
      }
    })
  })
}

export function remove (query, options = {}) {
  return new Promise( (resolve, reject) => {
    Model.remove(query, options, (err, numRemoved) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(numRemoved)
      }
    })
  })
}

export function findOne (query) {
  return new Promise( (resolve, reject) => {
    Model.findOne(query, (err, doc) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(doc)
      }
    })
  })
}

export function find (query, sort = { clientId: -1 }) {
  return new Promise( (resolve, reject) => {
    Model.find(query).sort(sort).exec( (err, doc) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(doc)
      }
    })
  })
}

export function addNotebook (info, target = 'client') {
  let times = moment().format()
  let clientId = moment().format('x')
  return insert({
    clientId: clientId,
    serverId: target == 'server' ? info._id : '',
    name: info.name,
    user: info.user,
    createAt: target == 'server' ? info.create_at : times,
    updateAt: target == 'server' ? info.update_at : times,
    is_sync: target != 'server'
  })
}

export function updateNotebook (query, data, target = 'client') {
  let times = moment().format()
  let opts = target == 'server' ? {
    serverId: data._id,
    createAt: data.create_at,
    updateAt: data.update_at
  } : {
    updateAt: times
  }
  let info = null
  return findOne(query)
    .then( doc => {
      info = {
        ...doc,
        ...opts,
        name: data.name,
        is_sync: target != 'server',
      }
      return update(query, { $set: {...info} }, { upsert: false })
    })
    .then( doc => {
      return info
    })
}

export function removeNotebook (clientId, user) {
  let serverId
  return findOne({ clientId: clientId })
    .then( doc => {
      console.log(doc)
      if (!doc) return 0
      serverId = doc.serverId
      return remove({ clientId: clientId })
    })
    .then( numRemoved => {
      console.log(numRemoved)
      if (numRemoved > 0) {
        if (_.isEmpty(serverId)) {
          return [clientId]
        }
        else {
          return deleteService.setDelete(serverId, 'notebook', user, [clientId])
        }
      }
      else {
        return []
      }
    })
}

export function getList (user, query = null) {
  return find({ ...query, user: user }, { createAt: -1 })
}

export function getListBySync (user) {
  return find({ is_sync: true, user: user })
}

export function mergeNotebook (data) {
  return findOne({ serverId: data._id })
    .then( doc => {
      if (doc) {
        return updateNotebook({ _id: doc._id }, data, 'server')
      }
      else {
        return addNotebook(data, 'server')
      }
    })
}

export function mergeNotebookList (data, user) {
  let arr = []
  for (let e of data) {
    arr.push(mergeNotebook({...e, user}))
  }
  return Promise.all(arr)
}


export function pushUpdateNotebook (data) {
  let info = {
    //clientId: data.clientId,
    _id: data.serverId,
    name: data.name,
    create_at: data.createAt,
    update_at: data.updateAt
  }
  console.log('pushUpdateNotebook =>')
  console.log(info)
  return updateNotebook({ clientId: data.clientId }, info, 'server')
}

export function pushUpdateNotebookList (data, user) {
  let arr = []
  data = data ? data : []
  for (let e of data) {
    arr.push(pushUpdateNotebook({...e, user}))
  }
  return Promise.all(arr)
}