/**
 * Stage 4A — Rollover Preview
 * Batch 2: visible button and empty modal shell only.
 * No preview calculation. No data writes.
 */
(function () {
  'use strict';

  function isEs() {
    return window.state && state.language === 'es';
  }

  function text(en, es) {
    return isEs() ? es : en;
  }

  function ensureStyles() {
    if (document.getElementById('rolloverPreviewShellStyles')) return;
    const style = document.createElement('style');
    style.id = 'rolloverPreviewShellStyles';
    style.textContent = [
      '.rollover-preview-shell-bg{display:none;position:fixed;inset:0;z-index:430;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.55);}',
      '.rollover-preview-shell-bg.open{display:flex;}',
      '.rollover-preview-shell{width:min(760px,100%);max-height:90vh;overflow:auto;background:var(--panel);border:1px solid var(--line,var(--border));border-radius:var(--radius);box-shadow:var(--shadow);padding:16px;}',
      '.rollover-preview-shell-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;}',
      '.rollover-preview-shell-controls{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0;}',
      '.rollover-preview-shell-controls select{padding:8px 10px;}',
      '.rollover-preview-shell-note{border:1px solid var(--line,var(--border));border-radius:var(--radius-sm);padding:10px;background:var(--panel-2,var(--panel));color:var(--muted);}'
    ].join('');
    document.head.appendChild(style);
  }

  function yearOptions() {
    const current = Number((window.state && state.currentYear) || new Date().getFullYear());
    const years = [current, current + 1, current + 2, current + 3];
    if (Array.isArray(window.state && state.planning)) {
      state.planning.forEach(function (plan) { years.push(Number(plan.year)); });
    }
    return Array.from(new Set(years.filter(Boolean))).sort(function (a, b) { return a - b; });
  }

  function buildModal() {
    let modal = document.getElementById('rolloverPreviewShellModal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'rolloverPreviewShellModal';
    modal.className = 'rollover-preview-shell-bg no-print';
    modal.innerHTML = '<div class="rollover-preview-shell" role="dialog" aria-modal="true" aria-labelledby="rolloverPreviewShellTitle">' +
      '<div class="rollover-preview-shell-head"><div><h3 id="rolloverPreviewShellTitle"></h3><p class="muted" id="rolloverPreviewShellHint"></p></div><button type="button" class="icon-btn" id="rolloverPreviewShellClose">&#215;</button></div>' +
      '<div class="rollover-preview-shell-controls"><label id="rolloverSourceLabel"></label><label id="rolloverTargetLabel"></label></div>' +
      '<div class="rollover-preview-shell-note" id="rolloverPreviewShellBody"></div>' +
      '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px;"><button type="button" id="rolloverPreviewShellDone"></button><button type="button" id="rolloverPreviewShellApply" disabled></button></div>' +
      '</div>';
    document.body.appendChild(modal);

    function close() { modal.classList.remove('open'); }
    document.getElementById('rolloverPreviewShellClose').addEventListener('click', close);
    document.getElementById('rolloverPreviewShellDone').addEventListener('click', close);
    modal.addEventListener('click', function (event) { if (event.target === modal) close(); });
    return modal;
  }

  function openModal() {
    ensureStyles();
    const modal = buildModal();
    const years = yearOptions();
    const current = Number((window.state && state.currentYear) || new Date().getFullYear());
    const options = years.map(function (year) {
      return '<option value="' + year + '">' + year + '</option>';
    }).join('');

    document.getElementById('rolloverPreviewShellTitle').textContent = text('Rollover Preview', 'Vista previa del cambio de año');
    document.getElementById('rolloverPreviewShellHint').textContent = text('Batch 2 shell only. No data will be changed.', 'Solo estructura de la etapa 2. No se cambiarán datos.');
    document.getElementById('rolloverSourceLabel').innerHTML = text('Source year', 'Año origen') + ': <select id="rolloverPreviewSource">' + options + '</select>';
    document.getElementById('rolloverTargetLabel').innerHTML = text('Target year', 'Año destino') + ': <select id="rolloverPreviewTarget">' + options + '</select>';
    document.getElementById('rolloverPreviewShellBody').textContent = text('Preview results will be added in the next batch.', 'Los resultados de la vista previa se agregarán en el próximo lote.');
    document.getElementById('rolloverPreviewShellDone').textContent = text('Close', 'Cerrar');
    document.getElementById('rolloverPreviewShellApply').textContent = text('Apply disabled until Stage 4B', 'Aplicar desactivado hasta la Etapa 4B');

    const source = document.getElementById('rolloverPreviewSource');
    const target = document.getElementById('rolloverPreviewTarget');
    if (source) source.value = String(current);
    if (target) target.value = String(current + 1);
    modal.classList.add('open');
  }

  function injectButton() {
    if (document.getElementById('rolloverPreviewBtn')) return;
    const rolloverBtn = document.getElementById('rolloverBtn');
    if (!rolloverBtn || !rolloverBtn.parentNode) return;
    const btn = document.createElement('button');
    btn.id = 'rolloverPreviewBtn';
    btn.type = 'button';
    btn.innerHTML = '&#128269; <span>' + text('Preview Rollover', 'Vista previa') + '</span>';
    btn.addEventListener('click', openModal);
    rolloverBtn.parentNode.insertBefore(btn, rolloverBtn);
  }

  let tries = 0;
  (function waitForApp() {
    tries += 1;
    ensureStyles();
    injectButton();
    if (tries < 120) setTimeout(waitForApp, 500);
  })();
})();
