<template>
  <div>
    <h1>Turbo umbrela</h1>
    <nav>
      <router-link to="/login">Login</router-link> |
      <router-link to="/cadastro">Cadastro</router-link> |
      <router-link to="/home">Home</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script setup>
import {ref} from "vue"
</script>
<style>
body {
  margin:0;
  font-family: Arial, sans-serif;
  background: #f8fff6;
}
</style>
