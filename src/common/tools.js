
import _ from 'lodash'

const ran_len = 8
const ran_str = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ0123456789;-_[]{}()~!@#$%^&*+=\\?/.,:\'"|`'

export const random = (...opts) => {
  let arg = _.zipObject(['len', 'char'], opts)
  let str_num = typeof arg['len'] === 'number' ? arg['len'] : ran_len
  str_num = typeof arg['len'] === 'object' ? _.random(arg['len'][0], arg['len'][1]) : str_num
  let chars = typeof arg['len'] === 'string' ? arg['len'] : ran_str
  chars = typeof arg['char'] === 'string' && typeof arg['len'] !== 'string' ? arg['char'] : chars
  let str_arr = chars.split("")
  let r_num = str_arr.length
  let str = ''
  for (let i = 0; i < str_num; i++) {
    let pos = Math.floor(Math.random() * r_num)
    str += chars[pos]
  }
  return str
}

export const clientId = () => {
  return random(24, '0123456789abcdef')
}

export const getStringByte = (str) => {
  var char = str.replace(/[^\x00-\xff]/g, '**')
  return char.length
}