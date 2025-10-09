import { createRouter, createWebHistory } from 'vue-router'
import Login from './views/Login.vue'
import Cadastro from './views/Cadastro.vue'
import Home from './views/Home.vue'
import Planos from './views/Planos.vue'

const routes = [
    { path: '/login', component: Login },
    { path: '/cadastro', component: Cadastro },
    { path: '/home', component: Home },
    { path: '/planos', component: Planos },
    { path: '/', redirect: '/login' }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router