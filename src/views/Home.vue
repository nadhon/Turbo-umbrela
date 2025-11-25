<template>
  <div class="home">
    <header class="header">
      <div class="logo">
        <img src="../views/img/Logo.png" alt="Logo Turbo-Umbrela" />
      </div>
      
      <nav class="Menu">
        <input v-model="busca" class="buscar" placeholder="Buscar..." />
        <button @click="sair">Sair</button>
      </nav>
    </header>

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
          :alt="bannerFilm.title"
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

    <main class="conteudo">
      <section v-for="(filmesCat, cat) in filmesPorCategoria" :key="cat" class="categoria">
        <h2>{{ cat }}</h2>
        <div class="carrossel-wrapper">
          <button class="nav left" @click="scrollRow(cat, -1)">
            <span class="arrow">❮</span>
          </button>
          <div :ref="el => carrosselRefs[cat] = el" class="carrossel">
            <div
              v-for="filme in filmesCat"
              :key="filme.id"
              class="filme-card"
              @click="assistirFilme(filme)"
            >
              <img :src="filme.img" :alt="filme.title" />
              <div class="filme-overlay">
                <h4>{{ filme.title }}</h4>
                <button @click.stop="toggleFavorito(filme)">
                  {{ favoritosIds.includes(filme.id) ? '💔' : '❤️' }}
                </button>
              </div>
            </div>
          </div>
          <button class="nav right" @click="scrollRow(cat, 1)">
            <span class="arrow">❯</span>
          </button>
        </div>
      </section>

      <section v-if="favoritos.length" class="categoria">
        <h2>Minha Lista</h2>
        <div class="carrossel-wrapper">
          <button class="nav left" @click="scrollRow('favoritos', -1)">
            <span class="arrow">❮</span>
          </button>
          <div :ref="el => carrosselRefs['favoritos'] = el" class="carrossel">
            <div
              v-for="filme in favoritos"
              :key="filme.id"
              class="filme-card"
              @click="assistirFilme(filme)"
            >
              <img :src="filme.img" :alt="filme.title" />
              <div class="filme-overlay">
                <h4>{{ filme.title }}</h4>
                <button @click.stop="toggleFavorito(filme)">
                  {{ favoritosIds.includes(filme.id) ? '💔' : '❤️' }}
                </button>
              </div>
            </div>
          </div>
          <button class="nav right" @click="scrollRow('favoritos', 1)">
            <span class="arrow">❯</span>
          </button>
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

// Usado para armazenar as referências dos elementos do carrossel (para a rolagem)
const carrosselRefs = ref({}) 

// Mock inicial
onMounted(() => {
  const mockFilmes = [
    {
      id: 1,
      title: "Elephants Dream",
      description: "Uma experiência surrealista em um mundo mecânico e misterioso.",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtGF_fA2aM-xLb5WF4PyXAOpGkRuBFH241dg&s", 
      video: "https://www.w3schools.cohttps://download.blender.org/durian/trailer/sintel_trailer-480p.mp4m/html/mov_bbb.mp4",
      categoria: "Ação"
    },
    {
      id: 2,
      title: "Noite Cômica",
      description: "Uma comédia leve.",
      img: "https://via.placeholder.com/200x300",
      video: "https://www.w3schools.com/html/movie.mp4",
      categoria: "Humor"
    },
    { id: 3, title: "Pesadelo Urbano", description: "Terror psicológico.", img: "https://upload.wikimedia.org/wikipedia/pt/2/26/Urban_Legends_Final_Cut.jpg", categoria: "Terror" },
    { id: 4, title: "Guerra de Titãs", description: "Ação épica e brutal.", img: "https://upload.wikimedia.org/wikipedia/pt/f/f9/Clash_of_the_Titans_P%C3%B4ster.jpg", categoria: "Ação" },
    { id: 5, title: "Piadas do Caos", description: "Humor nonsense.", img: "https://via.placeholder.com/200x300", categoria: "Humor" },
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
  localStorage.removeItem("usuarioLogado") // Limpa o usuário logado
  router.push("/login")
}

function scrollRow(cat, direction) {
  const rowElement = carrosselRefs.value[cat]
  if (rowElement) {
    // Rola 80% da largura do carrossel
    const scrollAmount = rowElement.offsetWidth * 0.8 * direction; 
    rowElement.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
}
</script>