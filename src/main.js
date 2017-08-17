import { ApolloClient, createBatchingNetworkInterface } from 'apollo-client'
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws'
import 'tachyons'
import Vue from 'vue'
import VueApollo from 'vue-apollo'

import App from './App'
import { GC_USER_ID, GC_AUTH_TOKEN } from './constants/settings'
import router from './router'

Vue.config.productionTip = false

const networkInterface = createBatchingNetworkInterface({
  uri: 'https://api.graph.cool/simple/v1/__PROJECT_ID__'
})

const wsClient = new SubscriptionClient('wss://subscriptions.graph.cool/v1/__PROJECT_ID__', {
  reconnect: true,
  connectionParams: {
    authToken: localStorage.getItem(GC_AUTH_TOKEN)
  }
})

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
)

networkInterface.use([{
  applyBatchMiddleware (req, next) {
    if (!req.options.headers) {
      req.options.headers = {}
    }
    const token = localStorage.getItem(GC_AUTH_TOKEN)
    req.options.headers.authorization = token ? `Bearer ${token}` : null
    next()
  }
}])

const apolloClient = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
  connectToDevTools: true
})

Vue.use(VueApollo)

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

var userId = localStorage.getItem(GC_USER_ID)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  apolloProvider,
  template: '<App/>',
  components: { App },
  router,
  data: {
    userId
  }
})
