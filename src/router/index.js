import { createRouter, createWebHistory } from 'vue-router'
import SocketTestView from "@/components/SocketTestView.vue";
import SocketTestTwo from "@/components/socketTestTwo.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: SocketTestView
    },
    {
      path: '/test',
      name: 'test',
      component: SocketTestTwo
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
