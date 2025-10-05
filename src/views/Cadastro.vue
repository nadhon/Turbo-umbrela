<template>
  <div class="h-screen w-screen bg-black flex itmes center justify-center">
    <div class="bg-neutral-900 p-8 rounded-lg shadow-lg w-96">
      <form @submit.prevent="cadastrar" class="flex flex-col">
        <input
        v-model="nome"
        placeholder="Nome completo"
        class="bg-neutral-800 text-white p3 mb-3 rounded focus:ring-2 focus:ring-red-600"
        />
        <input
        v-model="email"
        placeholder="E-mail"
        class="bg-neutral-800 text-white p3 mb-3 rounded focus:ring-2 focus:ring-red-600"
        />
        <input
        v-model="senha"
        placeholder="Senha"
        class="bg-neutral-800 text-white p3 mb-3 rounded focus:ring-2 focus:ring-red-600"
        />
        <input
        v-model="confirmarSenha"
        placeholder="Confirmar senha"
        class="bg-neutral-800 text-white p3 mb-3 rounded focus:ring-2 focus:ring-red-600"
        />
        <input
        v-model="validadeCartao"
        placeholder="Validade do cartão"
        class="bg-neutral-800 text-white p3 mb-3 rounded focus:ring-2 focus:ring-red-600"
        />
        <input
        v-model="cvv"
        placeholder="CVV"
        class="bg-neutral-800 text-white p3 mb-3 rounded focus:ring-2 focus:ring-red-600"
        />
        <button
          type="submit"
          class="bg-red-600 hover:bg-red-700 text-white font-semibold p-3 rounded transition">
          cadastrar
        </button>
      </form>
      <p class="text-neutral-400 text-sm mt-4 text-center">
        Já tem conta?
        <a href="#" class="text-rde-500 hover:underline">Entrar</a>
      </p>
    </div>
  </div>
</template>
<script setup>
import {ref} from "vue"

const nome = ref("")
const email = ref("")
const senha = ref("")
const confirmarSenha = ref("")
const validadeCartao = ref("")
const cvv = ref("")

function cadastrar () {
  console.log({
    nome,
    email,
    senha,
    confirmarSenha,
    validadeCartao,
    cvv
  })
  alert("Cadastro enviado!(simulação)")
}
</script>