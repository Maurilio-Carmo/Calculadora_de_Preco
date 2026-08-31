// services/data-loader.js

import { PATHS, ELEMENTS } from '../config/constants.js';
import { logger } from '../utils/logger.js';
import { notify } from '../utils/notifications.js';
import { populateSelect } from '../views/select-renderer.js';

const MODULE = 'DataLoader';

let tributacaoData = [];
let impostosFederaisData = [];
let faixasSimplesNacionalData = [];

/**
 * Marca/desmarca um <select> como carregando (dispara shimmer no
 * custom-select decorator via MutationObserver de atributos).
 */
function setSelectLoading(elementId, loading) {
  const select = document.getElementById(elementId);
  if (!select) return;
  select.disabled = loading;
  if (loading) {
    select.dataset.loading = 'true';
  } else {
    delete select.dataset.loading;
  }
}

/**
 * Carrega JSON com tratamento de erros
 */
async function loadJSON(path, dataName) {
  try {
    logger.debug(MODULE, `Carregando ${dataName}`, { path });
    
    const response = await fetch(path);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Dados retornados não são um array');
    }
    
    if (data.length === 0) {
      logger.warn(MODULE, `${dataName} está vazio`, { path });
    }
    
    logger.success(MODULE, `${dataName} carregado`, {
      path,
      items: data.length
    });
    
    return data;
    
  } catch (error) {
    logger.error(
      MODULE,
      `Falha ao carregar ${dataName}`,
      {
        path,
        error: error.message,
        stack: error.stack
      }
    );
    
    throw new Error(`Erro ao carregar ${dataName}: ${error.message}`);
  }
}

/**
 * Carrega os dados de tributação
 */
async function loadTributacoes() {
  setSelectLoading(ELEMENTS.TRIBUTACAO, true);
  try {
    const data = await loadJSON(PATHS.TRIBUTACOES, 'tributações');
    tributacaoData = data;
    populateSelect(ELEMENTS.TRIBUTACAO, data, { valueKey: 'tributacao', labelKey: 'tributacao' });
    return data;
  } catch (error) {
    notify.error(
      'Erro ao Carregar Tributações',
      'Não foi possível carregar as opções de tributação. Algumas funcionalidades podem não funcionar.'
    );
    return [];
  } finally {
    setSelectLoading(ELEMENTS.TRIBUTACAO, false);
  }
}

/**
 * Carrega os dados de impostos federais
 */
async function loadImpostosFederais() {
  setSelectLoading(ELEMENTS.IMP_FEDERAL, true);
  try {
    const data = await loadJSON(PATHS.IMPOSTOS_FEDERAIS, 'impostos federais');
    impostosFederaisData = data;
    populateSelect(ELEMENTS.IMP_FEDERAL, data, { valueKey: 'imposto_federal', labelKey: 'imposto_federal' });
    return data;
  } catch (error) {
    notify.error(
      'Erro ao Carregar Impostos Federais',
      'Não foi possível carregar as opções de impostos federais.'
    );
    return [];
  } finally {
    setSelectLoading(ELEMENTS.IMP_FEDERAL, false);
  }
}

/**
 * Carrega os dados de faixas do Simples Nacional
 */
async function loadFaixasSimplesNacional() {
  setSelectLoading(ELEMENTS.FAIXA_SIMPLES, true);
  try {
    const data = await loadJSON(PATHS.FAIXAS_SIMPLES_NACIONAL, 'faixas do Simples Nacional');
    faixasSimplesNacionalData = data;
    populateSelect(ELEMENTS.FAIXA_SIMPLES, data, { valueKey: 'faixa', labelKey: 'faixa_descricao' });
    return data;
  } catch (error) {
    notify.error(
      'Erro ao Carregar Faixas do Simples',
      'Não foi possível carregar as faixas do Simples Nacional.'
    );
    return [];
  } finally {
    setSelectLoading(ELEMENTS.FAIXA_SIMPLES, false);
  }
}

/**
 * Inicializa o carregamento de todos os dados
 */
export async function initializeData() {
  logger.group('📊 Carregamento de Dados de Tributação');
  logger.time('Carregamento de dados');
  
  try {
    const results = await Promise.allSettled([
      loadTributacoes(),
      loadImpostosFederais(),
      loadFaixasSimplesNacional()
    ]);
    
    // Verifica se algum carregamento falhou
    const failures = results.filter(r => r.status === 'rejected');
    
    if (failures.length > 0) {
      logger.warn(
        MODULE,
        `${failures.length} de 3 carregamentos falharam`,
        { failures }
      );
    }
    
    // Verifica se pelo menos alguns dados foram carregados
    const hasData = 
      tributacaoData.length > 0 ||
      impostosFederaisData.length > 0 ||
      faixasSimplesNacionalData.length > 0;
    
    if (!hasData) {
      throw new Error('Nenhum dado de tributação pôde ser carregado');
    }
    
    logger.timeEnd('Carregamento de dados');
    logger.success(MODULE, 'Dados de tributação carregados', {
      tributacoes: tributacaoData.length,
      impostosFederais: impostosFederaisData.length,
      faixasSimples: faixasSimplesNacionalData.length
    });
    logger.groupEnd();
    
  } catch (error) {
    logger.timeEnd('Carregamento de dados');
    logger.groupEnd();
    logger.error(MODULE, 'Falha crítica no carregamento de dados', error);
    
    notify.error(
      'Erro Crítico',
      'Não foi possível carregar os dados necessários. A aplicação pode não funcionar corretamente.',
      0 // não desaparece automaticamente
    );
    
    throw error;
  }
}

/**
 * Retorna os dados de tributação
 */
export function getTributacaoData() {
  if (tributacaoData.length === 0) {
    logger.warn(MODULE, 'Tentativa de acessar dados de tributação vazios');
  }
  return tributacaoData;
}

/**
 * Retorna os dados de impostos federais
 */
export function getImpostosFederaisData() {
  if (impostosFederaisData.length === 0) {
    logger.warn(MODULE, 'Tentativa de acessar dados de impostos federais vazios');
  }
  return impostosFederaisData;
}

/**
 * Retorna os dados de faixas do Simples Nacional
 */
export function getFaixasSimplesNacionalData() {
  if (faixasSimplesNacionalData.length === 0) {
    logger.warn(MODULE, 'Tentativa de acessar dados de faixas do Simples vazios');
  }
  return faixasSimplesNacionalData;
}