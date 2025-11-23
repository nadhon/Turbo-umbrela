<template>
  <div class="admin-panel">
    <h1>Admin Panel</h1>

    <!-- Gerenciar Filmes -->
    <section>
      <h2>Gerenciar Filmes</h2>
      <form @submit.prevent="adicionarFilme">
        <input v-model="titulo" placeholder="Título do Filme" />
        <input v-model="descricao" placeholder="Descrição" />
        <input v-model="categoria" placeholder="Categoria"/>
        <input v-model="url" placeholder="URL do Vídeo" />
        <input v-model="img" placeholder="URL da Imagem" />
        <button type="submit">Adicionar Filme</button>
      </form>

      <h3>Filmes Cadastrados</h3>
      <ul>
        <li v-for="filme in filmes" :key="filme.id">
          <img :src="filme.img" alt="Capa do Filme" style="width: 100px; margin-right: 10px;" />
          <strong>{{ filme.title }}</strong> - {{ filme.description }} - <strong>{{ filme.categoria }}</strong>
          <button @click="editarFilme(filme.id)"> ✏️</button>
          <button @click="deletarFilme(filme.id)"> ❌</button>
        </li>
      </ul>

      <!-- Filmes agrupados por categoria (adicionado) -->
      <h3>Filmes por Categoria</h3>
      <div v-for="cat in todasCategorias" :key="cat">
        <h4>{{ cat }}</h4>
        <ul>
          <li v-for="filme in filmes.filter(f => f.categoria === cat)" :key="filme.id">
            <img :src="filme.img" alt="" style="width: 80px; margin-right: 10px;">
            {{ filme.title }}
          </li>
        </ul>
        <p v-if="filmes.filter(f => f.categoria === cat).length === 0">Nenhum filme nessa categoria.</p>
      </div>
    </section>

    <!-- Gerenciar Categorias (simples) -->
    <section>
      <h2>Gerenciar Categorias</h2>
      <input v-model="novaCategoria" placeholder="Nova categoria" />
      <button @click="adicionarCategoria">Adicionar Categoria</button>

      <ul>
        <li v-for="cat in categorias" :key="cat">
          {{ cat }}
          <button @click="deletarCategoria(cat)">❌</button>
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
const categoria = ref('')

// novas refs para categorias
const categorias = ref([])
const novaCategoria = ref('')

const filmes = ref([])
const usuarios = ref([])

onMounted(() => {
  filmes.value = JSON.parse(localStorage.getItem('filmes')) || []
  usuarios.value = JSON.parse(localStorage.getItem('usuarios')) || []
  categorias.value = JSON.parse(localStorage.getItem('categorias')) || []
})

// computed simples: todas categorias disponíveis (combina categorias salvas + categorias presentes nos filmes)
function getCategoriasUnicas() {
  const fromFilmes = filmes.value.map(f => f.categoria).filter(Boolean)
  const all = [...new Set([...categorias.value, ...fromFilmes])]
  return all
}
const todasCategorias = getCategoriasUnicas()

// atualizar lista de categorias no localStorage
function salvarCategoriasStorage() {
  localStorage.setItem('categorias', JSON.stringify(categorias.value))
}

function adicionarCategoria() {
  const nome = (novaCategoria.value || '').trim()
  if (!nome) {
    alert('Digite um nome para a categoria!')
    return
  }
  if (!categorias.value.includes(nome)) {
    categorias.value.push(nome)
    salvarCategoriasStorage()
  }
  novaCategoria.value = ''
}

function deletarCategoria(cat) {
  if (!confirm(`Deletar categoria "${cat}"? Isso não remove filmes.`)) return
  categorias.value = categorias.value.filter(c => c !== cat)
  salvarCategoriasStorage()
}

function adicionarFilme() {
  if (!titulo.value || !descricao.value || !categoria.value || !url.value || !img.value) {
    alert('Por favor, preencha todos os campos!')
    return
  }

  const novoFilme = {
    id: Date.now(),
    title: titulo.value,
    description: descricao.value,
    url: url.value,
    img: img.value,
    categoria: categoria.value
  }

  filmes.value.push(novoFilme)
  localStorage.setItem('filmes', JSON.stringify(filmes.value))

  // se a categoria não estiver na lista de categorias, adiciona automaticamente
  if (categoria.value && !categorias.value.includes(categoria.value)) {
    categorias.value.push(categoria.value)
    salvarCategoriasStorage()
  }

  // Reset campos
  titulo.value = ''
  descricao.value = ''
  categoria.value = ''
  url.value = ''
  img.value = ''

  alert('Filme adicionado com sucesso!')
}

function deletarFilme(id) {
  if (!confirm('Excluir este filme permanentemente?')) return
  filmes.value = filmes.value.filter(f => f.id !== id)
  localStorage.setItem('filmes', JSON.stringify(filmes.value))
}

function editarFilme(id) {
  const filme = filmes.value.find(f => f.id === id)
  if (!filme) return

  const novoTitulo = prompt('Novo título:', filme.title)
  const novaDescricao = prompt('Nova descrição:', filme.description)
  const novaCategoria = prompt('Nova categoria: ', filme.categoria)
  const novaUrl = prompt('Nova URL do vídeo:', filme.url)
  const novaImg = prompt('Nova URL da imagem:', filme.img)

  if (novoTitulo) filme.title = novoTitulo
  if (novaDescricao) filme.description = novaDescricao
  if (novaCategoria) {
    filme.categoria = novaCategoria
    // garante que a categoria editada esteja registrada nas categorias
    if (!categorias.value.includes(novaCategoria)) {
      categorias.value.push(novaCategoria)
      salvarCategoriasStorage()
    }
  }
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
