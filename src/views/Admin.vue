<template>
  <div class="admin-panel">
    <h1>Admin Panel</h1>

    <!-- Gerenciar Filmes -->
    <section>
      <h2>Gerenciar Filmes</h2>
      <form @submit.prevent="adicionarFilme">
        <input v-model="titulo" placeholder="Título do Filme" />
        <input v-model="descricao" placeholder="Descrição" />
        <input v-model="url" placeholder="URL do Vídeo" />
        <input v-model="img" placeholder="URL da Imagem" />
        <button type="submit">Adicionar Filme</button>
      </form>

      <h3>Filmes Cadastrados</h3>
      <ul>
        <li v-for="filme in filmes" :key="filme.id">
          <img :src="filme.img" alt="Capa do Filme" style="width: 100px; margin-right: 10px;" />
          <strong>{{ filme.title }}</strong> - {{ filme.description }}
          <button @click="editarFilme(filme.id)">✏️</button>
          <button @click="deletarFilme(filme.id)">❌</button>
        </li>
      </ul>
    </section>

    <!-- Lista de Usuários -->
    <section>
      <h2>Usuários Cadastrados</h2>
      <ul>
        <li v-for="user in usuarios" :key="user.email">
          {{ user.nome }} - {{ user.email }} - Tipo: {{ user.tipo }}
          <button @click="deletarUsuario(user.email)">❌</button>
        </li>
      </ul>
      <h2>Total de Usuários: {{ usuarios.length }}</h2>
    </section>

    <button @click="sair">Sair</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const titulo = ref('')
const descricao = ref('')
const url = ref('')
const img = ref('')
const filmes = ref([])
const usuarios = ref([])

onMounted(() => {
  filmes.value = JSON.parse(localStorage.getItem('filmes')) || []
  usuarios.value = JSON.parse(localStorage.getItem('usuarios')) || []
})

function adicionarFilme() {
  if (!titulo.value || !descricao.value || !url.value || !img.value) {
    alert('Por favor, preencha todos os campos!')
    return
  }

  const novoFilme = {
    id: Date.now(),
    title: titulo.value,
    description: descricao.value,
    url: url.value,
    img: img.value,
    categoria: 'Sem Categoria'
  }

  filmes.value.push(novoFilme)
  localStorage.setItem('filmes', JSON.stringify(filmes.value))

  // Reset campos
  titulo.value = ''
  descricao.value = ''
  url.value = ''
  img.value = ''

  alert('Filme adicionado com sucesso!')
}

function deletarFilme(id) {
  filmes.value = filmes.value.filter(f => f.id !== id)
  localStorage.setItem('filmes', JSON.stringify(filmes.value))
}
function editarFilme(id) {
  const filme = filmes.value.find(f => f.id === id)
  if (!filme) return

  const novoTitulo = prompt('Novo título:', filme.title)
  const novaDescricao = prompt('Nova descrição:', filme.description)
  const novaUrl = prompt('Nova URL do vídeo:', filme.url)
  const novaImg = prompt('Nova URL da imagem:', filme.img)

  if (novoTitulo) filme.title = novoTitulo
  if (novaDescricao) filme.description = novaDescricao
  if (novaUrl) filme.url = novaUrl
  if (novaImg) filme.img = novaImg

  localStorage.setItem('filmes', JSON.stringify(filmes.value))
}
function deletarUsuario(email) {
  if (confirm('Tem certeza que deseja deletar este usuário?')) {
    usuarios.value = usuarios.value.filter(u => u.email !== email)
    localStorage.setItem('usuarios', JSON.stringify(usuarios.value))
  }
}

function sair() {
  localStorage.removeItem('usuarioLogado')
  router.push('/login')
}
</script>