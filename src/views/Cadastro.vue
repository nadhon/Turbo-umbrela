<template>
  <main>
    <div class="cadastro-box">
      <form @submit.prevent="cadastrar">
        <h1>Cadastro</h1>
        <input
          v-model="nome"
          placeholder="Nome completo"
        />
        <input
          v-model="email"
          placeholder="E-mail"
        />
        <input
          v-model="senha"
          placeholder="Senha"
          type="password"
        />
        <input
          v-model="confirmarSenha"
          placeholder="Confirmar senha"
          type="password"
        />
        <button type="submit">Cadastrar</button>
      </form>

      <p class="links">
        Já tem conta?
        <router-link to="/login">Entrar</router-link>
      </p>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const nome = ref("")
const email = ref("")
const senha = ref("")
const confirmarSenha = ref("")

function cadastrar() {
  if (senha.value !== confirmarSenha.value) {
    alert("As senhas não coincidem!")
    return
  } else if (
    !nome.value ||
    !email.value ||
    !senha.value ||
    !confirmarSenha.value
  ) {
    alert("Por favor, preencha todos os campos!")
    return
  }
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || []
  const usuarioExistente = usuarios.some(u => u.email === email.value)
  const novousuario = {
    nome: nome.value,
    email: email.value,
    senha: senha.value,
    tipo: "cliente" // ou "admin" se for cadastro administrativo
  }
  if (usuarioExistente) {
    alert("E-mail já cadastrado!")
    return
  }
  usuarios.push(novousuario)
  localStorage.setItem("usuarios", JSON.stringify(usuarios))
  alert("Cadastro realizado com sucesso!")
  router.push("/planos")
}
</script>
