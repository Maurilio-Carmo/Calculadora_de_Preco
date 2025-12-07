// atualizarPisCofins.js

export function atualizarPisCofins(impostosFederaisData) {
    const regime = document.getElementById("regime").value;
    const impFederal = document.getElementById("impFederal").value;

    if (!regime || !impFederal) return;

    const item = impostosFederaisData.find(i => i.imposto_federal === impFederal);
    if (!item) return;

    let entrada = 0;
    let saída = 0;

    switch (regime) {
        case "Real":
            entrada = item.aliq_entrada_real ?? 0;
            saída   = item.aliq_saida_real ?? 0;
            break;
        case "Presumido":
            entrada = item.aliq_entrada_presumido ?? 0;
            saída   = item.aliq_saida_presumido ?? 0;
            break;
        case "Simples":
            entrada = item.aliq_entrada_simples ?? 0;
            saída   = item.aliq_saida_simples ?? 0;
            break;
    }

    document.getElementById("creditoPisCofins").value = entrada.toFixed(2);
    document.getElementById("vendaPisCofins").value = saída.toFixed(2);
}
