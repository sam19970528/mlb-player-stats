import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import PlayerCompareView from '@/views/PlayerCompareView.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/v1' },
  { path: '/v1', name: 'v1', component: PlayerCompareView },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
