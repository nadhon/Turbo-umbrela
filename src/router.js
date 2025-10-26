import { createRouter, createWebHistory } from 'vue-router'

// 1. Componentes Base
import Cadastro from './views/Cadastro.vue'
import Login from './views/Login.vue'
import Home from './views/Home.vue'
import Admin from './views/Admin.vue'
import Planos from './views/Planos.vue'
import VideoPlayer from './views/VideoPlayer.vue'

// 2. Componentes dos 3 Passos de Recuperação de Senha
// Correção: Usando './views/' no lugar de 'src/views/' para consistência.
import EsqueciSenhaEmail from './views/EsqueciSenhaEmail.vue'
import EsqueciSenhaCodigo from './views/EsqueciSenhaCodigo.vue'
import EsqueciSenhaRedefinir from './views/EsqueciSenhaRedefinir.vue'


const routes = [
  // Rotas Padrão
  { path: '/', redirect: '/login' },
  { path: '/cadastro', component: Cadastro },
  { path: '/login', component: Login },
  { path: '/home', component: Home },
  { path: '/admin', component: Admin },
  { path: '/planos', component: Planos },
  { path: '/video/:id', component: VideoPlayer },
  
  // Rotas de Recuperação de Senha (Fluxo de 3 Etapas)
  //
  // **Esta é a rota de entrada** que deve ser usada no link do Login.
  { 
    path: '/esqueci-senha', 
    name: 'esqueci-senha-email',
    component: EsqueciSenhaEmail 
  },
  { 
    path: '/esqueci-senha/codigo', 
    name: 'esqueci-senha-codigo',
    component: EsqueciSenhaCodigo 
  },
  { 
    path: '/esqueci-senha/redefinir', 
    name: 'esqueci-senha-redefinir',
    component: EsqueciSenhaRedefinir 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router