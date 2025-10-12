<template>
  <main>
    <div class="login">
      <form @submit.prevent="Entrar">
        <h1>Login</h1>
        <input v-model="email" placeholder="E-mail" />
        <input v-model="senha" placeholder="Senha" />
        <button type="submit">Entrar</button>
      </form>
      <p class="links">
        Novo por aqui?
        <router-link to="/cadastro">Cadastre-se agora</router-link>
      </p>
      <p class="links">
        Esqueceu sua senha?
        <router-link to="/esqueci-minha-senha">Esqueci minha senha</router-link>
      </p>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const email = ref('')
const senha = ref('')
const router = useRouter()

function Entrar(){
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || []
    const usuario = usuarios.find(u => u.email === email.value && u.senha === senha.value)
    if(usuario){
      localStorage.setItem('usuarioLogado', JSON.stringify(usuario))
      if(usuario.tipo === 'admin'){
        router.push('/admin')
        return
      }
      router.push('/home')
    } else {
      alert('E-mail ou senha incorretos!')
    }
}
const admins = [
  { nome: 'Admin', email: 'admin@turbo-umbrela.com', senha: 'admin123', tipo: 'admin' }
]
localStorage.setItem('usuarios', JSON.stringify(admins))
</script>