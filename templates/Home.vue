<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Catálogo de Filmes</h1>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="filme in filmes" :key="filme.id" class="p-2 bg-white shadow rounded">
        <img :src="filme.img" alt="" class="w-full h-40 object-cover rounded"/>
        <h2 class="mt-2 font-semibold">{{ filme.titulo }}</h2>
      </div>
    </div>
  </div>
</template>

<script setup>
const filmes = [
  { id: 1, titulo: "Filme 1", img: "https://via.placeholder.com/150" },
  { id: 2, titulo: "Filme 2", img: "https://via.placeholder.com/150" },
  { id: 3, titulo: "Filme 3", img: "https://via.placeholder.com/150" },
]
</script>