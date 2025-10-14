<template>
  <div class="video-player-wrapper">
    <h1>{{ filme.title }}</h1>
    
    <video ref="videoPlayer" controls class="video-player">
      <source :src="videoAtual.url" type="video/mp4" />
    </video>

    <!-- Botões de Resolução -->
    <div class="resolucao">
      <span>Resolução:</span>
      <button
        v-for="src in videoSources"
        :key="src.ref"
        @click="mudarResolucao(src)"
        :class="{ ativo: videoAtual.ref === src.ref }"
      >
        {{ src.ref }}
      </button>
      
    </div>

    <!-- Controles do Vídeo -->
    <div class="controles">
      <button @click="voltar">« 15s</button>
      <button @click="playVideo">▶ Play</button>
      <button @click="pauseVideo">⏸ Pause</button>
      <button @click="stopVideo">⏹ Stop</button>
      <button @click="avancar">15s »</button>
      <button @click="sair">Sair</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const videoPlayer = ref(null)

const filme = JSON.parse(localStorage.getItem('filmeSelecionado')) || {
  title: 'Filme não encontrado',
  url: '',
  url360: '',
  url720: '',
  url1080: ''
}

const videoSources = ref([
  { ref: '360p', url: filme.url360 || filme.url },
  { ref: '720p', url: filme.url720 || filme.url },
  { ref: '1080p', url: filme.url1080 || filme.url }
])

const videoAtual = ref(videoSources.value[0])

function mudarResolucao(source) {
  const tempo = videoPlayer.value.currentTime
  const pausado = videoPlayer.value.paused
  videoAtual.value = source
  videoPlayer.value.src = source.url
  videoPlayer.value.currentTime = tempo
  if (!pausado) videoPlayer.value.play()
}

function playVideo() { videoPlayer.value?.play() }
function pauseVideo() { videoPlayer.value?.pause() }
function stopVideo() { if(videoPlayer.value){ videoPlayer.value.pause(); videoPlayer.value.currentTime = 0 } }
function voltar() { if(videoPlayer.value) videoPlayer.value.currentTime -= 15 }
function avancar() { if(videoPlayer.value) videoPlayer.value.currentTime += 15 }
function sair() { router.push('/home') }
</script>