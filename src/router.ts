import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import LandingView from './landing/LandingView.vue'
import { site_data } from './data'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: LandingView,
    meta: { title: `${site_data.name} - ${site_data.tagline}` },
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
