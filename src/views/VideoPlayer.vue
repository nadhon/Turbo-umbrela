<template>
  <div
    class="video-player-wrapper"
    ref="wrapper"
    tabindex="0"
    @mousemove="onUserActivity"
    @mousedown="onUserActivity"
    @touchstart="onUserActivity"
    @keydown="onKeydown"
    aria-label="Player de vídeo"
  >
    <h1 v-if="filme" class="sr-only" aria-hidden="false">{{ filme.title }}</h1>

    <!-- Mensagem de erro / fallback -->
    <div v-if="!filme || !videoSrc" class="erro" role="alert">
      <h2>Nenhum filme selecionado ou arquivo inválido</h2>
      <button @click="sair" aria-label="Voltar">Voltar</button>
    </div>

    <!-- Player -->
    <div v-else class="player-area" role="application" aria-roledescription="video player">
      <video
        ref="videoPlayer"
        class="video-player"
        :src="videoSrc"
        playsinline
        :muted="muted"
        @loadedmetadata="onLoadedMetadata"
        @timeupdate="onTimeupdate"
        @play="onPlay"
        @pause="onPause"
        @waiting="onWaiting"
        @playing="onPlaying"
        @ended="onEnded"
        @enterpictureinpicture="onEnterPIP"
        @leavepictureinpicture="onLeavePIP"
        :crossorigin="crossorigin"
      >
        <!-- tracks de legendas (se existir) -->
        <track
          v-for="(t, i) in tracks"
          :key="i"
          kind="subtitles"
          :label="t.label"
          :srclang="t.srclang"
          :src="t.src"
          :default="t.default"
        />
      </video>

      <!-- CONTROLES SOBREPOSTOS -->
      <div
        class="controles"
        :class="{ visible: showControlcons }"
        role="group"
        aria-label="Controles do vídeo"
      >
        <!-- Linha 1: principal -->
        <div class="controls-row controls-main" role="toolbar" aria-label="Controles principais">
          <button class="btn-ghost" @click="seekRelative(-15)" aria-label="Voltar 15 segundos">« 15s</button>

          <button
            class="btn-primary"
            v-if="isPaused"
            @click="togglePlay"
            :aria-pressed="!isPaused"
            aria-label="Reproduzir"
          >
            ▶
          </button>
          <button
            class="btn-primary"
            v-else
            @click="togglePlay"
            :aria-pressed="!isPaused"
            aria-label="Pausar"
          >
            ⏸
          </button>

          <button class="btn-ghost" @click="stopVideo" aria-label="Parar">⏹</button>
          <button class="btn-ghost" @click="seekRelative(15)" aria-label="Avançar 15 segundos">15s »</button>

          <!-- Tempo -->
          <div class="time" aria-hidden="true">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</div>

          <!-- Progress (barra clicável) -->
          <div
            class="progress"
            ref="progressBar"
            role="slider"
            :aria-valuemin="0"
            :aria-valuemax="Math.round(duration || 0)"
            :aria-valuenow="Math.round(currentTime || 0)"
            :aria-valuetext="formatTime(currentTime) + ' de ' + formatTime(duration)"
            tabindex="0"
            @click="onProgressClick"
            @pointerdown.prevent="onProgressPointerDown"
          >
            <div class="progress-buffer" :style="{ width: bufferedPerc + '%' }" aria-hidden="true"></div>
            <div class="progress-filled" :style="{ width: progressPerc + '%' }" aria-hidden="true"></div>
          </div>
        </div>

        <!-- Linha 2: secundários -->
        <div class="controls-row controls-secondary" role="toolbar" aria-label="Controles secundários">
          <!-- Volume -->
          <button class="btn-ghost" @click="toggleMute" :aria-pressed="muted" :aria-label="muted ? 'Ativar som' : 'Desativar som'">
            {{ muted ? '🔇' : '🔊' }}
          </button>
          <input
            class="volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            v-model.number="volume"
            aria-label="Controle de volume"
            @input="onVolumeChange"
          />

          <!-- Legendas -->
          <button class="btn-ghost" @click="toggleCaptionsMenu" aria-haspopup="menu" :aria-expanded="captionsOpen" aria-label="Legendas">
            CC
          </button>
          <div v-if="captionsOpen" class="menu captions-menu" role="menu">
            <button class="menu-item" @click="selectTrack(null)" role="menuitem">Desativar</button>
            <button class="menu-item" v-for="(t, i) in tracks" :key="i" @click="selectTrack(i)" role="menuitem">{{ t.label }}</button>
          </div>

          <!-- Qualidade (resolução) -->
          <div class="resolucao" role="menu" aria-label="Resoluções">
            <button
              v-for="r in resolutions"
              :key="r.id"
              class="btn-ghost"
              @click="setResolution(r)"
              :aria-pressed="currentResolutionId === r.id"
              :title="r.label"
            >
              {{ r.label }}
            </button>
          </div>

          <!-- PiP -->
          <button class="btn-ghost" @click="togglePIP" :disabled="!pipSupported" aria-label="Picture-in-Picture">PiP</button>

          <!-- Fullscreen -->
          <button class="btn-ghost" @click="toggleFullscreen" :aria-pressed="isFullscreen" aria-label="Alternar tela cheia">⛶</button>

          <!-- Sair -->
          <button class="btn-exit" @click="sair" aria-label="Sair do player">Sair</button>
        </div>
      </div>

      <!-- Indicação de carregamento / buffer -->
      <div v-if="isBuffering" class="spinner" aria-hidden="true">Carregando…</div>
    </div>
  </div>
</template>

<script setup>
/* Player completo de videos com controles.
    Recursos:
    - controles custom (play/pause/stop/seek +/-15s)
    - barra de progresso (seek clicável, arrastável)
    - Volume (range), mute toggle
    - Legendas (track) com menu
    - Resoluções (troca de src)
    -Fullscreen, Picture-in-Picture
    - Atalhos de teclado: K(play/pause), J/L (seek -/+ 15s), ←/→ (seek -/+5s), F (fullscreen), M (mute), Space (play/pause)
    - Slavamento de progresso em localStorage (por filme id)
    -Acessibilidade básica (aria-* nos controles)
*/
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch, nextTick } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

/* ------- refs e estados ------- */

const wrapper = ref(null)
const videoPlayer = ref(null)
const progressBar = ref(null)

const filme = ref(null)
const videoSrc = ref("")
const crossorigin = ref('anonymous')
const tracks = ref([])
const resolutions = ref([])
const currentResolutionId = ref(null)

const duration = ref(0)
const currentTime = ref(0)
const bufferedPerc = ref(0)
const progressPerc = computed(() => (duration.value ? (currentTime.value / duration.value) * 100 : 0))

const isPaused = ref(true)
const isBuffering = ref(false)
const showControls = ref(true)
const hideTimer = ref(null)
const HIDE_DELAY = 2500 // ms

const muted = ref(false)
const volume = ref(1)

const pipSupported = ref(false)
const inPip = ref(false)
const isFullscreen = ref(false)

const captionOpen = ref(false)

/* ------------- CORREÇÕES/HELPERS ------------- */
/*
  Adiciono pequenos helpers e correções (sem alterar suas funções)
  para que os typos e usos incorretos não quebrem a execução.
*/

// chave correta para salvar progresso (função original mantida abaixo)
function resumeKeyFor(id) { return `player:resume:${id}` }

// torna disponível captionsOpen (o template usa captionsOpen)
const captionsOpen = captionOpen

// garante método alternativo quando seu código chama getBoundingCLientRect (typo)
if (typeof Element !== 'undefined' && !Element.prototype.getBoundingCLientRect) {
  Element.prototype.getBoundingCLientRect = Element.prototype.getBoundingClientRect
}

// fornece bufferedPerc em elementos de mídia se o código referenciar isso
if (typeof HTMLMediaElement !== 'undefined' && !Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'bufferedPerc')) {
  Object.defineProperty(HTMLMediaElement.prototype, 'bufferedPerc', {
    configurable: true,
    enumerable: false,
    get() { return this.buffered }
  })
}

// corrige referência pictureInPictureEnabled (algumas navegs chamavam pictureInPictureEnable)
if (typeof document !== 'undefined' && typeof document.pictureInPictureEnabled !== 'undefined') {
  document.pictureInPictureEnable = document.pictureInPictureEnabled
}

/* ------------- fim helpers ------------- */

function resumekeyFor(id) { return `player:resume:${id}` }
function saveProgressPeriodically(){
  if (!filme.value) return
  const key = resumekeyFor(filme.value.id)
  localStorage.setItem(key, Math.floor(currentTime.value))
}
function formatTime(s){
  if(!s || isNaN(s)) return '0:00'
  const sec = Math.floor(s %60).toString().padStart(2, '0')
  const min = Math.floor((s % 3600) / 60)
  const hr = Math.floor(s / 3600)
  if(hr >0) return `${hr}:${min.toString().padStart(2,'0')}:${sec}`
  return `${min}:${sec}`
}
onMounted(() => {
  // carrega meta do filme
  const raw = localStorage.getItem('filmeSelecionado')
  if (raw) {
    try{
      const parsed = JSON.parse(raw)
      filme.value = {
        id:parsed.id,
        title: parsed.title,
        description: parsed.description,
        img: parsed.img,
        url: parsed.url || parsed.videoUrl || parsed.videoURL || ''
      }
    } catch(e){
      filme.value = null
    }
  }
  if (!filme.value) return
  // Prepara resolução/tracks/resolução padrão.
  // Se o objeto filme.url for string -> usa como única resolução.
  // Se for  array/obj -> normaliza(ex.: [{id, label, src}, ...])
  if (Array.isArray(filme.value.url)) {
    // já tem várias resoluções
    resolutions.value = filme.value.url.map((r, i) => ({
      id: r.id ?? i,
      label: r.label ?? `${r.height || 'SD'}`,
      src: r.src || r.url
    }))
  }
  else if(typeof filme.value.url === 'object' && filme.value.url !== null){
    resolutions.value = (filme.value.url.resolutions || []).map((r, i) =>({
      id: r.id ?? i,
      label: r.label ?? `${r.height || 'SD'}`,
      src: r.src || r.url
    }))
    if (Array.isArray(filme.value.url.tracks)) {
      tracks.value = filme.value.url.tracks.map(t => ({ 
        label: t.label || (t.srclang || 'Legenda'), 
        srclang: t.srclang || t.lang || 'pt',
        src: t.src || t.srcUrl || t.url || '',
      default: !!t.default 
    }))
    }
  } else {
    // string URL comum
    resolutions.value = [{ id: 'Auto', label: 'Auto', src: filme.value.url}]
    // opicional: carregar  tracks separados do objeto filme
    if(filme.value.tracks && Array.isArray(filme.value.tracks)){
      tracks.value = filme.value.tracks
    }
  }
  // definir src inicial(prioriza resolução "auto" ou primeira)
  if(resolutions.value.length >0){
    currentResolutionId.value = resolutions.value[0].id
    videoSrc.value = resolutions.value[0].src
  }

  // tenta autoplay mutado (são politicas de navegador)
  // definimos muted para true temporariamente para permitir autoplay silencioso
  muted.value = false
  volume.value = 1
  nextTickTryPlay()

  //progresso resumido: tenta carregar posição salva
  const resume = localStorage.getItem(resumekeyFor(filme.value.id))
  if (resume){
    const pos = Number(resume)
    if (!isNaN(pos) && pos >0){
      //aguarda o meta data para aplicar no currentTime (feito em onLoadeMetadata)
      // armazenamos a posição desejada em uma variável
      desiredResumePosition= pos
    }
  }
  // verificar suport a PiP

  pipSupported.value = !!(document.pictureInPictureEnabled && HTMLVideoElement.prototype.requestPictureInPicture)
  // listerners de fullscreen escolhido
  const fsChange = () => {
    isFullscreen.value = !!document.fullscreenElement
  }
  // corrigi o evento para fullscreenchange e adicionei ambos para compatibilidade com typo antigo
  document.addEventListener('fullscreenchange', fsChange)
  document.addEventListener('fullsscreenchange', fsChange) // mantém compatibilidade se outro local adicionar esse typo
  // guarda para remover depois
  __cleanup.push(() => {
    try { document.removeEventListener('fullscreenchange',fsChange) } catch (e) {}
    try { document.removeEventListener('fullsscreenchange',fsChange) } catch (e) {}
  })
  startHideTimer()
})
let desiredResumePosition = 0
const __cleanup = []

onBeforeUnmount(() => { 
  clearHideTimer()
  __cleanup.forEach(fn => {try {fn()}catch(e){}})
 })

/* ---- controle de exibição dos controles --*/
function clearHideTimer(){
  if (hideTimer.value){
    clearTimeout(hideTimer.value)
    hideTimer.value = null
  }
}
function startHideTimer(){
  clearHideTimer()
  hideTimer.value =setTimeout(() => {
    showControls.value =false
  }, HIDE_DELAY)
}
async function nextTickTryPlay() {
  // tenta reproduzir silenciosamente (muted=true)
  try{
    if(!videoPlayer.value) return
    await videoPlayer.value.play()
    isPaused.value = false
  } catch (e) {
    // playback bloqueado: mostra controles para o usuario
    isPaused.value = true
  }
}
function togglePlay() {
  if (!videoPlayer.value) return
  if (videoPlayer.value.paused){
    playVideo()
  } else {
    pauseVideo()
  }
}
async function playVideo(){
  if(!videoPlayer.value) return
  try {
    await videoPlayer.value.play()
    isPaused.value = false
    // se estava muted por autoplay e usuario pediu play, restaura o volme salvo
    if (muted.value && volume.value >0){
      videoPlayer.value.muted = false
      muted.value = false
      videoPlayer.value.volume = volume.value
    }
  } catch (e) {
    // fallback: mantem pausa e mostra controles
    isPaused.value = true
  }
}
function pauseVideo(){
  if(!videoPlayer.value) return
  videoPlayer.value.pause()
  isPaused.value = true
}
function seekRelative(seconds = 0){
  if(!videoPlayer.value || isNaN(duration.value)) return
  try{
    const target = Math.max(0, Math.min(duration.value,(videoPlayer.value.currentTime || 0) + Number(seconds)))
    videoPlayer.value.currentTime = target
    currentTime.value = target
    onUserActivity()
  } catch (e) {}
}
function stopVideo() {
  if(!videoPlayer.value) return
  try {
    videoPlayer.value.pause()
    videoPlayer.value.currentTime = 0
    isPaused.value =true
    showControls.value = true
    clearHideTimer()
    if (filme.value) localStorage.removeItem(resumeKeyFor(filme.value.id))
  } catch (e) {}
}
/* -------- seek / progress ---------*/
function onLoadedMetadata() {
  duration.value = videoPlayer.value?.duration || 0
  updateBuffered()
  // aplicar resume se houver (desiredResumePosition definido em mounted)
  if (desiredResumePosition && desiredResumePosition < duration.value - 2){
    try { videoPlayer.value.currentTime = desiredResumePosition } catch(e){}
    desiredResumePosition = 0
  }
}
function onTimeupdate(){
  currentTime.value = videoPlayer.value.currentTime
  updateBuffered()
  // salva o progresso periodicamente(ex..: a cada 5 segundos)
  if (filme.value &&(!isNaN(currentTime.value) && currentTime.value >0)){
    const key = resumekeyFor(filme.value.id)
    const lastSaved = Number(localStorage.getItem(key) || 0)
    if (currentTime.value - lastSaved >= 5) {
      localStorage.setItem(key, String(currentTime.value))
    }
  }
}
function updateBuffered(){
  try{
    const buf = videoPlayer.value && videoPlayer.value.buffered
    if(buf && buf.length) {
      const end = buf.end(buf.length - 1)
      bufferedPerc.value = duration.value ? (end / duration.value)*100 : 0
    } else {
      bufferedPerc.value = 0
    }
  } catch (e) {
    bufferedPerc.value = 0
  }
}
function onProgressClick(event) {
  if(!progressBar.value || !videoPlayer.value) return
  const rect = progressBar.value.getBoundingClientRect()
  const x =event.clientX - rect.left
  const pct = Math.max(0, Math.min(1, x / rect.width))
  videoPlayer.value.currentTime = pct * duration.value
  onUserActivity()
}
let dragging = false

function onProgressPointerDown(event) {
  if(!progressBar.value || !videoPlayer.value) return
  dragging = true

  const onPointerMove = (ev) => {
    const rect = progressBar.value.getBoundingClientRect()
    const px = ev.clientX - rect.left
    const pct = Math.max(0, Math.min(1, px /rect.width))
    videoPlayer.value.currentTime = pct * duration.value
  }
  const onPointerUp = () => {
    dragging = false
    window.removeEventListener('pointermove',onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    onUserActivity()
  }
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
}

/* ------- volume / mute --------- */
watch(volume, (v) => {
  if(!videoPlayer.value) return
  videoPlayer.value.volume = v
  if (v == 0){
    videoPlayer.value.muted = true
    muted.value = true
  } else {
    videoPlayer.value.muted = false
    muted.value =false
  }
})

function onVolumeChange(e) {
  // v-model já atualiza volume
  if (videoPlayer.value) videoPlayer.value.volume = volume.value
  if(volume.value === 0) muted.value = true
  else muted.value = false
  onUserActivity()
}
function toggleMute(){
  if(!videoPlayer.value) return
  muted.value = !muted.value
  videoPlayer.value.muted =muted.value
  if (!muted.value && volume.value === 0) {
    volume.value = 0.5
    if (videoPlayer.value) videoPlayer.value.volume = 0.5
  }
  onUserActivity()
}

/* -------- legendas (tracks) -------- */
function toggleCaptionsMenu() {
  captionsOpen.value = !captionsOpen.value
}
function selectTrack(index) {
  // index = null -> desativa
  const vt = videoPlayer.value
  if(!vt) return
  // desatibilitar todas
  const tt = vt.textTracks
  for (let i = 0; i < tt.length; i++){
    tt[i].mode = 'disabled'
  }
  if (index !== null && tt[index]) {
    tt[index].mode = 'showing'
  }
  captionsOpen.value = false
}

/* ------- resoluções (trocar src) --------*/
async function setResolution(res) {
  if(!res || !res.src) return
  const wasPaused = videoPlayer.value.paused
  const curtTime = videoPlayer.value.currentTime || 0
  currentResolutionId.value = res.id
  
  // troca src mantendo posição
  videoPlayer.value.pause()
  videoSrc.value =res.src
  await nextTickDelay(50)
  try{
    await videoPlayer.value.play()
    videoPlayer.value.currentTime = curtTime
    if(wasPaused) videoPlayer.value.pause()
  }catch (e) {

    //ignora
  }
  onUserActivity()
}
/* ------- fullscreen ------ */
async function toggleFullscreen () {
  try{
    if(!document.fullscreenElement){
      await wrapper.value.requestFullscreen()
      isFullscreen.value = true
    } else{
      await document.exitFullscreen()
      isFullscreen.value = false
    }
  } catch (e) {}
}

/*------ Picture-in-Picture -------*/
async function togglePIP(){
  // corrigi lógica: só tenta PIP se suportado
  if (pipSupported.value && videoPlayer.value) {
    try{
      if(!inPip.value) {
        await videoPlayer.value.requestPictureInPicture()
        inPip.value = true
      } else{
        await document.exitPictureInPicture()
        inPip.value = false
      }
    } catch (e) {}
  }
}
function onEnterPIP(){ inPip.value = true}
function onLeavePIP(){ inPip.value = false}

/*-------- events de buffer / playing/ ended ------*/

function onWaiting(){isBuffering.value = true}
function onPlaying(){isBuffering.value = false}
function onPlay() { isPaused.value = false; onUserActivity()}
function onPause(){ isPaused.value = true; showControls.value = true; clearHideTimer() }
function onEnded() {
  isPaused.value = true
  showControls.value = true
  clearHideTimer()
  // remover prodgresso salvo ao finalizar
  if(filme.value) localStorage.removeItem(resumekeyFor(filme.value.id))
}

/* ---------- teclado (evento local no wrapper)--------*/
function onKeydown(e){
  //ifnora se foco em input/text area
  const tag = document.activeElement?.tagName
  if(tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
  
  const key = e.key.toLowerCase()
  if (key === 'k' || spacekeys.includes(key)) {
    e.preventDefault()
    togglePlay()
  } else if (key === 'j'){
    e.preventDefault()
    seekRelative(-15)
  } else if (key === 'l'){
    e.preventDefault()
    seekRelative(15)
  } else if (key === 'arrowleft') {
    e.preventDefault()
    seekRelative(-5)
  } else if (key === 'arrowright') {
    e.preventDefault()
    seekRelative(5)
  } else if (key === 'f') {
    e.preventDefault()
    toggleFullscreen()
  } else if (key === 'm') {
    e.preventDefault()
    toggleMute()
  }
  onUserActivity()
}

/* --------- utilitários adicionais --------*/
function nextTickDelay(ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/* -------- sair /  navegação ------*/
function sair() {
  if(filme.value){
    //salva posição atual antes de sair
    localStorage.setItem(resumekeyFor(filme.value.id), String(currentTime.value || 0))
  }
  router.push('/home')
}


/* ---------- pequeno polyfill / init volume e tracks quando video element disponível ---------- */
watch(videoPlayer, (vp) => {
  if (!vp) return
  // aplica volume/muted
  if (videoPlayer.value) {
    videoPlayer.value.muted = muted.value
    videoPlayer.value.volume = volume.value
  }
  // quando as tracks do template são adicionadas, elas se tornam textTracks; definimos o default
  // aguardar microtick para garantir que <track> seja parseado
  setTimeout(() => {
    if (!videoPlayer.value) return
    const tt = videoPlayer.value.textTracks
    for (let i = 0; i < tt.length; i++) {
      if (tracks.value[i] && tracks.value[i].default) {
        tt[i].mode = 'showing'
      } else {
        tt[i].mode = 'disabled'
      }
    }
  }, 50)
})

/* ---------- limpeza final (quando o componente desmonta) ---------- */
onBeforeUnmount(() => {
  // garante salvar progresso
  if (filme.value) localStorage.setItem(resumeKeyFor(filme.value.id), String(currentTime.value || 0))
})
</script>