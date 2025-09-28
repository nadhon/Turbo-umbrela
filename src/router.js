import{createRouter, createWebHistory} from 'vue-router'
import Login from './templates/Home.vue'
import Cadastro from './templates/Cadastro.vue'
import Home from './templates/Home.vue'

const routes = [
    {path: '/login', component: Login},
    {path: '/cadastro', component: Cadastro},
    {path: '/home', component: Home},
    {path: '/', redirect: '/login'}
]

export const router = createRouter({history: createWebHistory(),
    routes,
})