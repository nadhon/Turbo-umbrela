import { createRouter, createWebHistory } from 'vue-router'

// views
import Cadastro from './views/Cadastro.vue'
import Login from './views/Login.vue'
import Home from './views/Home.vue'
import Admin from './views/Admin.vue'
import Planos from './views/Planos.vue'
import VideoPlayer from './views/VideoPlayer.vue'
import EsqueciSenhaEmail from './views/EsqueciSenhaEmail.vue'
import EsqueciSenhaCodigo from './views/EsqueciSenhaCodigo.vue'
import EsqueciSenhaRedefinir from './views/EsqueciSenhaRedefinir.vue'

// firebase
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from './firebase/firebase.js' // seu firebase.js deve exportar `db`

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/cadastro', component: Cadastro },
  { path: '/login', component: Login },
  { path: '/home', component: Home, meta: { requiresAuth: true } },
  { path: '/admin', component: Admin, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/planos', component: Planos },
  { path: '/video/:id', component: VideoPlayer, meta: { requiresAuth: true } },

  { path: '/esqueci-senha', name: 'esqueci-senha-email', component: EsqueciSenhaEmail },
  { path: '/esqueci-senha/codigo', name: 'esqueci-senha-codigo', component: EsqueciSenhaCodigo },
  { path: '/esqueci-senha/redefinir', name: 'esqueci-senha-redefinir', component: EsqueciSenhaRedefinir }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// helper para aguardar a inicialização do auth
function getCurrentUser() {
  return new Promise((resolve) => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })
}

router.beforeEach(async (to, from, next) => {
  try {
    const auth = getAuth()
    // aguarda o state do auth para evitar falsos negativos no reload
    const user = await getCurrentUser()

    if (to.meta.requiresAuth && !user) {
      return next('/login')
    }

    if (to.meta.requiresAdmin) {
      if (!user) return next('/login')
      // ajuste o nome da collection abaixo se você gravou usuarios em 'users' ou 'usuarios'
      const userDoc = await getDoc(doc(db, 'usuarios', user.uid))
      if (!userDoc.exists() || userDoc.data().tipo !== 'admin') {
        return next('/home')
      }
    }

    next()
  } catch (err) {
    console.error('Erro no route guard:', err)
    // fallback seguro
    next('/login')
  }
})

export default router
