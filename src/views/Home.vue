<template>
  <div>
    <header>
      <nav>
        <a href="#" class="logo">Turbo-Umbrela</a>
        <ul class="nav-list">
          <li>
            <button @click="sair">Sair</button>
          </li>
        </ul>
      </nav>
    </header>

    <main>
      <section class="banner">
        <img :src="bannerFilm.img" alt="Banner do Filme" />
        <div class="banner-info">
          <h1>{{ bannerFilm.title }}</h1>
          <p>{{ bannerFilm.description }}</p>
          <button @click="assistirFilme(bannerFilm)">Assistir</button>
        </div>
      </section>
      <div class="buscar-filmes">
        <input v-model="busca" placeholder="buscar"/>
      </div>
      <section class="filmes-grid">
        <h3>Filmes em destaque</h3>
        <div class="grid">
          <div
            v-for="(filme, index) in filmes.filter(f => f.title.toLowerCase().includes(busca.toLowerCase()))"
            :key="index"
            class="filme-card"
          >
            <img :src="filme.img" :alt="filme.title" />
            <h4>{{ filme.title }}</h4>
            <button @click="toggleFavorito(filme)">
              {{ favoritosIds.includes(filme.id) ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos' }}
            </button>
          </div>
        </div>
      </section>
      <section v-if="favoritos.length" class="filmes-grid">
        <h3>Meus Favoritos</h3>
        <div class="grid">
          <div
            v-for="(filme, index) in favoritos"
            :key="index"
            class="filme-card"
          >
           <img :src="filme.img" :alt="filme.title"/>
           <p>{{ filme.title }}</p>
          </div>
        </div>
      </section>
    </main>
    <footer>
      <p>&copy; 2025 Turbo-Umbrela - Todos os direitos reservados.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const filmes = ref([])

onMounted(() => {
  filmes.value = JSON.parse(localStorage.getItem("filmes")) || []
})

function sair(index) {
  router.push(`/login`)
}
</script>
