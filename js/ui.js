// Seletores de elementos do DOM
const mapaContainer = document.getElementById('mapa-container');
const loadingMessage = document.getElementById('loading-message');
const toastContainer = document.getElementById('toast-container');

/**
 * Limpa e desenha o mapa de vagas na tela.
 * MODIFICADO: Agora inclui um span com o texto do status (Liberada, Ocupada).
 * @param {Array} vagas - A lista de vagas vinda da API.
 */
export function renderizarMapa(vagas) {
    mapaContainer.innerHTML = '';

    if (!vagas || vagas.length === 0) {
        mapaContainer.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-light);">Nenhuma vaga encontrada para exibição.</p>';
        return;
    }

    vagas.forEach(vaga => {
        // Garante que a vaga tem os campos necessários
        if (!vaga.identificador) {
            console.warn('Vaga sem identificador:', vaga);
            return;
        }

        const vagaDiv = document.createElement('div');
        vagaDiv.className = 'vaga';
        
        // Determina o status (prioridade: ocupada > manutencao > livre)
        const status = vaga.status || (vaga.id_registro ? 'ocupada' : 'livre');
        const tipo = vaga.tipo || 'normal';
        
        vagaDiv.classList.add(status, tipo);
        
        let statusTexto = '';
        switch(status) {
            case 'livre':
                statusTexto = 'Liberada';
                break;
            case 'ocupada':
                statusTexto = 'Ocupada';
                break;
            case 'manutencao':
                statusTexto = 'Manutenção';
                break;
            default:
                statusTexto = 'Desconhecido';
        }

        vagaDiv.innerHTML = `
            <strong>${vaga.identificador}</strong>
            <span class="vaga-status">${statusTexto}</span>
        `;

        if (status === 'manutencao') {
            vagaDiv.style.cursor = 'not-allowed';
        }
        mapaContainer.appendChild(vagaDiv);
    });
}

/* * O restante do arquivo (showToast, setLoading) permanece 
 * exatamente igual e não precisa ser copiado novamente 
 * se você já o tem. Colei aqui para garantir.
 */


/**
 * Exibe uma notificação "toast".
 * @param {string} message - A mensagem.
 * @param {'success' | 'error' | 'info'} type - O tipo.
 * @param {number} duration - A duração em ms.
 */
export function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.classList.add('toast', `toast-${type}`);
    toast.style.setProperty('--toast-delay', `${duration / 1000}s`);

    let iconClass = '';
    if (type === 'success') iconClass = 'fas fa-check-circle';
    else if (type === 'error') iconClass = 'fas fa-times-circle';
    else if (type === 'info') iconClass = 'fas fa-info-circle';

    toast.innerHTML = `
        <i class="${iconClass} toast-icon ${type}"></i>
        <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-out');
        toast.addEventListener('animationend', () => toast.remove());
    }, duration);
}

/** Controla a mensagem de "Carregando..." */
export function setLoading(isLoading) {
    if (isLoading) {
        loadingMessage.style.display = 'block';
        mapaContainer.style.opacity = '0.5';
    } else {
        loadingMessage.style.display = 'none';
        mapaContainer.style.opacity = '1';
    }
}