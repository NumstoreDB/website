import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import DstView from '../views/DstView.vue'
import { site } from '../config/site'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: LandingView,
    meta: { title: `${site.name} - ${site.tagline}` },
  },
  {
    path: '/simulation',
    name: 'simulation',
    component: DstView,
    meta: { title: `Simulation - ${site.name}` },
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, saved) {
    if (saved) return saved
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const title = (to.meta?.title as string | undefined) ?? 'Numstore'
  if (typeof document !== 'undefined') document.title = title
})
