const backend = require('./dev-server')

module.exports = {
  devServer: {
    before: backend
  }
}
