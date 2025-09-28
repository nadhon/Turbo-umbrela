import{createRouter, createWebHistory} from 'vue-router'
import Login from './templates/home.vue'
import Cadastro from './templates/Cadastro.vue'
import Home from './templates/Home.vue'

const routes = [
    {path: '/login', component: Login},
    {path: '/cadastro', component: Cadastro},
    {path: '/home', component: Home},
]

export const router = createRouter({history: createWebHistory(),
    routes,
})