import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'
import { auth } from '@/firebase'
import { onAuthStateChanged } from 'firebase/auth'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('../LoginPage.vue')
  },
  {
    path: '/tabs/',
    component: () => import('@/views/TabsPage.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '',          redirect: '/tabs/claves' },
      { path: 'claves',   component: () => import('@/views/ClavesTab.vue') },
      { path: 'usuarios', component: () => import('@/views/UsuariosTab.vue') },
      { path: 'agregar',  component: () => import('@/views/AgregarClavesTab.vue') },
      { path: 'mapa',     component: () => import('@/views/MapaTab.vue') },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Guard de autenticación
router.beforeEach((to, _from, next) => {
  if (!to.meta.requiresAuth) return next()

  onAuthStateChanged(auth, user => {
    if (user) next()
    else next('/login')
  })
})

export default router