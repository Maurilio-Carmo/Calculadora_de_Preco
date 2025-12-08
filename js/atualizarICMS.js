// atualizarICMS.js

import { processar } from "./controller.js";

export function atualizarICMS(tributacaoData) {
    const trib = document.getElementById("tributacao").value;

    let aliq = 0;
    let red  = 0;

    if (trib) {
        const item = tributacaoData.find(x => x.tributacao === trib);
        if (item) {
            aliq = item.aliquota ?? 0;
            red  = item.reducao ?? 0;
        }
    }

    document.getElementById("creditoICMS").value    = aliq.toFixed(2);
    document.getElementById("reducaoBCICMS").value  = red.toFixed(2);
    document.getElementById("vendaICMS").value      = aliq.toFixed(2);
    document.getElementById("reducaoBCSaida").value = red.toFixed(2);

    processar();
}
