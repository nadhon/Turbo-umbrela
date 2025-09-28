<template>
    <div class="h-screen w-screen bg-black flex itmes center justify-center">
        <div class="bg-neutral-900 p-8 rounded-lg shadow-lg w-96">
            <form @submit.prevent="cadastrar" class="flex flex-col">
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
            <button
            type="submit"
            class="bg-red-600 hover:bg-red-700 text-white font-semibold p-3 rounded trasition">
                Entrar
            </button>
        </form>
        <p class="text-neutral-400 text-sm mt-4 text-center">
            Novo por aqui?
            <router-link to="/cadastro" class="text-red-500 hover:underline">
                Cadastre-se agora
            </router-link>
        </p>
      </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
const email = ref('')
const senha = ref ('')
const router = useRouter()

function entrar(){
    if(email.value && senha.value){
        router.push("/home")
    } else{
        alert("Usuario não encontrado!")
    }
}
</script>