// Importações dos módulos (utils.js removido)
import * as api from './api.js';
import * as ui from './ui.js';
import * as simulation from './simulation.js';

// --- Estado Global da Aplicação ---
let estadoAtualVagas = [];

// --- Seletores de Elementos (Modal removido) ---
const btnIniciarSimulador = document.getElementById('btn-iniciar-simulador');

/* ------------------------------------------- */
/* FUNÇÕES PRINCIPAIS (Controladores)
/* ------------------------------------------- */

/**
 * Controlador principal: Busca vagas na API e manda a UI renderizar.
 * Modificado: Não passa mais a função de callback onVagaClick.
 */
async function carregarVagas() {
    if (estadoAtualVagas.length === 0) {
        ui.setLoading(true);
    }

    try {
        const vagas = await api.fetchVagas();
        console.log('Vagas carregadas:', vagas.length, vagas);
        
        if (!vagas || vagas.length === 0) {
            console.warn('Nenhuma vaga retornada da API');
            ui.showToast('Nenhuma vaga encontrada no sistema.', 'info');
        }
        
        estadoAtualVagas = vagas;
        ui.renderizarMapa(estadoAtualVagas);
    } catch (error) {
        console.error('Falha ao carregar vagas:', error);
        estadoAtualVagas = [];
        const errorMessage = error.message || 'Erro ao carregar vagas. Verifique se o servidor está rodando.';
        ui.showToast(errorMessage, 'error');
    } finally {
        ui.setLoading(false);
    }
}

/* * FUNÇÕES 'onVagaClick' E 'onConfirmarSubmit' REMOVIDAS.
 */

/**
 * Controlador: Inicia a simulação e atualiza o botão.
 * (Sem alterações)
 */
function handleIniciarSimulacao() {
    simulation.iniciarSimulador(
        () => estadoAtualVagas, 
        carregarVagas           
    );

    btnIniciarSimulador.disabled = true;
    btnIniciarSimulador.classList.add('ativo');
    btnIniciarSimulador.innerHTML = '<i class="fas fa-sync fa-spin"></i> Simulação Ativa';
}


/* ------------------------------------------- */
/* INICIALIZAÇÃO E LISTENERS GLOBAIS
/* ------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    
    /* Listeners do Modal e Placa REMOVIDOS */

    // Listener do Botão de Simulação
    btnIniciarSimulador.addEventListener('click', handleIniciarSimulacao);

    // Carga inicial dos dados
    carregarVagas();

    // Inicia o "Polling" (atualização automática) do mapa a cada 10 segundos
    setInterval(carregarVagas, 10000); 
});