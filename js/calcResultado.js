// calcResultado.js
import { percent } from "./utils.js";

export function calcPrecoVenda(cmv, margem, pisVenda, icmsVenda, reducaoSaida) {
    const carga = percent(margem)
                + percent(pisVenda)
                + (percent(icmsVenda) * (1 - percent(reducaoSaida)));

    return cmv / (1 - carga);
}

export function calcPisPagar(vPisVenda, vPisCredito) {
    return vPisVenda - vPisCredito;
}

export function calcICMSPagar(vIcmsVenda, vIcmsCredito) {
    return vIcmsVenda - vIcmsCredito;
}

export function calcLucroBruto(precoVenda, cmv, pisVenda, icmsVenda) {
    return precoVenda - (cmv + pisVenda + icmsVenda);
}

export function calcMargem(lucro, precoVenda) {
    if (precoVenda === 0) return 0;
    return lucro / precoVenda;
}

export function calcMarkup(precoVenda, precoCompra) {
    if (precoCompra === 0) return 0;
    return (precoVenda - precoCompra) / precoCompra;
}
