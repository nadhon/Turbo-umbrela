<template>
  <div class="recuperar">
    <h2>Recuperar Senha</h2>
    <input v-model="email" placeholder="Digite seu e-mail" />
    <button @click="recuperarSenha">Recuperar</button>
    <p v-if="mensagem">{{ mensagem }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

const email = ref("")
const mensagem = ref("")
const router = useRouter()

function recuperarSenha() {
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || []
  const usuario = usuarios.find(u => u.email === email.value)
  if (usuario) {
    mensagem.value = `Sua senha é: ${usuario.senha}`
    // Em sistemas reais, nunca exiba a senha! Envie um e-mail ou gere uma nova senha.
  } else {
    mensagem.value = "E-mail não encontrado!"
  }
  setTimeout(() => {
    router.push('/login')
  }, 3000)
}
</script>