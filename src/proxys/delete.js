
import { DB } from '../services/nedb'
import moment from 'moment'
import _ from 'lodash'

/*
 * 字段结构
 * - serverId      服务端标识
 * - table         相关表名
 * - user          用户标识
 */
const Model = __DESKTOP__ ? DB('delete') : {}

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

export function find (query, projection = {}, sort = { _id: -1 }) {
  return new Promise( (resolve, reject) => {
    Model.find(query).projection(projection).sort(sort).exec( (err, doc) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(doc)
      }
    })
  })
}

export function setDelete (serverId, table, user, result = null) {
  return findOne({ table: table, user: user })
    .then( doc => {
      if (doc) {
        let _serverId = _.uniq(_.concat(doc.serverId, serverId))
        return update({ table: table, user: user }, { $set: { serverId: _serverId } }, { upsert: false })
      }
      else {
        return insert({
          table: table, user: user, serverId: _.concat(serverId)
        })
      }
    })
    .then( doc => result )
}

export function getDelete (user) {
  return find({ user: user }, { user: -1 })
}