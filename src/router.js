import{createRouter, createWebHistory} from 'vue-router'
import Login from './views/Home.vue'
import Cadastro from './viwes/Cadastro.vue'
import Home from './views/Home.vue'
import EsqueciSenha from './views/EsqueciSenha.vue'
import ResetSenha from './views/ResetSenha.vue'

const routes = [
    {path: '/login', component: Login},
    {path: '/cadastro', component: Cadastro},
    {path: '/home', component: Home},
    {path: '/', redirect: '/login'}
]

export const router = createRouter({history: createWebHistory(),
    routes,
})