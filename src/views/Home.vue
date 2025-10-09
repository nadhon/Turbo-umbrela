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
      <section class="planos">
        <h1>Filmes em destaque</h1>
        <div class="planos-container">
          <div
            v-for="filme in filmes"
            :key="filme.id"
            class="plano"
          >
            <img
              :src="filme.img"
              :alt="filme.titulo"
              style="width: 100%; border-radius: 8px; margin-bottom: 10px;"
            />
            <p>{{ filme.titulo }}</p>
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
