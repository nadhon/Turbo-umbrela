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
        <input
          v-model="validadeCartao"
          placeholder="Validade do cartão"
        />
        <input
          v-model="cvv"
          placeholder="CVV"
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

const nome = ref("")
const email = ref("")
const senha = ref("")
const confirmarSenha = ref("")
const validadeCartao = ref("")
const cvv = ref("")

function cadastrar() {
  console.log({
    nome: nome.value,
    email: email.value,
    senha: senha.value,
    confirmarSenha: confirmarSenha.value,
    validadeCartao: validadeCartao.value,
    cvv: cvv.value
  })
  alert("Cadastro enviado! (simulação)")
}
</script>
