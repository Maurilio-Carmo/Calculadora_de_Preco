// atualizarICMS.js

export function atualizarICMS(tributacaoData) {
    const trib = document.getElementById("tributacao").value;
    if (!trib) return;

    const item = tributacaoData.find(x => x.tributacao === trib);
    if (!item) return;

    const aliq = item.aliquota ?? 0;
    const red  = item.reducao ?? 0;

    document.getElementById("creditoICMS").value = aliq.toFixed(2);
    document.getElementById("reducaoBCICMS").value = red.toFixed(2);

    document.getElementById("vendaICMS").value = aliq.toFixed(2);
    document.getElementById("reducaoBCSaida").value = red.toFixed(2);

    if (typeof calcularCreditoICMS === "function") calcularCreditoICMS();
    if (typeof calcularVendaICMS === "function") calcularVendaICMS();

    // fechamento do fluxo
    processar();
}
