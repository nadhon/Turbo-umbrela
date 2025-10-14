import { createRouter, createWebHistory } from 'vue-router'
import Cadastro from './views/Cadastro.vue'
import Login from './views/Login.vue'
import Home from './views/Home.vue'
import Admin from './views/Admin.vue'
import Planos from './views/Planos.vue'
import EsqueciMinhaSenha from './views/Esqueciminhasenha.vue'
import VideoPlayer from './views/VideoPlayer.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/cadastro', component: Cadastro },
  { path: '/login', component: Login },
  { path: '/home', component: Home },
  { path: '/admin', component: Admin },
  { path: '/planos', component: Planos },
  { path: '/video/:id', component: VideoPlayer },
  { path: '/esqueci-minha-senha', component: EsqueciMinhaSenha },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
