// utils.js

export function toNumber(value) {
    if (!value) return 0;
    return parseFloat(value.toString().replace(",", ".")) || 0;
}

export function percent(value) {
    return toNumber(value) / 100;
}

export function currentDate() {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();

    return `${dia} / ${mes} / ${ano}`;
}