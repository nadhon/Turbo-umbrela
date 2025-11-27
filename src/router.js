import { createRouter, createWebHistory } from "vue-router"

import Home from "./views/Home.vue"        // ajuste conforme o nome real
import VideoPlayer from "./views/VideoPlayer.vue" // nome do seu arquivo

const routes = [
  {
    path: "/home",
    name: "Home",
    component: Home
  },
  {
    path: "/player",
    name: "VideoPlayer",
    component: VideoPlayer
  },
  {
    path: "/",
    redirect: "/home"
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
