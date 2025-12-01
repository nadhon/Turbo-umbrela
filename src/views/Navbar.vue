<template>
  <header class="nav">
    <div class="nav-left">
      <img src="../views/img/logo02.png" alt="Logo" class="logo" />

      <router-link to="/home" class="nav-link">Home</router-link>
      <router-link to="/home" class="nav-link">Séries</router-link>
      <router-link to="/home" class="nav-link">Filmes</router-link>
    </div>

    <div class="nav-center">
      <input 
        type="text" 
        v-model="busca"
        placeholder="Pesquisar..." 
        class="search-input"
      />
    </div>
    <div class="nav-right">
      <button class="logout-btn" @click="sair">Sair</button>
    </div>

  </header>
</template>
<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

const busca = ref('')

const router = useRouter()

function sair(){
    router.push("/login")
}
</script setup>

<style scoped>
.nav {
  width: 100%;
  height: 70px;
  background: #0d1117;
  border-bottom: 1px solid #222;
  display: flex;
  align-items: center;
  padding: 0 30px;
  gap: 30px;
  position: fixed;
  top: 0;
  z-index: 1000;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 25px;
}

.logo {
  height: 40px;
}

.nav-link {
  color: #fff;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  transition: color .3s;
}

.nav-link:hover {
  color: #1e90ff;
}

.nav-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.search-input {
  width: 60%;
  max-width: 450px;
  padding: 8px 14px;
  border-radius: 8px;
  background: #222;
  border: none;
  color: #fff;
  outline: none;
}

.logout-btn {
  position: relative;
  align-self: start;
  background: transparent;
  border: 1px solid #666;
  padding: 18px 140px;
  border-radius: 60px;
  color: #fff;
  cursor: pointer;
  transition: .3s;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: #1e90ff;
}
</style>
