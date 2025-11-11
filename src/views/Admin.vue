<template>
  <div class="admin-panel">
    <h1>Admin Panel</h1>

    <!-- Gerenciar Categorias -->
    <section>
      <form @submit.prevent="adicionarCategoria">
        <input v-model="novaCategoria" placeholder="Nova Categoria"/>
        <button type="submit">Adicionar Categoria</button>
      </form>
      <div class="categorias-list">
        <button v-for="c in categorias" :key="c" @click="removerCategoria(c)">x{{ c }}</button>
      </div>
    </section>

    <!-- Gerenciar Filmes -->
    <section>
      <h2>Gerenciar Filmes</h2>
      <form @submit.prevent="adicionarFilme">
        <input v-model="titulo" placeholder="Título"/>
        <input v-model="descricao" placeholder="Descrição"/>
        <input v-model="url" placeholder="URL do Vídeo"/>
        <input v-model="img" placeholder="URL da Imagem"/>
        <select v-model="categoria">
          <option disabled value="">Selecione uma Categoria</option>
          <option v-for="c in categorias" :key="c" :value="c">{{ c }}</option>
        </select>
        <button type="submit">Adicionar Filme</button>
      </form>
      <h3>Filmes Cadastrados</h3>
      <ul>
        <li v-for="filme in filmes" :key="filme.id">
          <img :src="filme.img" alt="Capa do Filme" style="width: 100px; margin-right: 10px;"/>
          <strong>{{ filme.title  }}</strong> - {{ filme.description }} ({{ filme.categoria }})
          <button @click="iniciarEdicao(filme)">✏️</button>
          <button @click="deletarFilme(filme.id)">🗑️</button>
        </li>
      </ul>
    </section>
    <!-- Lista de Usuários -->
     <section>
      <h2>Usuários Cadastrados</h2>
      <ul class="usuarios-list">
        <li v-for="user in usuarios" :key="user.uid">
          {{ user.nome || user.email }} - {{ user.email }} - Tipo: {{ user.tipo || 'user'}}
          <button @click="removerUsuario(user.uid)">🗑️</button>
        </li>
      </ul>
      <h2>Total de Usuários: {{ usuarios.length }}</h2>
     </section>

    <button @click="sair">Sair</button>

    <!-- Modal edição simples -->
     <div v-if="editando" class="modal">
      <div class="modal-body">
        <h3>Editando: {{ editando.title }}</h3>
        <input v-model="editando.title" />
        <input v-model="editando.description" />
        <input v-model="editando.url" />
        <input v-model="editando.img" />
        <select v-model="editando.categoria">
          <option v-for="c in categorias" :key="c" :value="c">{{ c }}</option>
        </select>
        <button @click="salvarEdicao">Salvar</button>
        <button @click="cancelarEdicao">Cancelar</button>
      </div>
     </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase.js';
import { signOut } from 'firebase/auth';

const router = useRouter();

const titulo = ref('');
const descricao = ref('');
const url = ref('');
const img = ref('');
const categoria = ref('');
const novaCategoria = ref('');

const filmes = ref([]);
const usuarios = ref([]);
const categorias = ref(['Ação', 'Comédia', 'Drama', 'Terror',
  'Ficção Científica']);
const editando = ref(null);
onMounted(async () => {
  await carregarCategorias();
  await carregarFilmes();
  await carregarUsuarios();
});

async function carregarFilmes(){
  const snap = await getDocs(collection(db, 'filmes'));
  filmes.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function adicionarFilme(){
  if(!titulo.value || !descricao.value || !url.value || !img.value || !categoria.value){
    alert('Preencha todos os campos!');
    return;
  }
  await addDoc(collection(db, 'filmes'), {
    title: titulo.value,
    description: descricao.value,
    url: url.value,
    img: img.value,
    categoria: categoria.value,
    createdAt: Date.now()
  })
  titulo.value = descricao.value = url.value = img.value = categoria.value = ''
  await carregarFilmes();
}
async function deletarFilme(id){
  if (!confirm('Deletar filme?')) return;
  await deleteDoc(doc(db, 'filmes', id));
  await carregarFilmes();
}
function iniciarEdicao(f){
  editando.value = { ...f };
}
async function salvarEdicao(){
  const refDoc = doc(db, 'filmes', editando.value.id);
  const { id, ...payload } = editando.value;
  await updateDoc(refDoc, payload);
  editando.value = null;
  await carregarFilmes();
}
function cancelarEdicao(){ editando.value = null}

async function adicionarCategoria(){
  if(!novaCategoria.value) return;
  // cria doc com id automático com campo name
  await addDoc(collection(db, 'categorias'), { name: novaCategoria.value });
  novaCategoria.value = '';
  await carregarCategorias();
}

async function carregarCategorias(){
  try {
    const snap = await getDocs(collection(db, 'categorias'));
    categorias.value = snap.docs.map(d => d.data().name);
  } catch (err){
    console.warn('Erro ao carregar categorias, usando fallback',err);
    if (!categorias.value || !categorias.value.length){
      categorias.value = ['Sem Categoria', 'Ação', 'Comédia', 'Drama', 'Terror',
        'Ficção Científica'];
      }
  }
}

async function removerCategoria(name){
  if (!confirm('Remover categoria?')) return;
  // busca doc e deleta(simples)
  const snap = await getDocs(collection(db, 'categorias'))
  const toDelete = snap.docs.find(d => d.data().name === name);
  if(toDelete) await deleteDoc (doc(db, 'categorias', toDelete.id))
  await carregarCategorias();
}
async function carregarUsuarios(){
  const snap = await getDocs(collection(db, 'usuarios'))
  usuarios.value = snap.docs.map(d => ({ uid: d.id, ...d.data() }))
}

async function removerUsuario(uid){
  if(!confirm('Remover usuário e seus dados?')) return;
  await deleteDoc (doc(db, 'usuarios', uid))
  await carregarUsuarios();
}
async function sair(){
  await signOut(auth);
  router.push('/login');
}
</script>