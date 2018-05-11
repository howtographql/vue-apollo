import Vue from 'vue'
import Router from 'vue-router'

import FeedPage from '../components/FeedPage'
import DraftsPage from '../components/DraftsPage'
import CreatePage from '../components/CreatePage'
import DetailsPage from '../components/DetailsPage'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    redirect: '/feed'
  },
  {
    path: '/feed',
    component: FeedPage
  },
  {
    path: '/drafts',
    component: DraftsPage
  },
  {
    path: '/create',
    component: CreatePage
  },
  {
    path: '/post/:id',
    component: DetailsPage
  }],
  mode: 'history'
})
