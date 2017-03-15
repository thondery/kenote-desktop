
const Nedb = __DESKTOP__ ? require('nedb') : {}

const options = { 
  autoload: true,
  inMemoryOnly: false
}

export function DB (dbpath) {
  return new Nedb({
    filename: `${dbpath}`,
    ...options
  })
}
