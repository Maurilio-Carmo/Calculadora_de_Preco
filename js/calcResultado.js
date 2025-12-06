// calcResultado.js
import { percent } from "./utils.js";

export function calcPrecoVenda(cmv, margemDesejada, percVendaPisCofins, percVendaICMS, percReducaoICMSSaida) {
    const carga = percent(margemDesejada)
                + percent(percVendaPisCofins)
                + (percent(percVendaICMS) * (1 - percent(percReducaoICMSSaida)));

    return cmv / (1 - carga);
}

export function calcPisCofinsPagar(vPisCofinsVenda, vCreditoPisCofins) {
    return vPisCofinsVenda - vCreditoPisCofins;
}

export function calcICMSPagar(vICMSVenda, vIcmsCredito) {
    return vICMSVenda - vIcmsCredito;
}

export function calcLucroBruto(precoVenda, cmv, vPisCofinsVenda, vICMSVenda) {
    return precoVenda - (cmv + vPisCofinsVenda + vICMSVenda);
}

export function calcMargem(lucro, precoVenda) {
    if (precoVenda === 0) return 0;
    return (lucro / precoVenda) * 100;
}

export function calcMarkup(precoVenda, precoCompra) {
    if (precoCompra === 0) return 0;
    return ((precoVenda - precoCompra) / precoCompra) * 100;
}
