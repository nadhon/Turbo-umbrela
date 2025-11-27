<template>
  <div class="video-player-wrapper" tabindex="0" @mousemove="resetHideTimer" @click="resetHideTimer" @touchstart.prevent="resetHideTimer">
    <div v-if="!filme || !videoSrc" class="erro">
      <h2>Nenhum filme selecionado ou arquivo inválido</h2>
      <button @click="sair">Voltar</button>
    </div>

    <div v-else class="player-area">
      <h1>{{ filme.title }}</h1>

      <video
        ref="videoPlayer"
        class="video-player"
        :src="videoSrc"
        controls
        playsinline
        @play="onPlay"
        @pause="onPause"
        @timeupdate="onTimeupdate"
      ></video>

      <div class="controles" :class="{ visble: showControls }" role="group" aria-label="Controles do vídeo">
        <button class="btn-ghost" @click="voltar15">« 15s</button>
        <button class="btn-primary" v-if="isPaused" @click="playVideo">▶</button>
        <button class="btn-primary" v-else @click="pauseVideo">⏸</button>
        <button class="btn-ghost" @click="stopVideo">⏹</button>
        <button class="btn-ghost" @click="avancar15">15s »</button>
        <button class="btn-exit" @click="sair">Sair</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue"
import { useRouter } from "vue-router"
const router = useRouter()

const videoPlayer = ref(null)
const hideTimer = ref(null)
const showControls = ref(true)
const isPaused = ref(true)

const filme = ref(null)
const videoSrc = ref("")

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
function resetHideTimer() {
  showControls.value = true
  startHideTimer()
}

function playVideo() {
  videoPlayer.value?.play().catch(() => {})
}
function pauseVideo() {
  videoPlayer.value?.pause()
}
function stopVideo() {
  if (videoPlayer.value) {
    videoPlayer.value.pause()
    videoPlayer.value.currentTime = 0
  }
}
function voltar15() {
  if (videoPlayer.value) videoPlayer.value.currentTime = Math.max(0, videoPlayer.value.currentTime - 15)
  resetHideTimer()
}
function avancar15() {
  if (videoPlayer.value) videoPlayer.value.currentTime = Math.min(videoPlayer.value.duration || Infinity, videoPlayer.value.currentTime + 15)
  resetHideTimer()
}
function sair() {
  localStorage.removeItem("filmeSelecionado")
  router.push("/home")
}

function onPlay() {
  isPaused.value = false
  resetHideTimer()
}
function onPause() {
  isPaused.value = true
  showControls.value = true
  clearHideTimer()
}
function onTimeupdate() {}

onMounted(() => {
  const raw = localStorage.getItem("filmeSelecionado")
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      filme.value = {
        id: parsed.id,
        title: parsed.title,
        description: parsed.description,
        img: parsed.img,
        url: parsed.url || parsed.videoUrl || parsed.videoURL || ""
      }
    } catch (e) {
      filme.value = null
    }
  } else {
    filme.value = null
  }

  if (filme.value && filme.value.url) {
    // normaliza letras maiúsculas/minúsculas do caminho (garante que a pasta usada seja /videos)
    let path = filme.value.url
    if (path.startsWith("/Filmes/")) {
      path = path.replace("/Filmes/", "/videos/")
    }
    videoSrc.value = path
    setTimeout(() => playVideo(), 200)
  }

  startHideTimer()

  const onKey = (e) => {
    if (e.key === "Escape") {
      showControls.value = true
      clearHideTimer()
    } else if (e.code === "Space") {
      e.preventDefault()
      if (isPaused.value) playVideo()
      else pauseVideo()
      resetHideTimer()
    } else {
      resetHideTimer()
    }
  }
  window.addEventListener("keydown", onKey)

  onBeforeUnmount(() => {
    window.removeEventListener("keydown", onKey)
    clearHideTimer()
  })
})

onBeforeUnmount(() => {
  clearHideTimer()
})
</script>

<style scoped>
.video-player-wrapper {
  background: #000;
  color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  outline: none;
}
h1 { margin: 18px 0; font-size: 1.8rem; }
.video-player { width: 100%; max-width: 1200px; background: black; }
.controles {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.75);
  padding: 12px 18px;
  border-radius: 8px;
  display: flex;
  gap: 12px;
  opacity: 0;
  visibility: hidden;
  transition: opacity .25s, visibility .25s;
}
.controles.visble { opacity: 1; visibility: visible; }
.btn-primary { background: #e50914; color: white; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer; }
.btn-ghost { background: transparent; color: white; border: 1px solid rgba(255,255,255,0.25); padding: 8px 12px; border-radius: 6px; cursor: pointer; }
.btn-exit { background: #333; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; }
.erro { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; color: white; }
</style>
