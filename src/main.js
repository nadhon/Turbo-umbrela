import { createApp } from "vue";
import App from './App.vue'
import './main.css'
import {router} from './router'
import Cadastro from './templates/Cadastro.vue'
import Home from "./templates/Home.vue";
import Login from "./templates/Login.vue";

createApp(App).use(router).mount('#app')