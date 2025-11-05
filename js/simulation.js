import { postCheckIn, putCheckOut } from './api.js';
import { showToast } from './ui.js';

let simulationInterval = null;

/* FUNÇÃO gerarPlacaSimulada() REMOVIDA */

/**
 * A função principal do "sensor fantasma".
 * @param {Function} getState - Função que retorna o estado atual das vagas.
 * @param {Function} refreshState - Função para forçar a atualização do mapa.
 */
async function simularAtividadeSensor(getState, refreshState) {
    const estadoAtualVagas = getState();
    if (estadoAtualVagas.length === 0) return;

    const vagasLivre = estadoAtualVagas.filter(v => v.status === 'livre');
    const vagasOcupadas = estadoAtualVagas.filter(v => v.status === 'ocupada');
    const acaoCheckIn = Math.random() > 0.5;

    try {
        if (acaoCheckIn && vagasLivre.length > 0) {
            // --- Simular um CHECK-IN ---
            const vagaEscolhida = vagasLivre[Math.floor(Math.random() * vagasLivre.length)];
            
            console.log(`[SIMULADOR] Check-in na vaga ${vagaEscolhida.identificador}`);
            
            // Modificado: Chama postCheckIn sem placa
            await postCheckIn(vagaEscolhida.id_vaga); 
            
            showToast(`Sensor: Vaga ${vagaEscolhida.identificador} foi ocupada.`, 'info');
            refreshState();

        } else if (!acaoCheckIn && vagasOcupadas.length > 0) {
            // --- Simular um CHECK-OUT ---
            const vagaEscolhida = vagasOcupadas[Math.floor(Math.random() * vagasOcupadas.length)];
            
            console.log(`[SIMULADOR] Check-out da vaga ${vagaEscolhida.identificador}`);
            await putCheckOut(vagaEscolhida.id_registro);

            showToast(`Sensor: Vaga ${vagaEscolhida.identificador} foi liberada.`, 'info');
            refreshState();
        }
    } catch (error) {
        console.error('[SIMULADOR] Erro:', error);
    }
}

/**
 * Inicia o loop da simulação.
 * (Sem alterações)
 */
export function iniciarSimulador(getState, refreshState) {
    if (simulationInterval) return;

    const INTERVALO_SIMULACAO = 15000;
    simulationInterval = setInterval(
        () => simularAtividadeSensor(getState, refreshState), 
        INTERVALO_SIMULACAO
    );
    console.log("Simulador de sensor ATIVO.");
    showToast("Simulação de sensor iniciada!", "success", 5000);
}

/**
 * Para o loop da simulação.
 * (Sem alterações)
 */
export function pararSimulador() {
    if (simulationInterval) {
        clearInterval(simulationInterval);
        simulationInterval = null;
        console.log("Simulador de sensor PARADO.");
        showToast("Simulação de sensor parada.", "info", 5000);
    }
}