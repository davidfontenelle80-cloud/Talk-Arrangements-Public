/**
 * Stage 4A — Rollover Preview
 * Batch 4: read-only preview polish and conflict clarity.
 * No save calls. No localStorage writes. No Firebase writes. No rollover apply behavior.
 */
(function () {
  'use strict';

  function isEs() { return window.state && state.language === 'es'; }
  function text(en, es) { return isEs() ? es : en; }
  function escLocal(value) {
    if (typeof esc === 'function') return esc(value);
    value = String(value == null ? '' : value);
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function monthNames() {
    return typeof months === 'function' ? months() : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  }

  function ensureStyles() {
    if (document.getElementById('rolloverPreviewShellStyles')) return;
    const style = document.createElement('style');
    style.id = 'rolloverPreviewShellStyles';
    style.textContent = [
      '.rollover-preview-shell-bg{display:none;position:fixed;inset:0;z-index:430;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.55);}',
      '.rollover-preview-shell-bg.open{display:flex;}',
      '.rollover-preview-shell{width:min(880px,100%);max-height:90vh;overflow:auto;background:var(--panel);border:1px solid var(--line,var(--border));border-radius:var(--radius);box-shadow:var(--shadow);padding:16px;}',
      '.rollover-preview-shell-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;}',
      '.rollover-preview-shell-controls{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0;align-items:center;}',
      '.rollover-preview-shell-controls label{display:flex;gap:6px;align-items:center;flex-wrap:wrap;}',
      '.rollover-preview-shell-controls select{padding:8px 10px;}',
      '.rollover-preview-shell-note{border:1px solid var(--line,var(--border));border-radius:var(--radius-sm);padding:10px;background:var(--panel-2,var(--panel));color:var(--muted);}',
      '.rollover-preview-summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(125px,1fr));gap:8px;margin-bottom:12px;}',
      '.rollover-preview-stat{border:1px solid var(--line,var(--border));border-radius:var(--radius-sm);padding:9px;background:var(--panel-2,var(--panel));}',
      '.rollover-preview-stat b{display:block;font-size:22px;line-height:1;}',
      '.rollover-preview-alert{border:1px solid var(--danger);border-radius:var(--radius-sm);background:color-mix(in srgb,var(--danger),var(--panel) 88%);padding:10px;margin:0 0 10px;}',
      '.rollover-preview-list{display:grid;gap:8px;}',
      '.rollover-preview-row{border:1px solid var(--line,var(--border));border-radius:var(--radius-sm);background:var(--panel-2,var(--panel));padding:10px;display:grid;gap:4px;}',
      '.rollover-preview-row strong{font-weight:800;}',
      '.rollover-preview-small{font-size:13px;line-height:1.35;color:var(--muted);}',
      '.rollover-preview-fixed{border-color:var(--ok);box-shadow:inset 5px 0 0 var(--ok);}',
      '.rollover-preview-year{border-color:var(--accent,#7aa2ff);box-shadow:inset 5px 0 0 var(--accent,#7aa2ff);}',
      '.rollover-preview-copy{border-color:var(--line,var(--border));}',
      '.rollover-preview-override{border-color:var(--warn);box-shadow:inset 5px 0 0 var(--warn);}',
      '.rollover-preview-conflict{border-color:var(--danger);box-shadow:inset 5px 0 0 var(--danger);}',
      '.rollover-preview-empty{opacity:.78;}',
      '@media(max-width:620px){.rollover-preview-shell{max-height:92vh;padding:14px}.rollover-preview-shell-controls label{width:100%}.rollover-preview-shell-controls select{width:100%}}'
    ].join('');
    document.head.appendChild(style);
  }

  function planningYears() {
    if (!Array.isArray(window.state && state.planning)) return [];
    return state.planning.map(function (plan) { return Number(plan.year); }).filter(Boolean);
  }
  function yearOptions() {
    const current = Number((window.state && state.currentYear) || new Date().getFullYear());
    const years = planningYears().concat([current, current + 1, current + 2, current + 3, current + 4]);
    return Array.from(new Set(years.filter(Boolean))).sort(function (a, b) { return a - b; });
  }
  function defaultSourceYear() {
    const years = planningYears().sort(function (a, b) { return a - b; });
    const current = Number((window.state && state.currentYear) || new Date().getFullYear());
    return years.indexOf(current) !== -1 ? current : (years[0] || current);
  }
  function planningFor(year) {
    if (!Array.isArray(window.state && state.planning)) return null;
    return state.planning.find(function (plan) { return Number(plan.year) === Number(year); }) || null;
  }
  function rowMonth(row) { return Number(row && row.month !== undefined ? row.month : row && row[0]); }
  function rowCongregation(row) { return String((row && row.congregation !== undefined ? row.congregation : row && row[1]) || '').trim(); }
  function rowFor(year, month) {
    const plan = planningFor(year);
    if (!plan || !Array.isArray(plan.rows)) return null;
    return plan.rows.find(function (row) { return rowMonth(row) === Number(month); }) || null;
  }
  function rules() { return Array.isArray(window.state && state.fixedArrangements) ? state.fixedArrangements : []; }
  function appliesToYear(rule, year) {
    if (!rule) return false;
    if (rule.mode === 'years') return Array.isArray(rule.years) && rule.years.indexOf(Number(year)) !== -1;
    return true;
  }
  function fixedRuleFor(year, month) {
    return rules().find(function (rule) {
      return rule && String(rule.congregation || '').trim() && Array.isArray(rule.months) && rule.months.indexOf(Number(month)) !== -1 && appliesToYear(rule, year);
    }) || null;
  }
  function hasSourceOverride(row) { return !!(row && Array.isArray(row.fixedOverrides) && row.fixedOverrides.length); }
  function sourceOverrideText(row) {
    if (!hasSourceOverride(row)) return '';
    return row.fixedOverrides.map(function (override) { return String(override && override.congregation || '').trim(); }).filter(Boolean).join(', ');
  }

  function addRow(rows, totals, item) {
    rows.push(item);
    if (item.category === 'FIXED_RULE') totals.fixed += 1;
    else if (item.category === 'YEAR_SPECIFIC') totals.yearSpecific += 1;
    else if (item.category === 'COPIED') totals.copied += 1;
    else if (item.category === 'OVERRIDE_REVIEW') totals.overrideReview += 1;
    else if (item.category === 'CONFLICT') totals.conflicts += 1;
    else totals.empty += 1;
  }

  function previewResults(sourceYear, targetYear) {
    const totals = { fixed: 0, yearSpecific: 0, copied: 0, overrideReview: 0, conflicts: 0, empty: 0 };
    const rows = [];

    for (let month = 0; month < 12; month += 1) {
      const sourceRow = rowFor(sourceYear, month);
      const targetRow = rowFor(targetYear, month);
      const sourceCong = rowCongregation(sourceRow);
      const targetCong = rowCongregation(targetRow);
      const fixedRule = fixedRuleFor(targetYear, month);
      const fixedCong = fixedRule ? String(fixedRule.congregation || '').trim() : '';
      const sourceHadOverride = hasSourceOverride(sourceRow);
      const proposedCong = fixedCong || sourceCong;
      const base = { month: month, sourceCong: sourceCong, targetCong: targetCong, fixedCong: fixedCong, rule: fixedRule };

      if (targetCong && proposedCong && targetCong !== proposedCong) {
        addRow(rows, totals, Object.assign(base, { category: 'CONFLICT', proposedCong: proposedCong, reasonKind: fixedRule ? 'fixed-target-diff' : 'copy-target-diff' }));
      } else if (sourceHadOverride) {
        addRow(rows, totals, Object.assign(base, { category: 'OVERRIDE_REVIEW', overrideCong: sourceOverrideText(sourceRow), proposedCong: proposedCong }));
      } else if (fixedRule && fixedRule.mode === 'years') {
        addRow(rows, totals, Object.assign(base, { category: 'YEAR_SPECIFIC', proposedCong: fixedCong }));
      } else if (fixedRule) {
        addRow(rows, totals, Object.assign(base, { category: 'FIXED_RULE', proposedCong: fixedCong }));
      } else if (sourceCong) {
        addRow(rows, totals, Object.assign(base, { category: 'COPIED', proposedCong: sourceCong }));
      } else {
        addRow(rows, totals, Object.assign(base, { category: 'EMPTY', proposedCong: '' }));
      }
    }
    return { totals: totals, rows: rows };
  }

  function categoryLabel(category) {
    const labels = {
      FIXED_RULE: text('Fixed rule', 'Regla fija'),
      YEAR_SPECIFIC: text('Year-specific rule', 'Regla de año específico'),
      COPIED: text('Copied from source', 'Copiado del año origen'),
      OVERRIDE_REVIEW: text('Override review', 'Revisar anulación'),
      CONFLICT: text('Conflict — review required', 'Conflicto — requiere revisión'),
      EMPTY: text('Empty', 'Vacío')
    };
    return labels[category] || category;
  }
  function rowClass(category) {
    return { FIXED_RULE: 'rollover-preview-fixed', YEAR_SPECIFIC: 'rollover-preview-year', COPIED: 'rollover-preview-copy', OVERRIDE_REVIEW: 'rollover-preview-override', CONFLICT: 'rollover-preview-conflict', EMPTY: 'rollover-preview-empty' }[category] || '';
  }
  function rowDetail(item) {
    if (item.category === 'CONFLICT') {
      if (item.reasonKind === 'copy-target-diff') return text('The target year already has a different congregation. This month must be reviewed before any rollover apply step.', 'El año destino ya tiene una congregación diferente. Este mes debe revisarse antes de aplicar cualquier cambio de año.');
      return text('A fixed rule applies, but the target year already has a different congregation. Nothing will be overwritten.', 'Aplica una regla fija, pero el año destino ya tiene una congregación diferente. No se sobrescribirá nada.');
    }
    if (item.category === 'OVERRIDE_REVIEW') {
      return item.fixedCong ? text('Source year had a one-year override. The target preview returns to the fixed rule unless reviewed in Stage 4B.', 'El año origen tenía una anulación de un solo año. La vista previa vuelve a la regla fija salvo que se revise en la Etapa 4B.') : text('Source year had a one-year override. It will not copy forward automatically.', 'El año origen tenía una anulación de un solo año. No se copiará automáticamente.');
    }
    if (item.category === 'FIXED_RULE') return text('A continuous fixed arrangement applies to this target month.', 'Un arreglo fijo continuo aplica a este mes destino.');
    if (item.category === 'YEAR_SPECIFIC') return text('A selected-years fixed arrangement applies to this target month.', 'Un arreglo fijo de años seleccionados aplica a este mes destino.');
    if (item.category === 'COPIED') return item.targetCong ? text('Target already matches the preview result.', 'El destino ya coincide con el resultado previsto.') : text('No fixed rule applies, so this would copy from the source year.', 'No aplica una regla fija, así que se copiaría del año origen.');
    return text('No fixed rule or source congregation was found.', 'No se encontró regla fija ni congregación en el año origen.');
  }

  function resultHtml(sourceYear, targetYear) {
    const names = monthNames();
    const result = previewResults(sourceYear, targetYear);
    const totals = result.totals;
    const stat = function (count, label) { return '<div class="rollover-preview-stat"><b>' + count + '</b><span>' + escLocal(label) + '</span></div>'; };
    let html = '<div class="rollover-preview-summary">' +
      stat(totals.fixed, text('Fixed arrangements', 'Arreglos fijos')) +
      stat(totals.yearSpecific, text('Year-specific rules', 'Reglas de años específicos')) +
      stat(totals.copied, text('Copied months', 'Meses copiados')) +
      stat(totals.overrideReview, text('Overrides requiring review', 'Anulaciones por revisar')) +
      stat(totals.conflicts, text('Conflicts', 'Conflictos')) +
      stat(totals.empty, text('Empty months', 'Meses vacíos')) +
      '</div>';

    if (totals.conflicts) {
      html += '<div class="rollover-preview-alert"><strong>⚠ ' + escLocal(text('Review required before applying rollover', 'Revisión requerida antes de aplicar el cambio de año')) + '</strong><div class="rollover-preview-small">' + escLocal(text('Conflicts mean the target year already contains different planning data. This preview does not overwrite anything.', 'Los conflictos indican que el año destino ya contiene datos diferentes. Esta vista previa no sobrescribe nada.')) + '</div></div>';
    }
    html += '<div class="rollover-preview-small" style="margin-bottom:10px;">' + escLocal(text('Read-only preview. Closing this modal changes nothing.', 'Vista previa de solo lectura. Cerrar esta ventana no cambia nada.')) + '</div>';
    html += '<div class="rollover-preview-list">';
    result.rows.forEach(function (item) {
      const proposedLine = item.proposedCong ? '<div class="rollover-preview-small"><strong>' + escLocal(text('Preview result', 'Resultado previsto')) + ':</strong> ' + escLocal(item.proposedCong) + '</div>' : '';
      const sourceLine = item.sourceCong ? '<div class="rollover-preview-small"><strong>' + escLocal(text('Source', 'Origen')) + ':</strong> ' + escLocal(item.sourceCong) + '</div>' : '';
      const targetLabel = item.category === 'CONFLICT' ? text('Target has now', 'Destino tiene ahora') : text('Target already matches', 'Destino ya coincide');
      const targetLine = item.targetCong ? '<div class="rollover-preview-small"><strong>' + escLocal(targetLabel) + ':</strong> ' + escLocal(item.targetCong) + '</div>' : '';
      const overrideLine = item.overrideCong ? '<div class="rollover-preview-small"><strong>' + escLocal(text('Overridden fixed rule', 'Regla fija anulada')) + ':</strong> ' + escLocal(item.overrideCong) + '</div>' : '';
      html += '<div class="rollover-preview-row ' + rowClass(item.category) + '">' +
        '<strong>' + escLocal(names[item.month] || item.month) + ' — ' + escLocal(categoryLabel(item.category)) + '</strong>' +
        proposedLine + sourceLine + targetLine + overrideLine +
        '<div class="rollover-preview-small">' + escLocal(rowDetail(item)) + '</div>' +
        '</div>';
    });
    html += '</div>';
    return html;
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
      '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px;flex-wrap:wrap;"><button type="button" id="rolloverPreviewShellDone"></button><button type="button" id="rolloverPreviewShellApply" disabled></button></div>' +
      '</div>';
    document.body.appendChild(modal);
    function close() { modal.classList.remove('open'); }
    document.getElementById('rolloverPreviewShellClose').addEventListener('click', close);
    document.getElementById('rolloverPreviewShellDone').addEventListener('click', close);
    modal.addEventListener('click', function (event) { if (event.target === modal) close(); });
    return modal;
  }
  function renderButtonText() {
    const btn = document.getElementById('rolloverPreviewBtn');
    if (btn) btn.innerHTML = '&#128269; <span>' + text('Preview Rollover', 'Vista previa') + '</span>';
  }
  function renderPreviewBody() {
    const source = document.getElementById('rolloverPreviewSource');
    const target = document.getElementById('rolloverPreviewTarget');
    const body = document.getElementById('rolloverPreviewShellBody');
    if (!source || !target || !body) return;
    body.innerHTML = resultHtml(Number(source.value), Number(target.value));
  }
  function renderModalText(preserveSelection) {
    const modal = buildModal();
    const years = yearOptions();
    const defaultSource = defaultSourceYear();
    const previousSource = document.getElementById('rolloverPreviewSource')?.value;
    const previousTarget = document.getElementById('rolloverPreviewTarget')?.value;
    const options = years.map(function (year) { return '<option value="' + year + '">' + year + '</option>'; }).join('');
    document.getElementById('rolloverPreviewShellTitle').textContent = text('Rollover Preview', 'Vista previa del cambio de año');
    document.getElementById('rolloverPreviewShellHint').textContent = text('Read-only calculation. No data will be changed.', 'Cálculo de solo lectura. No se cambiarán datos.');
    document.getElementById('rolloverSourceLabel').innerHTML = text('Source year', 'Año origen') + ': <select id="rolloverPreviewSource">' + options + '</select>';
    document.getElementById('rolloverTargetLabel').innerHTML = text('Target year', 'Año destino') + ': <select id="rolloverPreviewTarget">' + options + '</select>';
    document.getElementById('rolloverPreviewShellDone').textContent = text('Close', 'Cerrar');
    document.getElementById('rolloverPreviewShellApply').textContent = text('Stage 4B: Apply disabled', 'Aplicar en Etapa 4B');
    document.getElementById('rolloverPreviewShellApply').disabled = true;
    const source = document.getElementById('rolloverPreviewSource');
    const target = document.getElementById('rolloverPreviewTarget');
    if (source) source.value = preserveSelection && previousSource ? previousSource : String(defaultSource);
    if (target) target.value = preserveSelection && previousTarget ? previousTarget : String(Number(source && source.value || defaultSource) + 1);
    if (source) source.addEventListener('change', renderPreviewBody);
    if (target) target.addEventListener('change', renderPreviewBody);
    renderPreviewBody();
    return modal;
  }
  function openModal() { ensureStyles(); const modal = renderModalText(false); modal.classList.add('open'); }
  function injectButton() {
    if (document.getElementById('rolloverPreviewBtn')) { renderButtonText(); return; }
    const rolloverBtn = document.getElementById('rolloverBtn');
    if (!rolloverBtn || !rolloverBtn.parentNode) return;
    const btn = document.createElement('button');
    btn.id = 'rolloverPreviewBtn';
    btn.type = 'button';
    btn.addEventListener('click', openModal);
    rolloverBtn.parentNode.insertBefore(btn, rolloverBtn);
    renderButtonText();
  }
  function refreshLanguageText() {
    renderButtonText();
    const modal = document.getElementById('rolloverPreviewShellModal');
    if (modal && modal.classList.contains('open')) renderModalText(true);
  }
  document.addEventListener('click', function (event) {
    if (event.target && event.target.closest('[data-lang]')) setTimeout(refreshLanguageText, 80);
  });
  let tries = 0;
  (function waitForApp() { tries += 1; ensureStyles(); injectButton(); if (tries < 120) setTimeout(waitForApp, 500); })();
})();
