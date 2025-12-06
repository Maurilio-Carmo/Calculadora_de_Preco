// calcResultado.js
import { percent } from "./utils.js";

export function calcPrecoVenda(cmv, margem, percVendaPisCofins, percVendaICMS, percReducaoSaida) {
    const carga = percent(margem)
                + percent(percVendaPisCofins)
                + (percent(percVendaICMS) * (1 - percent(percReducaoSaida)));

    return cmv / (1 - carga);
}

export function calcPisPagar(vPisVenda, vPisCredito) {
    return vPisVenda - vPisCredito;
}

export function calcICMSPagar(vIcmsVenda, vIcmsCredito) {
    return vIcmsVenda - vIcmsCredito;
}

export function calcLucroBruto(precoVenda, cmv, pisVenda, percVendaICMS) {
    return precoVenda - (cmv + pisVenda + percVendaICMS);
}

export function calcMargem(lucro, precoVenda) {
    if (precoVenda === 0) return 0;
    return (lucro / precoVenda) * 100;
}

export function calcMarkup(precoVenda, precoCompra) {
    if (precoCompra === 0) return 0;
    return ((precoVenda - precoCompra) / precoCompra) * 100;
}
