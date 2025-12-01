import { createRouter, createWebHistory } from "vue-router"

import Login from "./views/Login.vue"
import VideoPlayer from "./views/VideoPlayer.vue"
import Cadastro from "./views/Cadastro.vue"
import Home from "./views/Home.vue"
import Planos from "./views/Planos.vue"

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
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
    path: "/admin",
    name: "Admin",
    component: () => import("./views/Admin.vue")
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    children: [
      {
        path: "esqueci-senha",
        name: "EsqueciSenhaCodigo",
        component: () => import("./views/EsqueciSenhaCodigo.vue")
      },
      {
        path: "esquecisenhaemail",
        name: "EsqueciSenhaEmail",
        component: () => import("./views/EsqueciSenhaEmail.vue")
      },
      {
        path: "esquecisenharedefinir",
        name: "EsqueciSenhaRedefinir",
        component: () => import("./views/EsqueciSenhaRedefinir.vue")
      },
    ]
  },
  {
    path: "/cadastro",
    name: "Cadastro",
    component: Cadastro
  },
  {
    path: "/planos",
    name: "Planos",
    component: Planos
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
