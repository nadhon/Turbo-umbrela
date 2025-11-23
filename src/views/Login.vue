<template>
  <main
    :style="{
      backgroundImage: 'url(src/views/img/banerfilme.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }"
  >
    <div class="login">
      <form @submit.prevent="Entrar">
        <h1>Login</h1>
        <input v-model="email" placeholder="E-mail" />
        <input :type="mostrarSenha ? 'text' : 'password'" v-model="senha" placeholder="Senha" />

        <label style="display: flex; align-items: center; gap: 5px;">
          <input type="checkbox" v-model="mostrarSenha" />
          Mostrar senha
        </label>

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
const mostrarSenha = ref(false)
const router = useRouter()

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

  if (usuario.tipo === 'admin') {
    router.push('/admin')
  } else {
    router.push('/home')
  }
}
</script>
