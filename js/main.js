// main.js

import { processar } from "./controller.js";

// variável global para armazenar dados dos impostos
let tributacaoData = [];
let impostosFederaisData = [];
let entradaImpFederal = 0;
let saidaImpFederal = 0;

// aciona cálculo em tempo real para inputs e selects
document.querySelectorAll("input, select").forEach(campo => {
    campo.addEventListener("input", processar);
    campo.addEventListener("change", processar);
});

// Carrega tributacoes.json
fetch('./data/tributacoes.json')
    .then(res => res.json())
    .then(data => {
        tributacaoData = data; // armazena global para uso posterior
        const sel = document.getElementById('tributacao');
        sel.innerHTML = '<option value="">Selecione...</option>';
        data.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.descricao;
            opt.textContent = t.descricao;
            sel.appendChild(opt);
        });
    });

// Carrega impostos_federais.json
fetch('./data/impostos_federais.json')
    .then(res => res.json())
    .then(data => {
        impostosFederaisData = data; // armazena global para uso posterior
        const sel = document.getElementById('impFederal');
        sel.innerHTML = '<option value="">Selecione...</option>';
        data.forEach(i => {
            const opt = document.createElement('option');
            opt.value = i.imposto_federal;
            opt.textContent = i.imposto_federal;
            sel.appendChild(opt);
        });
    });

// Atualiza o campo de PIS COFINS
function atualizarPisCofins() {
    const regime = document.getElementById("regime").value;
    const impFederal = document.getElementById("impFederal").value;

    if (!regime || !impFederal) return;

    const item = impostosFederaisData.find(i => i.imposto_federal === impFederal);
    if (!item) return;

    switch (regime) {
        case "Real":
            entradaImpFederal = item.aliq_entrada_real ?? 0;
            saidaImpFederal   = item.aliq_saida_real ?? 0;
            break;

        case "Presumido":
            entradaImpFederal = item.aliq_entrada_presumido ?? 0;
            saidaImpFederal   = item.aliq_saida_presumido ?? 0;
            break;

        case "Simples":
            entradaImpFederal = item.aliq_entrada_simples ?? 0;
            saidaImpFederal   = item.aliq_saida_simples ?? 0;
            break;
    }

    document.getElementById("creditoPisCofins").value = entradaImpFederal.toFixed(2);
    document.getElementById("vendaPisCofins").value = saidaImpFederal.toFixed(2);
}


// Eventos para disparar atualização
document.getElementById("regime").addEventListener("change", atualizarPisCofins);
document.getElementById("impFederal").addEventListener("change", atualizarPisCofins);

// executa 1x ao abrir a página
processar();
