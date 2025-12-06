// controller.js
import { toNumber } from "./utils.js";
import * as entrada from "./calcEntrada.js";
import * as saida from "./calcSaida.js";
import * as resultado from "./calcResultado.js";

export function processar() {

    const precoCompra = toNumber(document.getElementById("precoCompra").value);
    const margem = toNumber(document.getElementById("margemDesejada").value);

    // ENTRADA
    const percPis = toNumber(document.getElementById("creditoPisCofins").value);
    const percICMS = toNumber(document.getElementById("creditoICMS").value);
    const percReducao = toNumber(document.getElementById("reducaoBCICMS").value);

    const percICMSST = toNumber(document.getElementById("ICMSST").value);
    const percReducaoST = toNumber(document.getElementById("reducaoBCST").value);

    const percIPI = toNumber(document.getElementById("IPI").value);

    const vCreditoICMS = entrada.calcCreditoICMS(precoCompra, percICMS, percReducao, percICMSST);
    const vCreditoPis = entrada.calcCreditoPisCofins(precoCompra, percPis, vCreditoICMS);
    const vST = entrada.calcICMSST(precoCompra, percICMSST, percReducaoST);
    const vIPI = entrada.calcIPI(precoCompra, percIPI);

    const cmv = entrada.calcCMV(precoCompra, vCreditoPis, vCreditoICMS, vST, vIPI);

    // SAÍDA (dependem do preço de venda que ainda será calculado)
    const percPisVenda = toNumber(document.getElementById("vendaPisCofins").value);
    const percICMSVenda = toNumber(document.getElementById("vendaICMS").value);
    const percReducaoSaida = toNumber(document.getElementById("reducaoBCSaida").value);

    // PREÇO DE VENDA
    const precoVenda = resultado.calcPrecoVenda(
        cmv,
        margem,
        percPisVenda,
        percICMSVenda,
        percReducaoSaida
    );

    // SAÍDA (agora com precoVenda)
    const vICMSVenda = saida.calcICMSVenda(precoVenda, percICMSVenda, percReducaoSaida);
    const vPisVenda = saida.calcPisCofinsVenda(precoVenda, percPisVenda, vICMSVenda);

    // RESULTADOS
    const pisPagar = resultado.calcPisPagar(vPisVenda, vCreditoPis);
    const icmsPagar = resultado.calcICMSPagar(vICMSVenda, vCreditoICMS);
    const lucroBruto = resultado.calcLucroBruto(precoVenda, cmv, vPisVenda, vICMSVenda);
    const margemCalc = resultado.calcMargem(lucroBruto, precoVenda);
    const markup = resultado.calcMarkup(precoVenda, precoCompra);

    return {
        precoVenda,
        cmv,
        vCreditoPis,
        vCreditoICMS,
        vST,
        vIPI,
        vPisVenda,
        vICMSVenda,
        pisPagar,
        icmsPagar,
        lucroBruto,
        margemCalc,
        markup
    };
}
