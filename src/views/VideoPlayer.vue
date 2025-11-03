<template>
  <div class="video-player-wrapper"
        @mousemove="resetHideTimer"
        @click="resetHideTimer"
        @touchstart.prevent="resetHideTimer"
        @keydown.space.prevent="toggleplay"
        tabindex="0"
  >
    <h1>{{ filme.title }}</h1>
    
    <video 
    ref="videoPlayer" 
    controls class="video-player"
    :src="videoAtual.url"
    @play="onPlay"
    @pause="onPause"
    @timeupdate="onTimeupdate"
    playsinline
    ></video>

    <!-- Botões de Resolução -->
    <div class="resolucao" :class="{visble: showControls }" aria-hidden="false">
      <span class="resolucao-label">Resolução:</span>
      <button
        v-for="src in videoSources"
        :key="src.ref"
        @click="mudarResolucao(src)"
        :class="['chip', { ativo: videoAtual.ref === src.ref }]"
        :aria-pressed="videoAtual.ref === src.ref"

      >
        {{ src.ref }}
      </button>
    </div>

    <!-- Controles do Vídeo -->
    <div class="controles" :class="{visble: showControls}" role="group" aria-label="Controles do vídeo">
      <button class="btn-ghost" @click="voltar" title="Voltar 15s">« 15s</button>
      <button class="btn-primary" v-if="isPaused" @click="playVideo" title="Play">▶</button>
      <button class="btn-primary" v-else @click="pauseVideo" title="Pausar">⏸</button>
      <button class="btn-ghost" @click="stopVideo" title="Parar">⏹</button>
      <button class="btn-ghost" @click="avancar" title="Avançar 15s">15s »</button>
      <button class="btn-exit" @click="sair" title="Sair">Sair</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const videoPlayer = ref(null)
const hideTimer = ref(null)
const showControls = ref(true)
const isPaused = ref(true)

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

/* Timer: mostra controles e esconde após X ms de inatividade */
const HIDE_DELAY = 2500

function clearHideTimer() {
  if (hideTimer.value) {
    clearTimeout(hideTimer.value)
    hideTimer.value = null
  }
}

function startHideTimer() {
  clearHideTimer()
  hideTimer.value = setTimeout(() => {
    showControls.value = false
  }, HIDE_DELAY)
}

/* Chamado sempre que o usuário interage (mousemove, touch, click) */
function resetHideTimer() {
  showControls.value = true
  startHideTimer()
}

/* Player controls */
function playVideo() {
  videoPlayer.value?.play()
}
function pauseVideo() {
  videoPlayer.value?.pause()
}
function togglePlay() {
  if (!videoPlayer.value) return
  if (videoPlayer.value.paused) videoPlayer.value.play()
  else videoPlayer.value.pause()
}

function stopVideo() {
  if (videoPlayer.value) {
    videoPlayer.value.pause()
    videoPlayer.value.currentTime = 0
  }
}

function voltar() {
  if (videoPlayer.value) videoPlayer.value.currentTime = Math.max(0, videoPlayer.value.currentTime - 15)
}

function avancar() {
  if (videoPlayer.value) videoPlayer.value.currentTime = Math.min(videoPlayer.value.duration || Infinity, videoPlayer.value.currentTime + 15)
}

function sair() {
  router.push('/home')
}

/* troca de resolução mantendo tempo e estado de reprodução */
function mudarResolucao(source) {
  if (!videoPlayer.value) return
  const tempo = videoPlayer.value.currentTime || 0
  const pausado = videoPlayer.value.paused
  videoAtual.value = source
  // trocar src e forçar reload do media
  videoPlayer.value.src = source.url
  // alguns navegadores requerem load()
  videoPlayer.value.load()
  videoPlayer.value.currentTime = tempo
  if (!pausado) {
    // play pode falhar por políticas de autoplay em alguns browsers, mas tentamos
    videoPlayer.value.play().catch(() => {})
  }
}

/* Eventos do vídeo para sincronizar estado dos controles */
function onPlay() {
  isPaused.value = false
  resetHideTimer()
}
function onPause() {
  isPaused.value = true
  showControls.value = true
  clearHideTimer()
}
function onTimeUpdate() {
  // opcional: aqui você pode atualizar uma barra de progresso se quiser
}

/* Montagem / desmontagem: adicionar listeners de teclado e iniciar timer */
onMounted(() => {
  // iniciar timer
  startHideTimer()

  // evitar que controles some quando o mouse fica parado sobre o botão (o próprio resetHideTimer cobre a maioria dos casos)
  // adicionar listener global para tecla Esc (exemplo: mostrar controles)
  const onKey = e => {
    if (e.key === 'Escape') {
      showControls.value = true
      clearHideTimer()
    } else {
      // qualquer tecla mostra controles
      resetHideTimer()
    }
  }
  window.addEventListener('keydown', onKey)

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKey)
    clearHideTimer()
  })
})

onBeforeUnmount(() => {
  clearHideTimer()
})

/* sincroniza videoAtual.url caso os dados mudem (ex.: refresh) */
watch(videoAtual, (v) => {
  if (videoPlayer.value && videoPlayer.value.src !== v.url) {
    // deixa como está; a função mudarResolucao já faz a troca quando clicado
  }
})
</script>