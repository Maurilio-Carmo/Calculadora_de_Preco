// visualizacao.js

import { currentDate } from "./utils.js";

export function atualizarTela(v) {

    // valores de entrada
    document.getElementById("valorCreditoPisCofins").textContent = "R$ " + v.vCreditoPisCofins.toFixed(2);

    document.getElementById("valorCreditoICMS").textContent = "R$ " + v.vCreditoICMS.toFixed(2);

    document.getElementById("valorICMSST").textContent = "R$ " + v.vST.toFixed(2);

    document.getElementById("valorIPI").textContent = "R$ " + v.vIPI.toFixed(2);

    document.getElementById("valorVendaPisCofins").textContent = "R$ " + v.vPisCofinsVenda.toFixed(2);

    document.getElementById("valorVendaICMS").textContent = "R$ " + v.vICMSVenda.toFixed(2);
    
    // destaque (topo)
    document.getElementById("precoCompraResultado").textContent = "R$ " + v.precoCompra.toFixed(2);

    document.getElementById("precoVendaResultado").textContent = "R$ " + v.precoVenda.toFixed(2);

    document.getElementById("lucroBrutoResultado").textContent = "R$ " + v.lucroBruto.toFixed(2);
    
    document.getElementById("margemResultado").textContent = v.margem.toFixed(2) + " %";

    document.getElementById("cmvResultado").textContent = "R$ " + v.cmv.toFixed(2);

    document.getElementById("markupResultado").textContent = v.markup.toFixed(2) + " %";

    // lista detalhada
    document.getElementById("dataAtual").value = currentDate();

    document.getElementById("precoVendaDetalhe").textContent = "R$ " + v.precoVenda.toFixed(2);

    document.getElementById("pisCofinsPagarDetalhe").textContent = "R$ " + v.pisCofinsPagar.toFixed(2);

    document.getElementById("icmsPagarDetalhe").textContent = "R$ " + v.icmsPagar.toFixed(2);

    document.getElementById("cbsPagarDetalhe").textContent = "R$ " + v.vCBSVenda.toFixed(2);

    document.getElementById("ibsUFDetalhe").textContent = "R$ " + v.vIBSUFVenda.toFixed(2);

    document.getElementById("ibsMunDetalhe").textContent = "R$ " + v.vIBSMunVenda.toFixed(2);

    document.getElementById("fornecedorDetalhe").textContent = "R$ " + v.precoCompra.toFixed(2);

    document.getElementById("lucroBrutoDetalhe").textContent = "R$ " + v.lucroBruto.toFixed(2);
}
