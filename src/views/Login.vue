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
        <router-link to="/esqueci-senha">Esqueci minha senha</router-link>
      </p>
      
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const senha = ref('')
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

function Entrar() {
  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || []
  const usuario = usuarios.find(u => u.email === email.value && u.senha === senha.value)

  if (!usuario) {
    alert('E-mail ou senha incorretos!')
    return
  }

  localStorage.setItem('usuarioLogado', JSON.stringify(usuario))

  // Redireciona conforme o tipo
  if (usuario.tipo === 'admin') {
    router.push('/admin') // tela do administrador
  } else {
    router.push('/home') // tela do usuário normal
  }
}
</script>