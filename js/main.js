// main.js

import { processar } from "./controller.js";
import { atualizarICMS } from "./atualizarICMS.js";
import { atualizarPisCofins } from "./atualizarPisCofins.js";

// variável global para armazenar dados dos impostos
let tributacaoData = [];
let impostosFederaisData = [];

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
            opt.value = t.tributacao;
            opt.textContent = t.tributacao;
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


// Eventos para disparar atualização
document.getElementById("regime").addEventListener("change", () => atualizarPisCofins(impostosFederaisData));
document.getElementById("tributacao").addEventListener("change", () => atualizarICMS(tributacaoData));
document.getElementById("impFederal").addEventListener("change", () => atualizarPisCofins(impostosFederaisData));

// executa 1x ao abrir a página
processar();
