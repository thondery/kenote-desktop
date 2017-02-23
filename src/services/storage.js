
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

function isEmptyObject (e) {
  for (let t in e)
    return !1
  return !0
}