// calcEntrada.js
import { percent } from "./utils.js";

export function calcCreditoPisCofins(precoCompra, percPisCofins, vCreditoICMS) {
    return percent(percPisCofins) * (precoCompra - vCreditoICMS);
}

export function calcCreditoICMS(precoCompra, percICMS, percReducao, percICMSST) {
    if (percICMSST > 0) return 0;
    return precoCompra * (percent(percICMS) * (1 - percent(percReducao)));
}

export function calcICMSST(precoCompra, percICMSST, percReducaoST) {
    return precoCompra * (percent(percICMSST) * (1 - percent(percReducaoST)));
}

export function calcIPI(precoCompra, percIPI) {
    return precoCompra * percent(percIPI);
}

export function calcCMV(precoCompra, vCreditoPisCofins, vCreditoICMS, vST, vIPI) {
    return precoCompra - (vCreditoPisCofins + vCreditoICMS) + (vST + vIPI);
}
