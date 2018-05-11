import 'tachyons'
import Vue from 'vue'
import VueApollo from 'vue-apollo'
import ApolloClient from 'apollo-boost'

import App from './App'
import router from './router'
// import './main.css'

const apolloClient = new ApolloClient({
  uri: 'http://localhost:4000'
})

Vue.use(VueApollo)

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  provide: apolloProvider.provide(),
  router,
  render: h => h(App)
})
