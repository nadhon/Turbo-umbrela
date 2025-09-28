<template>
    <div class="flex items-center justify-center h-screen">
        <div class="p-6 bg-white round shadow w-80">
            <input v-model="email" type="email" placeholder="Email" class="w-full p-2 border rounded"/>
            <input v-model="senha" type="password" placeholder="Senha" class="w-full p-2 border rounded"/>
            <button class="w-full bg-blue-500 text-white p-2 rouded">Entrar</button>
            <router-link to="/cadastro" class="block text-blue-600 mt-2">Cadastro</router-link>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
const email = ref('')
const senha = ref ('')
</script>