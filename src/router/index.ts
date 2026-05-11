import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import PlayerCompareView from '@/views/PlayerCompareView.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: { name: 'batting' } },
  { path: '/batting', name: 'batting', component: PlayerCompareView, meta: { mode: 'batting' } },
  { path: '/pitching', name: 'pitching', component: PlayerCompareView, meta: { mode: 'pitching' } },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
