// views/fatal-error-view.js

import { notify } from '../utils/notifications.js';
import { escapeHTML } from '../utils/formatters.js';

/**
 * Exibe mensagem de erro fatal com opção de recarregar
 */
export function showFatalError({ title, message, technical, action = 'Recarregar' }) {
  const existingError = document.getElementById('fatal-error-container');
  if (existingError) existingError.remove();

  const errorDiv = document.createElement('div');
  errorDiv.id = 'fatal-error-container';
  errorDiv.style.cssText = `
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
    animation: fatalErrorFadeIn 0.3s ease;
  `;

  errorDiv.innerHTML = `
    <div class="fatal-error-card" style="
      background: white;
      border-radius: 12px;
      padding: 32px;
      max-width: 500px;
      width: 90%;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      animation: fatalErrorSlideUp 0.3s ease;
    ">
      <div style="
        width: 64px; height: 64px;
        background: #fee;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto 20px;
      ">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
            stroke="#e53935" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h2 style="margin: 0 0 12px; color: #333; text-align: center; font-size: 24px;">${escapeHTML(title)}</h2>
      <p style="margin: 0 0 20px; color: #666; text-align: center; line-height: 1.6;">${escapeHTML(message)}</p>
      ${technical ? `
        <details style="margin: 0 0 20px; padding: 12px; background: #f5f5f5; border-radius: 6px; cursor: pointer;">
          <summary style="color: #666; font-size: 14px;">Detalhes técnicos</summary>
          <pre style="margin: 12px 0 0; padding: 8px; background: white; border-radius: 4px; font-size: 12px; color: #e53935; overflow-x: auto;">${escapeHTML(technical)}</pre>
        </details>
      ` : ''}
      <button type="button" style="
        width: 100%; padding: 14px;
        background: #5aa2ff; color: white;
        border: none; border-radius: 8px;
        font-size: 16px; font-weight: 600;
        cursor: pointer; transition: background 0.2s;
      " onmouseover="this.style.background='#4890ff'" onmouseout="this.style.background='#5aa2ff'">
        ${escapeHTML(action)}
      </button>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes fatalErrorFadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fatalErrorSlideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes fatalErrorFadeOut { to { opacity: 0; } }
    @keyframes fatalErrorSlideDown { to { transform: translateY(10px); opacity: 0; } }
    #fatal-error-container.is-closing { animation: fatalErrorFadeOut 180ms ease forwards; }
    #fatal-error-container.is-closing .fatal-error-card { animation: fatalErrorSlideDown 180ms ease forwards; }
  `;
  document.head.appendChild(style);
  document.body.appendChild(errorDiv);

  const dismissBtn = errorDiv.querySelector('button');
  dismissBtn.addEventListener('click', () => {
    errorDiv.classList.add('is-closing');
    errorDiv.addEventListener('animationend', () => window.location.reload(), { once: true });
  });

  notify.error(title, message, 0);
}
