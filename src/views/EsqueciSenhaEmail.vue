<template>
  <div class="recuperar">
    <h2>Recuperar Senha - Etapa 1/3</h2>
    <p>Informe seu e-mail para receber o código de segurança.</p>
    <input v-model="email" type="email" placeholder="Digite seu e-mail" />
    <button @click="enviarCodigo" :disabled="!email || carregando">
      {{ carregando ? 'Enviando...' : 'Enviar Código' }}
    </button>
    <p v-if="mensagem" :class="mensagemClasse">{{ mensagem }}</p>
    <p class="voltar" @click="router.push('/login')">Lembrei da senha. Voltar para o Login.</p>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

const email = ref("")
const mensagem = ref("")
const carregando = ref(false)
const mensagemClasse = ref("")
const router = useRouter()

function gerarCodigo() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function enviarCodigo() {
  carregando.value = true
  mensagem.value = ""
  mensagemClasse.value = ""

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || []
  const usuarioExiste = usuarios.some(u => u.email === email.value)

  if (!usuarioExiste) {
    mensagem.value = "E-mail não encontrado! Tente novamente."
    mensagemClasse.value = "mensagem-erro"
    carregando.value = false
    return
  }

  setTimeout(() => {
    const codigo = gerarCodigo()
    localStorage.setItem('recuperacao-email', email.value)
    localStorage.setItem('recuperacao-codigo', codigo)
    localStorage.setItem('recuperacao-expira', Date.now() + 10 * 60 * 1000)

    mensagem.value = `Código enviado para ${email.value}! Verifique sua caixa de entrada.`
    mensagemClasse.value = "mensagem-sucesso"
    
    // **AQUI NAVEGAMOS PARA A ETAPA 2**
    setTimeout(() => {
      mensagem.value = "" 
      router.push('/esqueci-senha/codigo')
    }, 2000)
    
    carregando.value = false
  }, 1500)
}
</script>