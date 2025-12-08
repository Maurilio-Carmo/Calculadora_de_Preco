// atualizarPisCofins.js

import { processar } from "./controller.js";

export function atualizarPisCofins(impostosFederaisData) {
    const regime = document.getElementById("regime").value;
    const impFederal = document.getElementById("impFederal").value;

    let entrada = 0;
    let saida   = 0;

    if (regime && impFederal) {
        const item = impostosFederaisData.find(i => i.imposto_federal === impFederal);
        if (item) {
            switch (regime) {
                case "Real":
                    entrada = item.aliq_entrada_real ?? 0;
                    saida   = item.aliq_saida_real ?? 0;
                    break;
                case "Presumido":
                    entrada = item.aliq_entrada_presumido ?? 0;
                    saida   = item.aliq_saida_presumido ?? 0;
                    break;
                case "Simples":
                    entrada = item.aliq_entrada_simples ?? 0;
                    saida   = item.aliq_saida_simples ?? 0;
                    break;
            }
        }
    }

    document.getElementById("creditoPisCofins").value = entrada.toFixed(2);
    document.getElementById("vendaPisCofins").value   = saida.toFixed(2);

    processar();
}
