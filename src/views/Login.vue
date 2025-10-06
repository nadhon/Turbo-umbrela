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
    if(email.value && senha.value){
        router.push("/home")
    } else{
        alert("Usuário não encontrado!")
    }
}
</script>