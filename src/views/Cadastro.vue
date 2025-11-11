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
          v-model="numeroCartao"
          placeholder="Número do cartão"
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import {auth, db } from "../firebase/firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const nome = ref("")
const email = ref("")
const senha = ref("")
const confirmarSenha = ref("")
const validadeCartao = ref("")
const cvv = ref("")

const router = useRouter()

async function cadastrar() {
  if (senha.value !== confirmarSenha.value) {
    alert("As senhas não coincidem!")
    return
  } else if (
    !nome.value ||
    !email.value ||
    !senha.value ||
    !confirmarSenha.value ||
    !validadeCartao.value ||
    !cvv.value
  ) {
    alert("Por favor, preencha todos os campos!")
    return
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      senha.value
    );
    const user = userCredential.user;
    
    await setDoc(doc(db, "users", user.uid), {
      nome: nome.value,
      email: email.value,
      validadeCartao: validadeCartao.value,
      cvv: cvv.value,
      tipo: "cliente",
      plano: null
    });
    alert("Cadastro realizado com sucesso!");
    router.push("/planos");
  } catch (error) {
    alert("Erro ao cadastrar: " + error.message); 
  }
}
</script>
