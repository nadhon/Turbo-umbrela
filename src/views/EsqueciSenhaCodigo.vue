<template>
  <div class="recuperar">
    <template v-if="emailRecuperacao">
      <h2>Recuperar Senha - Etapa 2/3</h2>
      <p>O código de segurança foi enviado para o seu e-mail ({{ emailRecuperacao }}). Digite-o abaixo.</p>
      
      <input 
        v-model="codigoUsuario" 
        type="text" 
        placeholder="Código de 6 dígitos" 
        maxlength="6" 
      />
      
      <button @click="verificarCodigo" :disabled="codigoUsuario.length !== 6 || carregando">
        {{ carregando ? 'Verificando...' : 'Confirmar Código' }}
      </button>
      
      <p v-if="mensagem" :class="mensagemClasse">{{ mensagem }}</p>
      
      <p v-if="!carregando" class="reenviar" @click="router.push('/esqueci-senha')">
        Não recebi o código. Voltar e tentar novamente.
      </p>
    </template>
    
    <template v-else>
      <h2>Erro</h2>
      <p class="mensagem-erro">
        O processo de recuperação não foi iniciado.
      </p>
      <button @click="router.push('/esqueci-senha')">Voltar para a Etapa 1</button>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

const codigoUsuario = ref("")
const mensagem = ref("")
const carregando = ref(false)
const mensagemClasse = ref("")
const router = useRouter()
const emailRecuperacao = ref(null)

onMounted(() => {
  const emailSalvo = localStorage.getItem('recuperacao-email')

  if (emailSalvo) {
    emailRecuperacao.value = emailSalvo
  } else {
    // Redireciona de volta se o estado (e-mail) estiver faltando
    setTimeout(() => {
        router.push('/esqueci-senha')
    }, 300) 
  }
})

function verificarCodigo() {
  carregando.value = true
  mensagem.value = ""
  mensagemClasse.value = ""

  const codigoCorreto = localStorage.getItem('recuperacao-codigo')
  const expira = parseInt(localStorage.getItem('recuperacao-expira'))

  if (Date.now() > expira) {
    mensagem.value = "O código expirou. Por favor, solicite um novo código."
    mensagemClasse.value = "mensagem-erro"
    localStorage.removeItem('recuperacao-codigo')
    localStorage.removeItem('recuperacao-expira')
    carregando.value = false
    return
  }
  
  setTimeout(() => {
    if (codigoUsuario.value === codigoCorreto) {
      mensagem.value = "Código confirmado com sucesso!"
      mensagemClasse.value = "mensagem-sucesso"
      
      localStorage.setItem('codigo-validado', 'true') 
      
      // **AQUI NAVEGAMOS PARA A ETAPA 3**
      setTimeout(() => {
        router.push('/esqueci-senha/redefinir')
      }, 1500)
    } else {
      mensagem.value = "Código inválido. Tente novamente."
      mensagemClasse.value = "mensagem-erro"
    }
    carregando.value = false
  }, 1000)
}
</script>