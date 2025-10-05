<template>
  <div class="bg-black min-h-screen text-white">
    <div class="flex items-center justify-between px-6 py-4 bg-neutral-900">
      <h1>Turbo-Umbrela</h1>
      <button @click="sair">Sair</button>
    </div>
    <div class="px-6 py-8">
      <h2 class="text-xl font-bold mb-4">Filmes em destaque</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div
         v-for="filme in filmes"
         :key="filme.id"
         class="bg-neutral-800 rounded overflow-hidden shadow">
         <img :src="filme.img" :alt="filme.titulo" class="w-full h-48 object-cover"/>
         <p class="p-2 text-sm">{{ filme.titulo }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router"

const router = useRouter()

const filmes = [
  { id: 1, titulo: "Filme 1", img: "https://via.placeholder.com/150" },
  { id: 2, titulo: "Filme 2", img: "https://via.placeholder.com/150" },
  { id: 3, titulo: "Filme 3", img: "https://via.placeholder.com/150" },
]
function sair(){
  router.push("/login")
}
</script>