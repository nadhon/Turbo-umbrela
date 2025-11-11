<template>
  <main>
    <div class="login">
      <form @submit.prevent="Entrar">
        <h1>Login</h1>
        <input v-model="email" placeholder="E-mail" />
        <input v-model="senha" placeholder="Senha" />
        <label class="row"><input type="checkbox" v-model="lembrar"/>Lembre-me</label>
        <button type="submit">Entrar</button>
      </form>
      <p class="links">
        Novo por aqui?
        <router-link to="/cadastro">Cadastre-se agora</router-link>
      </p>
      
      <p class="links">
        Esqueceu sua senha?
        <router-link to="/esqueci-senha">Esqueci minha senha</router-link>
      </p>
      
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmailAndPassword} from 'firebase/auth'
import { auth } from '../firebase/firebase'

const email = ref('')
const senha = ref('')
const lembrar = ref(false)
const router = useRouter()

// Garantir que o admin existe
onMounted(() => {
  const usuariosExistentes = JSON.parse(localStorage.getItem('usuarios')) || []
  if (!usuariosExistentes.some(u => u.email === 'admin@turbo-umbrela.com')) {
    usuariosExistentes.push({
      nome: 'Administrador',
      email: 'admin@turbo-umbrela.com',
      senha: 'admin123',
      tipo: 'admin'
    })
    localStorage.setItem('usuarios', JSON.stringify(usuariosExistentes))
  }
})

async function Entrar() {
  try{
    const cred = await signInWithEmailAndPassword(auth, email.value, senha.value)
    const user = cred.user
    router.push('/home')
  } catch (err) {
    if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password'){
      alert('E-mail ou senha incorretos.')
    } else if (err.code === 'auth/invalid-email'){
      alert('Formato de e-mail inválido.')
    } else {
      console.error(err)
      alert('Erro ao entrar. Tente novamente mais tarde.')
    }
  }
}
</script>