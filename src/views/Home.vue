<template>
  <div class="home">
    <!-- HEADER -->
    <header class="header">
      <div class="logo">Turbo-Umbrela</div>
      <input v-model="busca" class="buscar" placeholder="Buscar..." />
      <nav>
        <button @click="sair">Sair</button>
      </nav>
    </header>

    <!-- BANNER -->
    <section class="banner" v-if="bannerFilm">
      <div class="bannerVideo">
        <video
          v-if="bannerFilm.video"
          ref="bannerVideo"
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

    <!-- CATEGORIAS -->
    <main class="conteudo">
      <section v-for="(filmesCat, cat) in filmesPorCategoria" :key="cat" class="categoria">
        <h2>{{ cat }}</h2>
        <div class="carrossel">
          <button class="nav left" @click="scrollRow(-1)"><</button>
          <div
            v-for="filme in filmesCat"
            :key="filme.id"
            class="filme-card"
            @click="assistirFilme(filme)"
            @mouseenter="startCardPreview(filme, $event)"
            @mouseleave="stopCardPreview(filme, $event)"
          >
          <video class="card-preview" style="display:none"></video>
            <img :src="filme.img" :alt="filme.title" />
            <div class="filme-overlay">
              <h4>{{ filme.title }}</h4>
              <button @click.stop="toggleFavorito(filme)">
                {{ favoritosIds.includes(filme.id) ? '💔' : '❤️' }}
              </button>
            </div>
          </div>
          <button class="nav right" @click="scrollRow(1)">></button>
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
            @mouseenter="startCardPreview(filme, $event)"
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
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const busca = ref('')
const filmes = ref([])
const favoritosIds = ref([])
const bannerFilm = ref(null)

// controle do ciclo do banner
const index = ref(0)
let timerID = null
const VIDEO_DURATION = 30 * 1000
const IMAGE_DURATION = 8 * 1000

// ref para o elemento de video
const bannerVideo = ref(null)

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
    { id: 3, title: "Pesadelo Urbano", description: "Terror psicológico", img: "https://upload.wikimedia.org/wikipedia/pt/2/26/Urban_Legends_Final_Cut.jpg", categoria: "Terror" },
    { id: 4, title: "Guerra de Titãs", description: "Ação épica e brutal", img: "https://via.placeholder.com/800x400", categoria: "Ação" },
    { id: 5, title: "Piadas do Caos", description: "Humor nonsense", img: "https://via.placeholder.com/800x400", categoria: "Humor" },
  ]
  filmes.value = JSON.parse(localStorage.getItem("filmes")) || mockFilmes
  favoritosIds.value = JSON.parse(localStorage.getItem("favoritosIds")) || []
  index.value = 0
  bannerFilm.value = filmes.value[index.value] || null
  localStorage.setItem("filmes", JSON.stringify(filmes.value))
  
  startBannerCycle()
  nextTick(() => {
    if(bannerVideo.value){
      bannerVideo.value.addEventListener("timeupdate", () =>{
        if (bannerVideo.value.currentTime >= 10){
          bannerVideo.value.currentTime = 2
        }
      })
    }

  })
})
onBeforeUnmount(() => {
  stopBannerCycle()
})

function atualizarBannerPorIndex(){
  bannerFilm.value = filmes.value[index.value] || null

  // se for vídeo, tenta dar play depois do render
  if(bannerFilm.value && bannerFilm.value.video){
    nextTick(() =>{
      try {
        if(bannerVideo.value && typeof bannerVideo.value.play === 'function'){
          bannerVideo.value.currentTime = 0
          bannerVideo.value.play().catch(()=>{null})
        }
      } catch(e){}
    })
  }
}

function proximoBanner(){
  if(!filmes.value || filmes.value.length === 0) {
    bannerFilm.value = null
    return
  }
  index.value = (index.value + 1) %filmes.value.length
  atualizarBannerPorIndex()
}

function agendarProximaTroca(){
  stopBannerCycle()
  if (!bannerFilm.value) return

  const temVideo = !!bannerFilm.value.video
  const dur = temVideo ? VIDEO_DURATION : IMAGE_DURATION

  timerID = setTimeout(() =>{
    proximoBanner()
    agendarProximaTroca()
  }, dur)
}

function startBannerCycle(){
  atualizarBannerPorIndex()
  agendarProximaTroca()
}

function stopBannerCycle(){
  if(timerID) { clearTimeout(timerID); timerID = null}
}

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
function startCardPreview(filme, event){
  const el = event.currentTarget.querySelector('video.card-preview')
  if (!el) return
  const src = filme.preview || filme.video
  if (!src) return
  event.currentTarget.querySelector('img').style.display = 'none'
  el.src = src
  el.muted = true
  el.play().catch(() =>{})
  el.style.display = 'block'
}
function stopCardPreview(filme, event){
  const el = event.currentTarget.querySelector('video.card-preview')
  if(!el) return
  el.pause()
  el.style.display = 'none'
  event.currentTarget.querySelector('img').style.display = 'block'
}

function sair() {
  router.push("/login")
}
</script>