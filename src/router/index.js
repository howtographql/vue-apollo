import Vue from 'vue'
import VueRouter from 'vue-router'

import AppLogin from '../components/AppLogin'
import CreateLink from '../components/CreateLink'
import LinkList from '../components/LinkList'
import Search from '../components/Search'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/new/1'
  },
  {
    path: '/create',
    component: CreateLink
  },
  {
    path: '/login',
    component: AppLogin
  },
  {
    path: '/new/:page',
    component: LinkList
  },
  {
    path: '/search',
    component: Search
  },
  {
    path: '/top',
    component: LinkList
  }
]

export default new VueRouter({
  mode: 'history',
  routes
})
