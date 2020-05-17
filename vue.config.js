module.exports = {
  publicPath: '', // for phone gap
  devServer: {
    proxy: 'http://localhost:3000'
  },
  "transpileDependencies": [
    "vuetify"
  ]
}