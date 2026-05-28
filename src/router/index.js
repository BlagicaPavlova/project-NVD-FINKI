import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LabelView from '../views/LabelView.vue'
import ReleaseView from '../views/ReleaseView.vue'
import AllReleasesView from '../views/AllReleasesView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/label/:id',
    name: 'label',
    component: LabelView
  },
  {
    path: '/release/:id',
    name: 'release',
    component: ReleaseView
  },
  {
    path: '/releases',
    name: 'releases',
    component: AllReleasesView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
