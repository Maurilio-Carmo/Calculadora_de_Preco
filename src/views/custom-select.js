// views/custom-select.js
//
// Decorator visual para <select> nativo: o select continua sendo a fonte de
// verdade (valor, evento 'change'), este componente só desenha um
// trigger+listbox custom por cima e mantém os dois sincronizados.

const openInstances = new Set();
let instanceCounter = 0;

function closeAllExcept(except) {
  openInstances.forEach(instance => {
    if (instance !== except) instance.close();
  });
}

class CustomSelect {
  constructor(native) {
    this.native = native;
    this.id = native.id;
    this.instanceId = `cs-${this.id}-${instanceCounter++}`;
    this.isOpen = false;
    this.highlightedIndex = -1;
    this.options = [];
    this.typeaheadBuffer = '';
    this.typeaheadTimer = null;

    this._buildDom();
    this._bindEvents();
    this._observeNative();

    this.syncOptions();
    this.syncDisabled();
    this.syncLoading();
  }

  _buildDom() {
    this.native.tabIndex = -1;
    this.native.classList.add('custom-select-native');

    this.trigger = document.createElement('button');
    this.trigger.type = 'button';
    this.trigger.id = `${this.id}-trigger`;
    this.trigger.className = 'custom-select-trigger';
    this.trigger.setAttribute('role', 'combobox');
    this.trigger.setAttribute('aria-haspopup', 'listbox');
    this.trigger.setAttribute('aria-expanded', 'false');
    this.trigger.setAttribute('aria-controls', `${this.instanceId}-listbox`);

    this.triggerLabel = document.createElement('span');
    this.triggerLabel.className = 'custom-select-trigger-label';
    this.trigger.appendChild(this.triggerLabel);

    const arrow = document.createElement('span');
    arrow.className = 'custom-select-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    this.trigger.appendChild(arrow);

    this.native.insertAdjacentElement('afterend', this.trigger);

    this.list = document.createElement('ul');
    this.list.id = `${this.instanceId}-listbox`;
    this.list.className = 'custom-select-listbox';
    this.list.setAttribute('role', 'listbox');
    this.list.hidden = true;
    document.body.appendChild(this.list);
  }

  _bindEvents() {
    this.trigger.addEventListener('click', () => this.toggle());
    this.trigger.addEventListener('keydown', e => this._onTriggerKeydown(e));

    this._onDocClick = e => {
      if (!this.isOpen) return;
      if (this.trigger.contains(e.target) || this.list.contains(e.target)) return;
      this.close();
    };
    document.addEventListener('click', this._onDocClick, true);

    this._onScrollOrResize = () => {
      if (this.isOpen) this._position();
    };
    window.addEventListener('scroll', this._onScrollOrResize, true);
    window.addEventListener('resize', this._onScrollOrResize);

    this.native.addEventListener('change', () => this.syncValue());
  }

  _observeNative() {
    this.optionsObserver = new MutationObserver(() => {
      this.syncOptions();
    });
    this.optionsObserver.observe(this.native, { childList: true });

    this.attrObserver = new MutationObserver(() => {
      this.syncDisabled();
      this.syncLoading();
    });
    this.attrObserver.observe(this.native, { attributes: true, attributeFilter: ['disabled', 'data-loading'] });
  }

  syncOptions() {
    this.list.innerHTML = '';
    this.options = Array.from(this.native.options);

    this.options.forEach((opt, index) => {
      const li = document.createElement('li');
      li.id = `${this.instanceId}-option-${index}`;
      li.className = 'custom-select-option';
      li.setAttribute('role', 'option');
      li.textContent = opt.textContent;
      if (opt.disabled) li.setAttribute('aria-disabled', 'true');
      li.addEventListener('click', () => this._selectIndex(index));
      this.list.appendChild(li);
    });

    this.syncValue();
  }

  syncValue() {
    const index = this.native.selectedIndex;
    const opt = this.options[index];
    this.triggerLabel.textContent = opt ? opt.textContent : '';

    Array.from(this.list.children).forEach((li, i) => {
      const selected = i === index;
      li.setAttribute('aria-selected', selected ? 'true' : 'false');
      li.classList.toggle('is-selected', selected);
    });
  }

  syncDisabled() {
    this.trigger.disabled = this.native.disabled;
    this.trigger.classList.toggle('is-disabled', this.native.disabled);
  }

  syncLoading() {
    this.trigger.classList.toggle('is-loading', this.native.dataset.loading === 'true');
  }

  toggle() {
    if (this.trigger.disabled) return;
    if (this.isOpen) this.close(); else this.open();
  }

  open() {
    if (this.trigger.disabled) return;
    closeAllExcept(this);

    this._cancelPendingClose();
    this.syncValue();
    this.isOpen = true;
    this.list.hidden = false;
    this.trigger.setAttribute('aria-expanded', 'true');
    this._position();
    this._highlight(this.native.selectedIndex >= 0 ? this.native.selectedIndex : 0);
    openInstances.add(this);

    // Double rAF: give the browser a frame to commit the pre-transition
    // (hidden -> visible, scale(0.96)/opacity 0) state before flipping to
    // .is-open, otherwise the transition gets coalesced away.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.list.classList.add('is-open');
      });
    });
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.trigger.setAttribute('aria-expanded', 'false');
    this.trigger.removeAttribute('aria-activedescendant');
    openInstances.delete(this);

    this.list.classList.remove('is-open');
    this._scheduleHide();
  }

  _scheduleHide() {
    this._cancelPendingClose();

    const finish = () => {
      this.list.hidden = true;
      this._pendingCloseTimer = null;
    };

    this._onListTransitionEnd = e => {
      if (e.target !== this.list) return;
      this.list.removeEventListener('transitionend', this._onListTransitionEnd);
      finish();
    };
    this.list.addEventListener('transitionend', this._onListTransitionEnd);

    // Fallback in case transitionend doesn't fire (e.g. element removed).
    this._pendingCloseTimer = setTimeout(finish, 230);
  }

  _cancelPendingClose() {
    if (this._pendingCloseTimer) {
      clearTimeout(this._pendingCloseTimer);
      this._pendingCloseTimer = null;
    }
    if (this._onListTransitionEnd) {
      this.list.removeEventListener('transitionend', this._onListTransitionEnd);
      this._onListTransitionEnd = null;
    }
  }

  _position() {
    const rect = this.trigger.getBoundingClientRect();
    const maxHeight = 240;
    const spaceBelow = window.innerHeight - rect.bottom;

    this.list.style.left = `${rect.left}px`;
    this.list.style.width = `${rect.width}px`;

    if (spaceBelow < maxHeight && rect.top > spaceBelow) {
      this.list.style.top = `${rect.top - 4}px`;
      this.list.style.setProperty('--cs-flip', 'translateY(-100%)');
      this.list.style.setProperty('--cs-origin', 'bottom');
    } else {
      this.list.style.top = `${rect.bottom + 4}px`;
      this.list.style.setProperty('--cs-flip', 'none');
      this.list.style.setProperty('--cs-origin', 'top');
    }
  }

  _highlight(index) {
    if (index < 0 || index >= this.options.length) return;
    this.highlightedIndex = index;

    Array.from(this.list.children).forEach((li, i) => {
      li.classList.toggle('is-highlighted', i === index);
    });

    this.trigger.setAttribute('aria-activedescendant', `${this.instanceId}-option-${index}`);
    this.list.children[index]?.scrollIntoView({ block: 'nearest' });
  }

  _selectIndex(index) {
    const opt = this.options[index];
    if (!opt || opt.disabled) return;

    this.native.value = opt.value;
    this.native.dispatchEvent(new Event('change', { bubbles: true }));
    this.close();
    this.trigger.focus();
  }

  _onTriggerKeydown(e) {
    const { key } = e;
    const navigationKeys = ['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' ', 'Escape'];

    if (navigationKeys.includes(key)) e.preventDefault();

    if (!this.isOpen && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)) {
      this.open();
      return;
    }

    switch (key) {
      case 'ArrowDown':
        this._highlight(Math.min(this.highlightedIndex + 1, this.options.length - 1));
        break;
      case 'ArrowUp':
        this._highlight(Math.max(this.highlightedIndex - 1, 0));
        break;
      case 'Home':
        this._highlight(0);
        break;
      case 'End':
        this._highlight(this.options.length - 1);
        break;
      case 'Enter':
      case ' ':
        if (this.isOpen) this._selectIndex(this.highlightedIndex);
        break;
      case 'Escape':
        this.close();
        break;
      default:
        if (key.length === 1) this._typeahead(key);
    }
  }

  _typeahead(char) {
    clearTimeout(this.typeaheadTimer);
    this.typeaheadBuffer += char.toLowerCase();
    this.typeaheadTimer = setTimeout(() => { this.typeaheadBuffer = ''; }, 500);

    const match = this.options.findIndex(opt =>
      opt.textContent.toLowerCase().startsWith(this.typeaheadBuffer)
    );
    if (match < 0) return;

    if (this.isOpen) {
      this._highlight(match);
    } else {
      this._selectIndex(match);
    }
  }
}

/**
 * Decora um <select> nativo com um dropdown custom (idempotente)
 */
export function enhanceSelect(selectId) {
  const native = document.getElementById(selectId);
  if (!native || native.tagName !== 'SELECT') return null;
  if (native.dataset.customSelectEnhanced) return null;

  native.dataset.customSelectEnhanced = 'true';
  return new CustomSelect(native);
}

/**
 * Decora múltiplos <select> nativos
 */
export function enhanceSelects(selectIds) {
  return selectIds.map(enhanceSelect).filter(Boolean);
}
