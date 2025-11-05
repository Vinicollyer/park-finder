/**
 * Adiciona uma máscara simples para placas de veículo (ex: ABC-1234)
 */
export function formatarPlaca(event) {
    let value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    let formattedValue = '';

    if (value.length <= 3) {
        formattedValue = value;
    } else if (value.length > 3 && value.length <= 7) {
        formattedValue = value.substring(0, 3) + '-' + value.substring(3);
    } else {
        formattedValue = value.substring(0, 3) + '-' + value.substring(3, 7);
    }
    event.target.value = formattedValue.substring(0, 8); // Limita ao formato ABC-1234
}