// views/select-renderer.js

import { logger } from '../utils/logger.js';

const MODULE = 'SelectRenderer';

/**
 * Popula um <select> com opções derivadas de um array de dados
 * @param {string} elementId - ID do elemento <select>
 * @param {Array} data - Array de itens
 * @param {{ valueKey: string, labelKey: string }} keys - Chaves de valor e rótulo em cada item
 */
export function populateSelect(elementId, data, { valueKey, labelKey }) {
  const select = document.getElementById(elementId);

  if (!select) {
    logger.warn(MODULE, `Select #${elementId} não encontrado no DOM`);
    return;
  }

  select.innerHTML = '<option value="">Selecione...</option>';

  data.forEach(item => {
    const option = document.createElement('option');
    option.value = item[valueKey];
    option.textContent = item[labelKey];
    select.appendChild(option);
  });

  logger.debug(MODULE, `Select #${elementId} populado com ${data.length} opções`);
}
