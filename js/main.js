// main.js
import { processar } from "./controller.js";

const inputs = document.querySelectorAll("input");

inputs.forEach(inp => {
    inp.addEventListener("input", () => {
        const r = processar();

        // Aqui você preenche os campos do HTML
        document.getElementById("resultadoPrecoVenda").innerText = r.precoVenda.toFixed(2);
        document.getElementById("resultadoCMV").innerText = r.cmv.toFixed(2);

        // Continue populando os demais campos conforme sua estrutura
    });
});