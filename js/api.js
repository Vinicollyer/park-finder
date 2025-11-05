// URLs da API
const API_URL_VAGAS = 'api/vagas.php';
const API_URL_REGISTROS = 'api/registros.php';

/**
 * Busca a lista completa de vagas na API.
 */
export async function fetchVagas() {
    try {
        const response = await fetch(API_URL_VAGAS);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Erro na API: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Verifica se a resposta é um array
        if (!Array.isArray(data)) {
            // Se a resposta é um objeto de erro
            if (data.status === 'error') {
                throw new Error(data.message || 'Erro desconhecido da API');
            }
            // Se não é array nem erro, retorna array vazio
            console.warn('API retornou dados em formato inesperado:', data);
            return [];
        }
        
        return data;
    } catch (error) {
        console.error('Erro ao buscar vagas:', error);
        throw error;
    }
}

/**
 * Envia uma requisição de Check-In (POST) para a API.
 * Modificado: Não envia mais 'placa'.
 * @param {number} idVaga - O ID da vaga.
 */
export async function postCheckIn(idVaga) {
    const response = await fetch(API_URL_REGISTROS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id_vaga: idVaga
        })
    });

    const resultado = await response.json();
    if (response.status !== 201) {
        throw new Error(resultado.message || 'Erro desconhecido ao realizar check-in.');
    }
    return resultado;
}

/**
 * Envia uma requisição de Check-Out (PUT) para a API.
 * (Sem alterações)
 * @param {number} idRegistro - O ID do registro de estacionamento.
 */
export async function putCheckOut(idRegistro) {
    const response = await fetch(API_URL_REGISTROS, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id_registro: idRegistro
        })
    });

    const resultado = await response.json();
    if (!response.ok) {
        throw new Error(resultado.message || 'Erro desconhecido ao realizar check-out.');
    }
    return resultado;
}