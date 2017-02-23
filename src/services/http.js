import qs from 'query-string'
import config from '../config'
import _ from 'lodash'

export const get = (url, params) => {
  url = getAPI(url)
  if (params) {
    url += `?${qs.stringify(params)}`
  }
  return fetch(url)
    .then(checkStatus)
    .then(parseJSON)
}

export const post = (url, body) => {
  url = getAPI(url)
  return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then(checkStatus)
    .then(parseJSON)
}

function checkStatus (response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  else {
    let error = new Error(response._bodyText)
    error.response = response
    throw error
  }
}

function parseJSON (response) {
  return response.json()
}

const getAPI = url => {
  let { domain, apiPath } = config
  return domain + apiPath + url
}

export const createAction = (type, res) => {
  let opts = {
    type,
    payload: res,
    error: null
  }
  if (_.isError(res)) {
    opts.error = res
    opts.payload = null
  }
  return opts
}

export const createPayload = (data) => {
  return {
    data,
    status: {
      code: 0,
      message: 'Request Success!'
    }
  }
}