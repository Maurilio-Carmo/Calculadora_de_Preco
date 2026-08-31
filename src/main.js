// src/main.js

import { loadComponents } from './utils/component-loader.js';
import { loadAppVersion } from './utils/version-handler.js';
import { initializeUpdateHandler } from './handlers/update-handler.js';
import { initializeData, getTributacaoData, getImpostosFederaisData, getFaixasSimplesNacionalData } from './services/data-loader.js';
import { processCalculation } from './controllers/calculation-controller.js';
import { setupCalculationListeners, setupTaxUpdateListeners } from './handlers/event-handlers.js';
import { setupRegimeVisibilityHandler } from './handlers/regime-handler.js';
import { initializeTheme } from './views/theme-handler.js';
import { initializeTooltips } from './views/tooltip-handler.js';
import { initializeMenu } from './handlers/menu-handler.js';
import { initializePerfilModal } from './handlers/perfil-modal-handler.js';
import { getRegimeTributario } from './services/perfil-service.js';
import { ELEMENTS } from './config/constants.js';
import { logger } from './utils/logger.js';
import { notify } from './utils/notifications.js';
import { eventBus } from './utils/event-bus.js';
import { initializePerformanceOptimizations } from './utils/performance.js';
import { initializePWA } from './utils/pwa.js';
import { showFatalError } from './views/fatal-error-view.js';
import { enhanceSelects } from './views/custom-select.js';

const MODULE = 'Main';

/**
 * Carrega todos os componentes HTML
 */
async function loadHTMLComponents() {
  logger.group('📄 Carregamento de Componentes HTML');

  try {
    await loadComponents([
      { id: 'header-container',       path: 'components/header.html',        skeleton: 'header'  },
      { id: 'side-menu-container',    path: 'components/side-menu.html',      skeleton: 'default' },
      { id: 'perfil-modal-container', path: 'components/perfil-modal.html',   skeleton: 'default' },
      { id: 'left-panel-container',   path: 'components/left-panel.html',     skeleton: 'panel'   },
      { id: 'right-panel-container',  path: 'components/right-panel.html',    skeleton: 'sidebar' },
      { id: 'tooltip-modal-container',path: 'components/tooltip-modal.html',  skeleton: 'default' },
      { id: 'footer-container',       path: 'components/footer.html',         skeleton: 'default' }
    ]);

    logger.groupEnd();
  } catch (error) {
    logger.groupEnd();
    throw error;
  }
}

/**
 * Carrega o regime do perfil e define no calculador
 */
function loadRegimeFromPerfil() {
  const regimeSalvo = getRegimeTributario();
  const regimeSelect = document.getElementById(ELEMENTS.REGIME);

  if (regimeSalvo && regimeSelect) {
    regimeSelect.value = regimeSalvo;
    logger.success(MODULE, 'Regime tributário carregado do perfil', { regime: regimeSalvo });

    const event = new Event('change', { bubbles: true });
    regimeSelect.dispatchEvent(event);
  } else {
    logger.debug(MODULE, 'Nenhum regime salvo no perfil');
  }
}

/**
 * Registra listener do EventBus para atualizar o regime quando o perfil é salvo
 */
function setupPerfilRegimeListener() {
  eventBus.on('perfil:regime-changed', (regime) => {
    const regimeSelect = document.getElementById(ELEMENTS.REGIME);

    if (regime && regimeSelect) {
      regimeSelect.value = regime;
      logger.success(MODULE, 'Regime atualizado via perfil', { regime });

      const event = new Event('change', { bubbles: true });
      regimeSelect.dispatchEvent(event);

      notify.success('Regime Atualizado', `Regime tributário alterado para ${regime}`);
    }
  });
}

/**
 * Inicializa a aplicação
 */
async function initializeApp() {
  try {
    logger.group('🚀 Inicialização da Aplicação');
    logger.time('Tempo total de inicialização');

    await loadHTMLComponents();
    enhanceSelects([
      ELEMENTS.REGIME,
      ELEMENTS.TRIBUTACAO,
      ELEMENTS.IMP_FEDERAL,
      ELEMENTS.FAIXA_SIMPLES,
      ELEMENTS.PERFIL_REGIME
    ]);
    loadAppVersion();
    await initializeData();

    const tributacaoData = getTributacaoData();
    const impostosFederaisData = getImpostosFederaisData();
    const faixasSimplesNacionalData = getFaixasSimplesNacionalData();

    setupPerfilRegimeListener();
    loadRegimeFromPerfil();
    setupCalculationListeners(processCalculation);
    setupTaxUpdateListeners(tributacaoData, impostosFederaisData, faixasSimplesNacionalData, processCalculation);
    setupRegimeVisibilityHandler(processCalculation);
    initializeTheme();
    initializeMenu();
    initializePerfilModal();
    initializeTooltips();
    initializePerformanceOptimizations();
    initializePWA();
    initializeUpdateHandler();

    processCalculation();

    logger.timeEnd('Tempo total de inicialização');
    logger.success(MODULE, 'Aplicação inicializada com sucesso!');
    logger.groupEnd();
    sessionStorage.setItem('app_initialized', 'true');

  } catch (error) {
    logger.groupEnd();
    logger.error(MODULE, 'Falha crítica na inicialização da aplicação', error);

    showFatalError({
      title: 'Erro ao Carregar Aplicação',
      message: 'Não foi possível inicializar a calculadora. Por favor, recarregue a página.',
      technical: error.message,
      action: 'Recarregar Página'
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

window.addEventListener('error', (event) => {
  logger.error(MODULE, 'Erro não tratado capturado', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
});

window.addEventListener('unhandledrejection', (event) => {
  logger.error(MODULE, 'Promise rejeitada não tratada', { reason: event.reason });
  event.preventDefault();
});
