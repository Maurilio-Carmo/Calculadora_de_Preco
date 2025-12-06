// controller.js
import { toNumber } from "./utils.js";
import * as entrada from "./calcEntrada.js";
import * as saida from "./calcSaida.js";
import * as resultado from "./calcResultado.js";

export function processar() {

    const precoCompra = toNumber(document.getElementById("precoCompra").value);
    const margemDesejada = toNumber(document.getElementById("margemDesejada").value);

    // ENTRADA
    const percPisCofins = toNumber(document.getElementById("creditoPisCofins").value);
    const percICMS = toNumber(document.getElementById("creditoICMS").value);
    const percReducaoICMS = toNumber(document.getElementById("reducaoBCICMS").value);

    const percICMSST = toNumber(document.getElementById("ICMSST").value);
    const percReducaoICMSST = toNumber(document.getElementById("reducaoBCST").value);

    const percIPI = toNumber(document.getElementById("IPI").value);

    const vCreditoICMS = entrada.calcCreditoICMS(precoCompra, percICMS, percReducaoICMS, percICMSST);
    const vCreditoPisCofins = entrada.calcCreditoPisCofins(precoCompra, percPisCofins, vCreditoICMS);
    const vST = entrada.calcICMSST(precoCompra, percICMSST, percReducaoICMSST);
    const vIPI = entrada.calcIPI(precoCompra, percIPI);

    const cmv = entrada.calcCMV(precoCompra, vCreditoPisCofins, vCreditoICMS, vST, vIPI);

    // SAÍDA
    const percVendaPisCofins = toNumber(document.getElementById("vendaPisCofins").value);
    const percVendaICMS = toNumber(document.getElementById("vendaICMS").value);
    const percReducaoICMSSaida = toNumber(document.getElementById("reducaoBCSaida").value);

    // PREÇO DE VENDA
    const precoVenda = resultado.calcPrecoVenda(
        cmv,
        margemDesejada,
        percVendaPisCofins,
        percVendaICMS,
        percReducaoICMSSaida
    );

    const vICMSVenda = saida.calcICMSVenda(precoVenda, percVendaICMS, percReducaoICMSSaida);
    const vPisCofinsVenda = saida.calcPisCofinsVenda(precoVenda, percVendaPisCofins, vICMSVenda);

    // RESULTADOS
    const pisCofinsPagar = resultado.calcPisCofinsPagar(vPisCofinsVenda, vCreditoPisCofins);
    const icmsPagar = resultado.calcICMSPagar(vICMSVenda, vCreditoICMS);
    const lucroBruto = resultado.calcLucroBruto(precoVenda, cmv, vPisCofinsVenda, vICMSVenda);
    const margem = resultado.calcMargem(lucroBruto, precoVenda);
    const markup = resultado.calcMarkup(precoVenda, precoCompra);

    const valores = {
        precoCompra,
        margemDesejada,
        vCreditoPisCofins,
        vCreditoICMS,
        vST,
        vIPI,
        precoVenda,
        vPisCofinsVenda,
        vICMSVenda,
        pisCofinsPagar,
        icmsPagar,
        lucroBruto,
        margem,
        cmv,
        markup
    };

    atualizarTela(valores);
    return valores;
}

// ATUALIZAÇÃO DE TELA

function atualizarTela(v) {

    // valores de entrada
    document.getElementById("valorCreditoPisCofins").textContent = "R$ " + v.vCreditoPisCofins.toFixed(2);

    document.getElementById("valorCreditoICMS").textContent = "R$ " + v.vCreditoICMS.toFixed(2);

    document.getElementById("valorICMSST").textContent = "R$ " + v.vST.toFixed(2);

    document.getElementById("valorIPI").textContent = "R$ " + v.vIPI.toFixed(2);

    document.getElementById("valorVendaPisCofins").textContent = "R$ " + v.vPisCofinsVenda.toFixed(2);

    document.getElementById("valorVendaICMS").textContent = "R$ " + v.vICMSVenda.toFixed(2);
    
    // destaque (topo)
    document.getElementById("precoCompra").textContent = "R$ " + v.precoVenda.toFixed(2);

    document.getElementById("precoVendaResultado").textContent = "R$ " + v.precoVenda.toFixed(2);

    document.getElementById("lucroBrutoResultado").textContent = "R$ " + v.lucroBruto.toFixed(2);
    
    document.getElementById("margemResultado").textContent = v.margem.toFixed(2) + " %";

    document.getElementById("cmvResultado").textContent = "R$ " + v.cmv.toFixed(2);

    document.getElementById("markupResultado").textContent = v.markup.toFixed(2) + " %";

    // lista detalhada
    document.getElementById("precoVendaDetalhe").textContent = "R$ " + v.precoVenda.toFixed(2);

    document.getElementById("pisPagarResultado").textContent = "R$ " + v.pisCofinsPagar.toFixed(2);

    document.getElementById("icmsPagarResultado").textContent = "R$ " + v.icmsPagar.toFixed(2);

    document.getElementById("cbsPagarResultado").textContent = "R$ 0,00"; // ainda não calculado

    document.getElementById("ibsEstResultado").textContent = "R$ 0,00"; // ainda não calculado

    document.getElementById("ibsMunResultado").textContent = "R$ 0,00"; // ainda não calculado

    document.getElementById("fornecedorResultado").textContent = "R$ " + v.precoCompra.toFixed(2);

    document.getElementById("lucroBrutoDetalhe").textContent = "R$ " + v.lucroBruto.toFixed(2);
}
