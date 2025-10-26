<template>
  <div class="recuperar">
    <template v-if="emailRecuperacao">
      <h2>Redefinir Senha - Etapa 3/3</h2>
      <p>Defina sua nova senha para {{ emailRecuperacao }}.</p>
      
      <input v-model="novaSenha" type="password" placeholder="Nova Senha (Mín. 6 caracteres)" />
      <input v-model="confirmaSenha" type="password" placeholder="Confirme a Nova Senha" />
      
      <button @click="redefinirSenha" :disabled="!validarSenhas() || carregando">
        {{ carregando ? 'Salvando...' : 'Redefinir Senha' }}
      </button>
      <p v-if="mensagem" :class="mensagemClasse">{{ mensagem }}</p>
    </template>
    <template v-else>
      <h2>Acesso Negado</h2>
      <p class="mensagem-erro">
        Você precisa completar as etapas de verificação.
      </p>
      <button @click="router.push('/esqueci-senha')">Voltar ao Início</button>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

const novaSenha = ref("")
const confirmaSenha = ref("")
const mensagem = ref("")
const carregando = ref(false)
const mensagemClasse = ref("")
const router = useRouter()
const emailRecuperacao = ref(null)

onMounted(() => {
  emailRecuperacao.value = localStorage.getItem('recuperacao-email')
  const codigoValidado = localStorage.getItem('codigo-validado') === 'true'

  // Redireciona se não houver e-mail OU se o código não foi validado
  if (!emailRecuperacao.value || !codigoValidado) {
    emailRecuperacao.value = null; // Garante que a mensagem de erro apareça
    setTimeout(() => {
        router.push('/esqueci-senha')
    }, 3000)
  }
})

function validarSenhas() {
  return novaSenha.value.length >= 6 && novaSenha.value === confirmaSenha.value
}

function redefinirSenha() {
  if (!validarSenhas()) {
    mensagem.value = "As senhas não coincidem ou são muito curtas (mínimo 6 caracteres)."
    mensagemClasse.value = "mensagem-erro"
    return
  }

  carregando.value = true
  mensagem.value = ""
  mensagemClasse.value = ""

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || []
  const emailAlvo = localStorage.getItem('recuperacao-email')
  const index = usuarios.findIndex(u => u.email === emailAlvo)

  setTimeout(() => {
    if (index !== -1) {
      usuarios[index].senha = novaSenha.value 
      localStorage.setItem("usuarios", JSON.stringify(usuarios))
      
      mensagem.value = "Senha redefinida com sucesso! Você será redirecionado para o login."
      mensagemClasse.value = "mensagem-sucesso"
      
      // Limpa o estado
      localStorage.removeItem('recuperacao-email')
      localStorage.removeItem('recuperacao-codigo')
      localStorage.removeItem('recuperacao-expira')
      localStorage.removeItem('codigo-validado')

      setTimeout(() => {
        router.push('/login')
      }, 3000)

    } else {
      mensagem.value = "Erro ao encontrar o usuário."
      mensagemClasse.value = "mensagem-erro"
    }
    carregando.value = false
  }, 1500)
}
</script>