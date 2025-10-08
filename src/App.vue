<template>
  <div>
    <nav>
      <router-link to="/login">Login</router-link> |
      <router-link to="/cadastro">Cadastro</router-link> |
      <router-link to="/home">Home</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'App',
};
</script>