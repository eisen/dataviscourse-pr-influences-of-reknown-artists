const fs = require('fs')

const parseArgs = () => {
  const [ , , ...args ] = process.argv
  return args
}

const main = () => { }

if (require.main === module) {
  main()
} else {
  module.exports = { main }
}