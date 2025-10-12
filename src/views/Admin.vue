<template>
    <div>
        <h1>Admin Panel</h1>
        <h1>Gerenciar Filmes</h1>
        <form @submit.prevent="adicionarFilme">
            <input v-model="titulo" placeholder="Título do Filme" />
            <input v-model="descricao" placeholder="Descrição" />
            <input v-model="url" placeholder="URL do Vídeo" />
            <input v-model="img" placeholder="URL da Imagem" />
            <button type="submit">Adicionar Filme</button>
        </form>
        <h2>Filmes Cadastrados</h2>
        <ul>
            <li v-for="(filme, index) in filmes" :key="index">
                <img :src="filme.img" alt="Capa do Filme" style="width: 100px; height: auto; margin-right: 10px;" />
                <strong>{{ filme.titulo }}</strong>
            </li>
        </ul>
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

onMounted(() => {
    filmes.value = JSON.parse(localStorage.getItem('filmes')) || []
    })
function adicionarFilme() {
    if(!titulo.value || !descricao.value || !url.value || !img.value){
        alert('Por favor, preencha todos os campos!')
        return
    }
    const novoFilme = {
        titulo: titulo.value,
        descricao: descricao.value,
        url: url.value,
        img: img.value
    }
    filmes.value.push(novoFilme)
    localStorage.setItem('filmes', JSON.stringify(filmes.value))
    titulo.value = ''
    descricao.value = ''
    url.value = ''
    img.value = ''
    alert('Filme adicionado com sucesso!')
}
function sair(){
    localStorage.removeItem('usuarioLogado') // Opcional: deslogar o usuário
    router.push('/login')
}
</script>