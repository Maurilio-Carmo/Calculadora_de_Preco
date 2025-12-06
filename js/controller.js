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

    // SAÍDA
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

    const vICMSVenda = saida.calcICMSVenda(precoVenda, percICMSVenda, percReducaoSaida);
    const vPisVenda = saida.calcPisCofinsVenda(precoVenda, percPisVenda, vICMSVenda);

    // RESULTADOS
    const pisPagar = resultado.calcPisPagar(vPisVenda, vCreditoPis);
    const icmsPagar = resultado.calcICMSPagar(vICMSVenda, vCreditoICMS);
    const lucroBruto = resultado.calcLucroBruto(precoVenda, cmv, vPisVenda, vICMSVenda);
    const margemCalc = resultado.calcMargem(lucroBruto, precoVenda);
    const markup = resultado.calcMarkup(precoVenda, precoCompra);

    const valores = {
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

    atualizarTela(valores);
    return valores;
}


// ======================================================
// ATUALIZAÇÃO DE TELA
// ======================================================
function atualizarTela(v) {

    // Atualiza os valores na tela
    document.getElementById("creditoPisCofins").nextElementSibling.textContent = "R$ " + v.vCreditoPis.toFixed(2);

    document.getElementById("creditoICMS").nextElementSibling.textContent = "R$ " + v.vCreditoICMS.toFixed(2);

    document.getElementById("vendaPisCofins").nextElementSibling.textContent = "R$ " + v.vPisVenda.toFixed(2);

    document.getElementById("vendaICMS").nextElementSibling.textContent = "R$ " + v.vICMSVenda.toFixed(2);
    
    
    // destaque (topo)
    document.getElementById("precoCompra").textContent = "R$ " + v.precoVenda.toFixed(2);

    document.getElementById("precoVendaResultado").textContent = "R$ " + v.precoVenda.toFixed(2);

    document.getElementById("lucroBrutoResultado").textContent = "R$ " + v.lucroBruto.toFixed(2);
    
    document.getElementById("margemResultado").textContent = v.margemCalc.toFixed(2) + " %";

    document.getElementById("cmvResultado").textContent = "R$ " + v.cmv.toFixed(2);

    document.getElementById("markupResultado").textContent = v.markup.toFixed(2) + " %";

    // lista detalhada
    document.getElementById("precoVendaDetalhe").textContent = "R$ " + v.precoVenda.toFixed(2);

    document.getElementById("pisPagarResultado").textContent = "R$ " + v.pisPagar.toFixed(2);

    document.getElementById("icmsPagarResultado").textContent = "R$ " + v.icmsPagar.toFixed(2);

    document.getElementById("cbsPagarResultado").textContent = "R$ 0,00"; // ainda não calculado

    document.getElementById("ibsEstResultado").textContent = "R$ 0,00"; // ainda não calculado

    document.getElementById("ibsMunResultado").textContent = "R$ 0,00"; // ainda não calculado

    document.getElementById("fornecedorResultado").textContent = "R$ " + v.cmv.toFixed(2);

    document.getElementById("lucroBrutoDetalhe").textContent = "R$ " + v.lucroBruto.toFixed(2);
}
