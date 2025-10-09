<template>
    <main>
        <div class="planos-box">
            <h1>Escolha seu plano</h1>
            <div class="planos-container">
                <div class="plano">
                    <h2>Básico</h2>
                    <p>R$ 15,90/mês</p>
                    <ul>
                        <li>Acesso a filmes em SD</li>
                        <li>2 tela por vez</li>
                        <li>Sem downloads</li>
                    </ul>
                    <button @click="assinarPlano('Basico')">Assinar</button>
                </div>
                <div class="plano">
                    <h2>Padrão</h2>
                    <p>R$ 45,90/mês</p>
                    <ul>
                        <li>Acesso a filmes em HD</li>
                        <li>4 telas por vez</li>
                        <li>Downloads disponíveis</li>
                    </ul>
                    <button @click="assinarPlano('Padrao')">Assinar</button>
                </div>
                <div class="plano">
                    <h2>Premium</h2>
                    <p>R$ 39,90/mês</p>
                    <ul>
                        <li>Acesso a filmes em Ultra HD</li>
                        <li>8 telas por vez</li>
                        <li>Downloads disponíveis</li>
                        <li>Vendas</li>
                    </ul>
                    <button @click="assinarPlano('Premium')">Assinar</button>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
function assinarPlano(plano){
    alert(`Você assinou o plano ${plano}!`)
    router.push('/login')
}

</script>