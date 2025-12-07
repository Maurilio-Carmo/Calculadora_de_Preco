// main.js

import { processar } from "./controller.js";

// todos inputs da tela acionam cálculo em tempo real
document.querySelectorAll("input").forEach(campo => {
    campo.addEventListener("input", processar);
});

// Carrega tributacoes.json
fetch('./data/tributacoes.json')
    .then(res => res.json())
    .then(data => {
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
        const sel = document.getElementById('impFed');
        sel.innerHTML = '<option value="">Selecione...</option>';
        data.forEach(i => {
            const opt = document.createElement('option');
            opt.value = i.imposto_federal;
            opt.textContent = i.imposto_federal;
            sel.appendChild(opt);
        });
    });

// executa 1x ao abrir a página
processar();
