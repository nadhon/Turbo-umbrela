<template>
  <div class="home">
    <!-- HEADER -->
    <header class="header">
      <div class="logo">Turbo-Umbrela</div>
      <input v-model="busca" class="buscar" placeholder="Buscar..." aria-label="Buscar"/>
      <nav class="header-right">
        <button @click="notifications" aria-label="Notificações"> 🔔 </button>
        <!--<img class="avatar" src="/avatar.png" alt="Perfil" @click="abrirPerfil"/>-->
        <button @click="sair">Sair</button>
      </nav>
    </header>

    <!-- BANNER -->
    <section class="banner" v-if="bannerFilm">
      <div class="banner-video">
        <video
          v-if="bannerFilm.video"
          class="banner-bg"
          :src="bannerFilm.video"
          autoplay
          muted
          loop
          playsinline
        ></video>
        <img
          v-else
          class="banner-bg"
          :src="bannerFilm.img"
          alt="Banner do filme"
        />
      </div>

      <div class="banner-info">
        <h1>{{ bannerFilm.title }}</h1>
        <p>{{ bannerFilm.description }}</p>
        <div class="banner-buttons">
          <button class="assistir" @click="assistirFilme(bannerFilm)">▶ Assistir</button>
          <button class="favoritar" @click="toggleFavorito(bannerFilm)">
            {{ favoritosIds.includes(bannerFilm.id) ? 'Remover' : '+ Minha Lista' }}
          </button>
        </div>
      </div>
    </section>
    <!-- Carrossel -->
    
    
    <!-- CATEGORIAS -->
    <main class="conteudo">
      <section v-for="(filmesCat, cat) in filmesPorCategoria" :key="cat" class="categoria">
        <h2>{{ cat }}</h2>
        <div class="carrossel-wrapper">
          <button class="nav left" @click="scroll(-1)">&#10094;</button>
          <div class="carrossel" ref="carrossel" @keydown.left.prevent="scroll(-1)" @keydown.right.prevent="scroll(1)" tabindex="0">
            <div v-for="filme in filmes" :key="filme.id" class="filme-card" @mouseenter="previewStart(filme)" @mouseleave="previewStop">
              <img :src="filme.img" :alt="filme.title" :loading="lazy"/>
            </div>
          </div>
          <button class="nav right" @click="scroll(1)">&#10095;</button>
        </div>
      </section>

      <!-- FAVORITOS -->
      <section v-if="favoritos.length" class="categoria">
        <h2>Minha Lista</h2>
        <div class="carrossel">
          <div
            v-for="filme in favoritos"
            :key="filme.id"
            class="filme-card"
            @click="assistirFilme(filme)"
          >
            <img :src="filme.img" :alt="filme.title" />
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const busca = ref('')
const filmes = ref([])
const favoritosIds = ref([])
const bannerFilm = ref(null)

// Mock inicial
onMounted(() => {
  const mockFilmes = [
    {
      id: 1,
      title: "Elephants Dream",
      description: "Uma experiência surrealista em um mundo mecânico e misterioso.",
      img: "https://via.placeholder.com/800x400",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      categoria: "Ação"
    },
    {
      id: 2,
      title: "Noite Cômica",
      description: "Uma comédia leve",
      img: "https://via.placeholder.com/800x400",
      video: "https://www.w3schools.com/html/movie.mp4",
      categoria: "Humor"
    },
    { id: 3, title: "Pesadelo Urbano", description: "Terror psicológico", img: "https://via.placeholder.com/800x400", categoria: "Terror" },
    { id: 4, title: "Guerra de Titãs", description: "Ação épica e brutal", img: "https://via.placeholder.com/800x400", categoria: "Ação" },
    { id: 5, title: "Piadas do Caos", description: "Humor nonsense", img: "https://via.placeholder.com/800x400", categoria: "Humor" },
  ]
  filmes.value = JSON.parse(localStorage.getItem("filmes")) || mockFilmes
  favoritosIds.value = JSON.parse(localStorage.getItem("favoritosIds")) || []
  bannerFilm.value = filmes.value[0]
  localStorage.setItem("filmes", JSON.stringify(filmes.value))
})

const filmesPorCategoria = computed(() => {
  const filtrados = filmes.value.filter(f =>
    f.title.toLowerCase().includes(busca.value.toLowerCase())
  )
  const porCat = {}
  filtrados.forEach(f => {
    if (!porCat[f.categoria]) porCat[f.categoria] = []
    porCat[f.categoria].push(f)
  })
  return porCat
})

const favoritos = computed(() =>
  filmes.value.filter(f => favoritosIds.value.includes(f.id))
)

function toggleFavorito(filme) {
  if (favoritosIds.value.includes(filme.id)) {
    favoritosIds.value = favoritosIds.value.filter(id => id !== filme.id)
  } else {
    favoritosIds.value.push(filme.id)
  }
  localStorage.setItem("favoritosIds", JSON.stringify(favoritosIds.value))
}

function assistirFilme(filme) {
  localStorage.setItem("filmeSelecionado", JSON.stringify(filme))
  router.push(`/video/${filme.id}`)
}

function sair() {
  router.push("/login")
}
const carrossel = ref(null)
function scroll(direction) {
  const el = carrossel.value
  if(!el) return
  const width = el.clientWidth
  el.scrollBy({ left: direction * width, behavior: 'smooth' })
}
</script>