import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import AboutView from '../views/AboutView.vue'
import ContactView from '../views/ContactView.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: LandingView, meta: { title: 'Numstore — Numerical storage, engineered.' } },
  { path: '/about', name: 'about', component: AboutView, meta: { title: 'About — Numstore' } },
  { path: '/contact', name: 'contact', component: ContactView, meta: { title: 'Contact — Numstore' } },
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
