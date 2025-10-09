<template>
    <div>
        <h1>{{ filme.titulo }}</h1>
        <video ref="videoPlayer" :src="filme.url" controls></video>
        <div class="controles">
            <button @click="voltar">Voltar</button>
            <button @click="playVideo">Play</button>
            <button @click="pauseVideo">Pause</button>
            <button @click="stopVideo">Stop</button>
            <button @click="voltar">Voltar</button>
            <button @click="sair">Sair</button>
        </div> 
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const route = useRouter()
const router = useRouter()
const videoPlayer = ref(null)
const filme = JSON.parse(localStorage.getItem('filmeSelecionado')) || { titulo: 'Filme não encontrado', url: '' }
const index = Number(route.params.id)
const filme = filmes[index] || { titulo: 'Filme não encontrado', url: '' }

function voltar(){
    if(videoPlayer.value) videoPlayer.value.currentTime -= 15
}
function avançar(){
    if(videoPlayer.value) videoPlayer.value.currentTime += 15
}
function playVideo(){
    if(videoPlayer.value) videoPlayer.value.play()
}
function pauseVideo(){
    if(videoPlayer.value) videoPlayer.value.pause()
}
function stopVideo(){
    if(videoPlayer.value) {
        videoPlayer.value.pause()
        videoPlayer.value.currentTime = 0
    }
}
function sair(){
    router.push('/home')
}

</script>