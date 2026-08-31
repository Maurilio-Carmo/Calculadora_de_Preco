// handlers/regime-handler.js

import { ELEMENTS } from '../config/constants.js';

/**
 * Gerencia a visibilidade dos campos baseado no regime tributário selecionado
 * @param {Function} recalculateCallback - Função de callback para recalcular após mudanças
 */
export function setupRegimeVisibilityHandler(recalculateCallback) {
  const regimeSelect = document.getElementById(ELEMENTS.REGIME);

  // Campos de tributos: ocultados no Simples Nacional, com seu elemento de valor calculado
  const camposParaOcultar = [
    { inputId: 'creditoPisCofins', valorId: 'valorCreditoPisCofins' },
    { inputId: 'creditoICMS', valorId: 'valorCreditoICMS' },
    { inputId: 'reducaoBCICMS', valorId: null },
    { inputId: 'vendaPisCofins', valorId: 'valorVendaPisCofins' },
    { inputId: 'vendaICMS', valorId: 'valorVendaICMS' },
    { inputId: 'reducaoBCSaida', valorId: null }
  ];

  // Campos mostrados APENAS no Simples Nacional
  const camposApenasSimples = [
    { inputId: 'aliquotaSimplesNacional', valorId: null }
  ];

  // Result-items ocultados no Simples Nacional
  const resultItemsParaOcultar = [
    { inputId: 'pisCofinsPagarDetalhe', valorId: null },
    { inputId: 'icmsPagarDetalhe', valorId: null }
  ];

  // Result-items mostrados APENAS no Simples Nacional
  const resultItemsApenasSimples = [
    { inputId: 'simplesPagarDetalhe', valorId: null }
  ];

  // Containers de select ocultados no Simples
  const containersParaOcultar = ['tributacao', 'impFederal'];

  // Container de select mostrado apenas no Simples
  const containersApenasSimples = ['faixaSimples'];

  /**
   * Oculta ou mostra um grupo de campos/linhas, limpando o valor quando ocultos
   */
  function toggleLinhaVisibility(campos, shouldHide) {
    campos.forEach(({ inputId, valorId }) => {
      const input = document.getElementById(inputId);
      const linha = input?.closest('.linha');
      if (!linha) return;

      linha.classList.toggle('hidden-regime', shouldHide);

      if (shouldHide) {
        if (input) input.value = '';
        if (valorId) {
          const valorElement = document.getElementById(valorId);
          if (valorElement) valorElement.textContent = 'R$ 0,00';
        }
      }
    });
  }

  /**
   * Oculta ou mostra um grupo de result-items, limpando o texto quando ocultos
   */
  function toggleResultItemVisibility(itens, shouldHide) {
    itens.forEach(({ inputId }) => {
      const elemento = document.getElementById(inputId);
      const resultItem = elemento?.closest('.result-item');
      if (!resultItem) return;

      resultItem.classList.toggle('hidden-regime', shouldHide);
      if (shouldHide && elemento) elemento.textContent = 'R$ 0,00';
    });
  }

  /**
   * Oculta ou mostra um grupo de containers de select
   */
  function toggleContainerVisibility(ids, shouldHide, { disableSelect = false } = {}) {
    ids.forEach(id => {
      const select = document.getElementById(id);
      const container = select?.parentElement;
      if (!container) return;

      container.style.display = shouldHide ? 'none' : 'flex';

      if (select) {
        if (shouldHide) {
          select.value = '';
          if (disableSelect) select.disabled = true;
        } else if (disableSelect) {
          select.disabled = false;
        }
      }
    });
  }

  /**
   * Atualiza a visibilidade dos campos baseado no regime
   */
  function atualizarVisibilidadeCampos() {
    const regime = regimeSelect.value;
    const isSimplesNacional = regime === 'Simples';

    toggleLinhaVisibility(camposParaOcultar, isSimplesNacional);
    toggleLinhaVisibility(camposApenasSimples, !isSimplesNacional);

    toggleContainerVisibility(containersParaOcultar, isSimplesNacional, { disableSelect: true });
    toggleContainerVisibility(containersApenasSimples, !isSimplesNacional);

    toggleResultItemVisibility(resultItemsParaOcultar, isSimplesNacional);
    toggleResultItemVisibility(resultItemsApenasSimples, !isSimplesNacional);

    // Recalcula os valores após ocultar/mostrar campos
    if (recalculateCallback && typeof recalculateCallback === 'function') {
      recalculateCallback();
    }
  }

  // Adiciona listener para mudanças no regime
  if (regimeSelect) {
    regimeSelect.addEventListener('change', atualizarVisibilidadeCampos);
  }

  // Executa uma vez na inicialização para aplicar o estado correto
  atualizarVisibilidadeCampos();
}
