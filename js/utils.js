// utils.js
export function toNumber(value) {
    if (!value) return 0;
    return parseFloat(value.toString().replace(",", ".")) || 0;
}

export function percent(value) {
    return toNumber(value) / 100;
}
