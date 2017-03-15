
import { DB } from '../services/nedb'
import _ from 'lodash'

/*
 * - uid               与服务器同步的用户UID
 * - lastUpdateCount   上次与服务器同步的服务器updateCount值
 * - lastSyncTime      上次与服务器同步的服务器时间
 */
const Model = __DESKTOP__ ? DB('syncdata') : {}

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

export const getInfo = (uid) => {
  return findOne({ uid: uid })
    .then( doc => {
      return doc 
        ? _.pick(doc, ['lastUpdateCount', 'lastSyncTime']) 
        : {
          lastUpdateCount: 0,
          lastSyncTime: 0
        }
    })
}

export const setInfo = (uid, lastUpdateCount, lastSyncTime) => {
  return findOne({ uid: uid })
    .then( doc => {
      if (doc) {
        return update({ uid: uid }, {
          $set: {
            lastUpdateCount: lastUpdateCount,
            lastSyncTime: lastSyncTime
          }
        })
      }
      else {
        return insert({
          uid,
          lastUpdateCount,
          lastSyncTime
        })
      }
    })
}