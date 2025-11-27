<template>
  <div class="home">
    <section class="banner" v-if="bannerFilm">
      <img :src="bannerFilm.img" class="banner-bg" />
      <div class="banner-info">
        <h1>{{ bannerFilm.title }}</h1>
        <p>{{ bannerFilm.description }}</p>
        <button @click="assistirFilme(bannerFilm)">▶ Assistir</button>
      </div>
    </section>

    <section v-if="novidades.length" class="categoria novidades">
      <h2>🔥 Novidades do ADM</h2>
      <div class="carrossel">
        <div
          v-for="filme in novidades"
          :key="filme.id"
          class="filme-card"
          @click="assistirFilme(filme)"
        >
          <img :src="filme.img" />
          <p>{{ filme.title }}</p>
        </div>
      </div>
    </section>

    <section v-for="cat in categorias" :key="cat" class="categoria">
      <h2>{{ cat }}</h2>
      <div class="carrossel">
        <div
          v-for="filme in filmesPorCategoria(cat)"
          :key="filme.id"
          class="filme-card"
          @click="assistirFilme(filme)"
        >
          <img :src="filme.img" />
          <p>{{ filme.title }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
const router = useRouter()

const filmesAdmin = JSON.parse(localStorage.getItem("filmes")) || []

const filmesFixos = [
  { id: 1, title: "Homem de Aço", description: "Novo lançamento", img: "https://upload.wikimedia.org/wikipedia/pt/thumb/3/3b/Man_of_Steel%28filme%29.jpg/250px-Man_of_Steel%28filme%29.jpg", categoria: "Ação", novidade: true, url: "/videos/manofsteel.mp4", url360: "/videos/manofsteel-360.mp4" },
  { id: 2, title: "Duna Parte 2", description: "Estreia exclusiva", img: "https://m.media-amazon.com/images/M/MV5BNzk5MTE4YTUtNGU2My00MTYxLWE5NGItODk4YWFkOWYyMjA5XkEyXkFqcGc@._V1_.jpg", categoria: "Ficção", novidade: true, url: "/videos/duna2.mp4", url720: "/videos/duna2-720.mp4" },
  { id: 3, title: "Godzilla x Kong", description: "Batalha épica", img: "https://upload.wikimedia.org/wikipedia/pt/5/5e/Godzilla_x_Kong_-_The_New_Empire.jpg", categoria: "Ação", novidade: true, url: "/videos/godzillakong.mp4" },

  { id: 4, title: "Vingadores", categoria: "Ação", img: "https://upload.wikimedia.org/wikipedia/pt/thumb/9/9b/Avengers_Endgame.jpg/250px-Avengers_Endgame.jpg", novidade: false, url: "/videos/vingadores.mp4" },
  { id: 5, title: "Batman", categoria: "Ação", img: "https://m.media-amazon.com/images/S/pv-target-images/f9a8389e22a1b2a859d4b58a501964839f8c253f61b2c85b00b7f75954e05e90.jpg", novidade: false, url: "/videos/batman.mp4" },
  { id: 6, title: "John Wick", categoria: "Ação", img: "https://upload.wikimedia.org/wikipedia/pt/1/13/John_wick_ver3.jpg", novidade: false, url: "/videos/johnwick.mp4" },
  { id: 7, title: "Gladiador", categoria: "Ação", img: "https://images.justwatch.com/poster/322099104/s718/gladiator-2.jpg", novidade: false, url: "/videos/gladiador.mp4" },
  { id: 8, title: "Mad Max", categoria: "Ação", img: "https://m.media-amazon.com/images/I/91ZaNnJP2uL._AC_UF894,1000_QL80_.jpg", novidade: false, url: "/videos/madmax.mp4" },

  { id: 9, title: "Matrix", categoria: "Ficção", img: "https://br.web.img2.acsta.net/medias/nmedia/18/91/08/82/20128877.JPG", novidade: false, url: "/videos/matrix.mp4" },
  { id: 10, title: "Interestelar", categoria: "Ficção", img: "https://images.justwatch.com/poster/312160153/s718/interestelar.jpg", novidade: false, url: "/videos/interestelar.mp4" },
  { id: 11, title: "Blade Runner", categoria: "Ficção", img: "https://upload.wikimedia.org/wikipedia/pt/thumb/b/bb/BladeRunner-P%C3%B4ster.jpg/250px-BladeRunner-P%C3%B4ster.jpg", novidade: false, url: "/videos/bladerunner.mp4" },
  { id: 12, title: "Avatar", categoria: "Ficção", img: "https://upload.wikimedia.org/wikipedia/pt/b/b0/Avatar-Teaser-Poster.jpg", novidade: false, url: "/videos/avatar.mp4" },
  { id: 13, title: "Star Wars", categoria: "Ficção", img: "https://m.media-amazon.com/images/I/81WMUxNTRYL._AC_UF894,1000_QL80_.jpg", novidade: false, url: "/videos/starwars.mp4" },

  { id: 14, title: "Toy Story", categoria: "Animação", img: "https://br.web.img3.acsta.net/medias/nmedia/18/91/05/36/20127436.jpg", novidade: false, url: "/videos/toystory.mp4" },
  { id: 15, title: "Kung Fu Panda", categoria: "Animação", img: "https://upload.wikimedia.org/wikipedia/pt/thumb/7/76/Kungfupanda.jpg/250px-Kungfupanda.jpg", novidade: false, url: "/videos/kungfupanda.mp4" },
  { id: 16, title: "Frozen", categoria: "Animação", img: "https://br.web.img3.acsta.net/c_310_420/pictures/210/461/21046189_20131002174340886.jpg", novidade: false, url: "/videos/frozen.mp4" },
  { id: 17, title: "Shrek", categoria: "Animação", img: "https://br.web.img2.acsta.net/medias/nmedia/18/91/54/04/20150812.jpg", novidade: false, url: "/videos/shrek.mp4" },

  { id: 18, title: "Jogos Mortais", categoria: "Terror", img: "https://p2.trrsf.com/image/fget/cf/1200/1600/middle/images.terra.com/2023/09/27/1617601805-jogos-mortais-x.jpg", novidade: false, url: "/videos/jogosmortais.mp4" },
  { id: 19, title: "Invocação do Mal", categoria: "Terror", img: "https://m.media-amazon.com/images/I/91UQCBxB+cL._AC_UF894,1000_QL80_.jpg", novidade: false, url: "/videos/invocacaodomal.mp4" },
  { id: 20, title: "O Exorcista", categoria: "Terror", img: "https://br.web.img2.acsta.net/medias/nmedia/18/87/26/84/19873738.jpg", novidade: false, url: "/videos/exorcista.mp4" },

  { id: 21, title: "As Branquelas", categoria: "Comédia", img: "https://upload.wikimedia.org/wikipedia/pt/thumb/d/de/White_chicks.jpeg/250px-White_chicks.jpeg", novidade: false, url: "/videos/asbranquelas.mp4" },
  { id: 22, title: "Todo Mundo em Pânico", categoria: "Comédia", img: "https://http2.mlstatic.com/D_NQ_NP_991525-MLA80251322988_112024-OO.jpg", novidade: false, url: "/videos/todomundoempanico.mp4" },
  { id: 23, title: "Gente Grande", categoria: "Comédia", img: "https://br.web.img3.acsta.net/pictures/210/299/21029996_20130821205722213.jpg", novidade: false, url: "/videos/gentegrande.mp4" },
  { id: 24, title: "American Pie", categoria: "Comédia", img: "https://cinema10.com.br/upload/featuredImage.php?url=https%3A%2F%2Fcinema10.com.br%2Fupload%2Ffilmes%2Ffilmes_993_American-Pie-4-Poster.jpg", novidade: false, url: "/videos/americanpie.mp4" }
]

const filmes = ref([...filmesFixos, ...filmesAdmin])

const novidades = computed(() => filmes.value.filter(f => f.novidade))

const bannerFilm = ref(null)
let index = 0
function trocarBanner() {
  if (!novidades.value.length) return
  bannerFilm.value = novidades.value[index]
  index = (index + 1) % novidades.value.length
}

onMounted(() => {
  trocarBanner()
  setInterval(trocarBanner, 5000)
})

const categorias = computed(() => {
  const set = new Set()
  filmes.value.forEach(f => {
    if (Array.isArray(f.categoria)) f.categoria.forEach(c => set.add(c))
    else if (f.categoria) set.add(f.categoria)
  })
  return [...set]
})

function filmesPorCategoria(cat) {
  return filmes.value.filter(f => {
    if (Array.isArray(f.categoria)) return f.categoria.includes(cat)
    return f.categoria === cat
  })
}

function assistirFilme(filme) {
  const payload = {
    id: filme.id ?? Date.now(),
    title: filme.title ?? filme.titulo ?? "Sem título",
    description: filme.description ?? filme.descricao ?? "",
    img: filme.img ?? filme.coverUrl ?? filme.capa ?? "",
    url: filme.url ?? filme.videoUrl ?? filme.videoURL ?? ""
  }
  localStorage.setItem("filmeSelecionado", JSON.stringify(payload))
  router.push("/player")
}
</script>

<style scoped>
.home {
  background: #000;
  color: white;
  min-height: 100vh;
}

.banner {
  height: 80vh;
  position: relative;
  overflow: hidden;
}

.banner-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  filter: brightness(0.7);
}

.banner::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3),
    rgba(0, 0, 0, 0.9)
  );
}

.banner-info {
  position: absolute;
  bottom: 80px;
  left: 50px;
  max-width: 500px;
  z-index: 2;
}

.banner-info h1 {
  font-size: 3rem;
  margin-bottom: 10px;
}

.banner-info p {
  font-size: 1.1rem;
  line-height: 1.4;
  margin-bottom: 15px;
}

.banner-info button {
  padding: 10px 25px;
  background: #e50914;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.3s;
}

.banner-info button:hover {
  background: #b00610;
}

.categoria {
  padding: 20px;
}

.novidades {
  background: #111;
  border-top: 2px solid #e50914;
}

.carrossel {
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding: 10px 0;
}

.filme-card {
  min-width: 180px;
  cursor: pointer;
  transition: 0.3s;
}

.filme-card:hover {
  transform: scale(1.05);
}

.filme-card img {
  width: 180px;
  height: 260px;
  border-radius: 6px;
  object-fit: cover;
}

.filme-card p {
  text-align: center;
  margin-top: 5px;
  font-size: 0.9rem;
}
</style>
