import { createRouter, createWebHistory } from 'vue-router'
import Login from './views/Login.vue'
import Cadastro from './views/Cadastro.vue'
import Home from './views/Home.vue'
import Admin from './views/Admin.vue'
import Planos from './views/Planos.vue'

const routes = [
    { path: '/login', component: Login },
    { path: '/cadastro', component: Cadastro },
    { path: '/home', component: Home },
    { path: '/planos', component: Planos },
    { path: '/admin', component: Admin }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'))
    if (to.path === '/admin') {
        if (usuarioLogado && usuarioLogado.tipo === 'admin') {
            next()
        } else {
            alert('Acesso restrito!')
            next('/login')
        }
    } else if (usuarioLogado) {
        if (to.path === '/login' || to.path === '/cadastro') {
            next('/home')
        } else {
            next()
        }
    } else {
        if (to.path === '/login' || to.path === '/cadastro') {
            next()
        } else {
            next('/login')
        }
    }
})

export default router