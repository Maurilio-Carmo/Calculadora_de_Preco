// calcEntrada.js
import { percent } from "./utils.js";

export function calcCreditoPisCofins(precoCompra, percPis, valorCreditoICMS) {
    return percent(percPis) * (precoCompra - valorCreditoICMS);
}

export function calcCreditoICMS(precoCompra, percICMS, percReducao, icmsST) {
    if (icmsST > 0) return 0;
    return precoCompra * (percent(percICMS) * (1 - percent(percReducao)));
}

export function calcICMSST(precoCompra, percICMSST, percReducaoST) {
    return precoCompra * (percent(percICMSST) * (1 - percent(percReducaoST)));
}

export function calcIPI(precoCompra, percIPI) {
    return precoCompra * percent(percIPI);
}

export function calcCMV(precoCompra, vPis, vICMS, vST, vIPI) {
    return precoCompra - (vPis + vICMS) + (vST + vIPI);
}
