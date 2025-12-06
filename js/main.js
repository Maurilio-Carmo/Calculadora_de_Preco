// main.js
import { processar } from "./controller.js";

// todos inputs da tela acionam cálculo em tempo real
document.querySelectorAll("input").forEach(campo => {
    campo.addEventListener("input", processar);
});

// executa 1x ao abrir a página
processar();
