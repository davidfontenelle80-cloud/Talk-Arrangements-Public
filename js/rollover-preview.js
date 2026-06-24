/**
 * Stage 4C — Rollover Conflict Resolution Workflow.
 * Adds safe conflict-resolution actions inside the rollover preview modal.
 * Safety: same-year blocked, unresolved conflicts blocked, explicit confirmation required before Apply or fixed-rule changes.
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
  function newId() {
    return window.crypto && crypto.randomUUID ? crypto.randomUUID() : 'row-' + Date.now().toString(36) + Math.random().toString(36).slice(2);
  }
  function lookupContact(name) {
    if (typeof lookupCoord === 'function') return lookupCoord(name);
    const c = Array.isArray(window.state && state.congregations) ? state.congregations.find(function (item) { return item && item.name === name; }) : null;
    return c ? (c.coordinator || '') : '';
  }
  function saveAndRefresh() {
    if (typeof saveState === 'function') saveState();
    renderPreviewBody();
  }

  function ensureStyles() {
    if (document.getElementById('rolloverPreviewShellStyles')) return;
    const style = document.createElement('style');
    style.id = 'rolloverPreviewShellStyles';
    style.textContent = [
      '.rollover-preview-shell-bg{display:none;position:fixed;inset:0;z-index:430;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.55);}',
      '.rollover-preview-shell-bg.open{display:flex;}',
      '.rollover-preview-shell{width:min(920px,100%);max-height:90vh;overflow:auto;background:var(--panel);border:1px solid var(--line,var(--border));border-radius:var(--radius);box-shadow:var(--shadow);padding:16px;}',
      '.rollover-preview-shell-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;}',
      '.rollover-preview-shell-controls{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0;align-items:center;}',
      '.rollover-preview-shell-controls label{display:flex;gap:6px;align-items:center;flex-wrap:wrap;}',
      '.rollover-preview-shell-controls select{padding:8px 10px;}',
      '.rollover-preview-shell-note{border:1px solid var(--line,var(--border));border-radius:var(--radius-sm);padding:10px;background:var(--panel-2,var(--panel));color:var(--muted);}',
      '.rollover-preview-summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px;margin-bottom:12px;}',
      '.rollover-preview-stat{border:1px solid var(--line,var(--border));border-radius:var(--radius-sm);padding:9px;background:var(--panel-2,var(--panel));}',
      '.rollover-preview-stat b{display:block;font-size:22px;line-height:1;}',
      '.rollover-preview-alert{border:1px solid var(--danger);border-radius:var(--radius-sm);background:color-mix(in srgb,var(--danger),var(--panel) 88%);padding:10px;margin:0 0 10px;}',
      '.rollover-preview-ok{border:1px solid var(--ok);border-radius:var(--radius-sm);background:color-mix(in srgb,var(--ok),var(--panel) 88%);padding:10px;margin:0 0 10px;}',
      '.rollover-preview-list{display:grid;gap:8px;}',
      '.rollover-preview-row{border:1px solid var(--line,var(--border));border-radius:var(--radius-sm);background:var(--panel-2,var(--panel));padding:10px;display:grid;gap:4px;}',
      '.rollover-preview-row strong{font-weight:800;}',
      '.rollover-preview-small{font-size:13px;line-height:1.35;color:var(--muted);}',
      '.rollover-resolution-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;}',
      '.rollover-resolution-actions button{font-size:12px;padding:7px 9px;}',
      '.rollover-resolution-badge{display:inline-block;border:1px solid var(--ok);border-radius:999px;padding:3px 8px;margin-top:4px;color:var(--ok);font-size:12px;font-weight:800;}',
      '.rollover-preview-fixed{border-color:var(--ok);box-shadow:inset 5px 0 0 var(--ok);}',
      '.rollover-preview-year{border-color:var(--accent,#7aa2ff);box-shadow:inset 5px 0 0 var(--accent,#7aa2ff);}',
      '.rollover-preview-copy{border-color:var(--line,var(--border));}',
      '.rollover-preview-override{border-color:var(--warn);box-shadow:inset 5px 0 0 var(--warn);}',
      '.rollover-preview-conflict{border-color:var(--danger);box-shadow:inset 5px 0 0 var(--danger);}',
      '.rollover-preview-resolved{border-color:var(--ok);box-shadow:inset 5px 0 0 var(--ok);}',
      '.rollover-preview-empty{opacity:.78;}',
      '@media(max-width:620px){.rollover-preview-shell{max-height:92vh;padding:14px}.rollover-preview-shell-controls label{width:100%}.rollover-preview-shell-controls select{width:100%}.rollover-resolution-actions button{width:100%}}'
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
  function ensurePlanningYear(year) {
    if (!Array.isArray(state.planning)) state.planning = [];
    let plan = planningFor(year);
    if (!plan) {
      plan = { year: Number(year), rows: [] };
      state.planning.push(plan);
      state.planning.sort(function (a, b) { return Number(a.year) - Number(b.year); });
    }
    if (!Array.isArray(plan.rows)) plan.rows = [];
    return plan;
  }
  function rowMonth(row) { return Number(row && row.month !== undefined ? row.month : row && row[0]); }
  function rowCongregation(row) { return String((row && row.congregation !== undefined ? row.congregation : row && row[1]) || '').trim(); }
  function rowFor(year, month) {
    const plan = planningFor(year);
    if (!plan || !Array.isArray(plan.rows)) return null;
    return plan.rows.find(function (row) { return rowMonth(row) === Number(month); }) || null;
  }
  function rules() { return Array.isArray(window.state && state.fixedArrangements) ? state.fixedArrangements : []; }
  function findRuleById(id) { return rules().find(function (rule) { return rule && id && String(rule.id) === String(id); }) || null; }
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
  function findRuleForConflict(item, ruleId) {
    return findRuleById(ruleId) || item.rule || fixedRuleFor(item.targetYear, item.month);
  }
  function hasSourceOverride(row) { return !!(row && Array.isArray(row.fixedOverrides) && row.fixedOverrides.length); }
  function sourceOverrideText(row) {
    if (!hasSourceOverride(row)) return '';
    return row.fixedOverrides.map(function (override) { return String(override && override.congregation || '').trim(); }).filter(Boolean).join(', ');
  }

  function resolutionKey(sourceYear, targetYear, month) { return [sourceYear, targetYear, month].join(':'); }
  function resolutions() {
    if (!state.rolloverResolutions || typeof state.rolloverResolutions !== 'object') state.rolloverResolutions = {};
    return state.rolloverResolutions;
  }
  function getResolution(sourceYear, targetYear, month) {
    return resolutions()[resolutionKey(sourceYear, targetYear, month)] || null;
  }
  function setResolution(sourceYear, targetYear, month, data) {
    resolutions()[resolutionKey(sourceYear, targetYear, month)] = Object.assign({ at: new Date().toISOString() }, data || {});
  }
  function clearResolution(sourceYear, targetYear, month) {
    delete resolutions()[resolutionKey(sourceYear, targetYear, month)];
  }

  function addRow(rows, totals, item) {
    rows.push(item);
    if (item.category === 'FIXED_RULE') totals.fixed += 1;
    else if (item.category === 'YEAR_SPECIFIC') totals.yearSpecific += 1;
    else if (item.category === 'COPIED') totals.copied += 1;
    else if (item.category === 'OVERRIDE_REVIEW') totals.overrideReview += 1;
    else if (item.category === 'CONFLICT') totals.conflicts += 1;
    else if (item.category === 'RESOLVED') totals.resolved += 1;
    else totals.empty += 1;
  }

  function resolutionLabel(kind) {
    if (kind === 'keep-target') return text('Resolved — Keep Current Schedule', 'Resuelto — Mantener programa actual');
    if (kind === 'use-preview') return text('Resolved — Use Preview Result', 'Resuelto — Usar resultado previsto');
    if (kind === 'fixed-updated') return text('Resolved — Fixed Arrangement Updated', 'Resuelto — Arreglo fijo actualizado');
    return text('Resolved', 'Resuelto');
  }

  function previewResults(sourceYear, targetYear) {
    const totals = { fixed: 0, yearSpecific: 0, copied: 0, overrideReview: 0, conflicts: 0, resolved: 0, empty: 0 };
    const rows = [];
    const sameYear = Number(sourceYear) === Number(targetYear);
    const sourcePlan = planningFor(sourceYear);

    for (let month = 0; month < 12; month += 1) {
      const sourceRow = rowFor(sourceYear, month);
      const targetRow = rowFor(targetYear, month);
      const sourceCong = rowCongregation(sourceRow);
      const targetCong = rowCongregation(targetRow);
      const fixedRule = fixedRuleFor(targetYear, month);
      const fixedCong = fixedRule ? String(fixedRule.congregation || '').trim() : '';
      const sourceHadOverride = hasSourceOverride(sourceRow);
      const rawProposed = sourceHadOverride ? (fixedCong || '') : (fixedCong || sourceCong);
      const base = { month: month, sourceYear: Number(sourceYear), targetYear: Number(targetYear), sourceCong: sourceCong, targetCong: targetCong, fixedCong: fixedCong, rule: fixedRule, proposedCong: rawProposed };
      const res = getResolution(sourceYear, targetYear, month);

      if (!sourcePlan) {
        addRow(rows, totals, Object.assign(base, { category: 'EMPTY', proposedCong: '' }));
      } else if (targetCong && rawProposed && targetCong !== rawProposed) {
        if (res && res.kind === 'keep-target') {
          addRow(rows, totals, Object.assign(base, { category: 'RESOLVED', resolutionKind: 'keep-target', proposedCong: targetCong, resolutionNote: resolutionLabel('keep-target') }));
        } else if (res && res.kind === 'use-preview') {
          addRow(rows, totals, Object.assign(base, { category: 'RESOLVED', resolutionKind: 'use-preview', proposedCong: rawProposed, resolutionNote: resolutionLabel('use-preview') }));
        } else {
          addRow(rows, totals, Object.assign(base, { category: 'CONFLICT', proposedCong: rawProposed, reasonKind: fixedRule ? 'fixed-target-diff' : 'copy-target-diff' }));
        }
      } else if (sourceHadOverride) {
        addRow(rows, totals, Object.assign(base, { category: 'OVERRIDE_REVIEW', overrideCong: sourceOverrideText(sourceRow), proposedCong: rawProposed }));
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
    return { totals: totals, rows: rows, sameYear: sameYear, missingSource: !sourcePlan };
  }

  function categoryLabel(category) {
    const labels = {
      FIXED_RULE: text('Fixed rule', 'Regla fija'),
      YEAR_SPECIFIC: text('Year-specific rule', 'Regla de año específico'),
      COPIED: text('Copied from source', 'Copiado del año origen'),
      OVERRIDE_REVIEW: text('Override not carried forward', 'Anulación no se copia'),
      CONFLICT: text('Conflict — review required', 'Conflicto — requiere revisión'),
      RESOLVED: text('Resolved conflict', 'Conflicto resuelto'),
      EMPTY: text('Empty', 'Vacío')
    };
    return labels[category] || category;
  }
  function rowClass(category) {
    return { FIXED_RULE: 'rollover-preview-fixed', YEAR_SPECIFIC: 'rollover-preview-year', COPIED: 'rollover-preview-copy', OVERRIDE_REVIEW: 'rollover-preview-override', CONFLICT: 'rollover-preview-conflict', RESOLVED: 'rollover-preview-resolved', EMPTY: 'rollover-preview-empty' }[category] || '';
  }
  function rowDetail(item) {
    if (item.category === 'RESOLVED') return text('This conflict has a selected resolution. Apply will use the shown preview result.', 'Este conflicto tiene una resolución seleccionada. Aplicar usará el resultado previsto que se muestra.');
    if (item.category === 'CONFLICT') {
      if (item.reasonKind === 'copy-target-diff') return text('The target year already has a different congregation. Choose a resolution before applying rollover.', 'El año destino ya tiene una congregación diferente. Escoja una resolución antes de aplicar el cambio de año.');
      return text('A fixed rule applies, but the target year already has a different congregation. Choose a resolution before applying rollover.', 'Aplica una regla fija, pero el año destino ya tiene una congregación diferente. Escoja una resolución antes de aplicar el cambio de año.');
    }
    if (item.category === 'OVERRIDE_REVIEW') {
      return item.fixedCong ? text('Source year had a one-year override. The target year will use the fixed arrangement instead.', 'El año origen tenía una anulación de un solo año. El año destino usará el arreglo fijo.') : text('Source year had a one-year override. It will not copy forward automatically.', 'El año origen tenía una anulación de un solo año. No se copiará automáticamente.');
    }
    if (item.category === 'FIXED_RULE') return text('A continuous fixed arrangement applies to this target month.', 'Un arreglo fijo continuo aplica a este mes destino.');
    if (item.category === 'YEAR_SPECIFIC') return text('A selected-years fixed arrangement applies to this target month.', 'Un arreglo fijo de años seleccionados aplica a este mes destino.');
    if (item.category === 'COPIED') return item.targetCong ? text('Target already matches the preview result.', 'El destino ya coincide con el resultado previsto.') : text('No fixed rule applies, so this will copy from the source year.', 'No aplica una regla fija, así que se copiará del año origen.');
    return text('No fixed rule or source congregation was found.', 'No se encontró regla fija ni congregación en el año origen.');
  }

  function validationMessage(result) {
    if (result.missingSource) return text('Source year has no planning data.', 'El año origen no tiene datos de planificación.');
    if (result.sameYear) return text('Source year and target year cannot be the same.', 'El año origen y el año destino no pueden ser iguales.');
    if (result.totals.conflicts > 0) return text('Resolve all conflicts before applying rollover.', 'Resuelva todos los conflictos antes de aplicar el cambio de año.');
    return '';
  }

  function resolutionActions(item) {
    if (item.category !== 'CONFLICT') return '';
    const base = ' data-source-year="' + escLocal(item.sourceYear) + '" data-target-year="' + escLocal(item.targetYear) + '" data-month="' + escLocal(item.month) + '"';
    let html = '<div class="rollover-resolution-actions">' +
      '<button type="button" data-rollover-resolution="keep-target"' + base + '>' + escLocal(text('Keep Current Schedule', 'Mantener programa actual')) + '</button>' +
      '<button type="button" data-rollover-resolution="use-preview"' + base + '>' + escLocal(text('Use Preview Result', 'Usar resultado previsto')) + '</button>';
    if (item.rule && item.targetCong) {
      html += '<button type="button" data-rollover-resolution="update-fixed" data-rule-id="' + escLocal(item.rule.id || '') + '"' + base + '>' + escLocal(text('Update Fixed Arrangement', 'Actualizar arreglo fijo')) + '</button>';
    }
    html += '</div>';
    return html;
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
      stat(totals.overrideReview, text('Overrides not carried forward', 'Anulaciones no copiadas')) +
      stat(totals.conflicts, text('Unresolved conflicts', 'Conflictos sin resolver')) +
      stat(totals.resolved, text('Resolved conflicts', 'Conflictos resueltos')) +
      stat(totals.empty, text('Empty months', 'Meses vacíos')) +
      '</div>';

    const validation = validationMessage(result);
    if (validation) {
      html += '<div class="rollover-preview-alert"><strong>⚠ ' + escLocal(validation) + '</strong><div class="rollover-preview-small">' + escLocal(text('Apply is blocked until this is resolved.', 'Aplicar queda bloqueado hasta resolver esto.')) + '</div></div>';
    } else {
      html += '<div class="rollover-preview-ok"><strong>✓ ' + escLocal(text('Ready to apply', 'Listo para aplicar')) + '</strong><div class="rollover-preview-small">' + escLocal(text('Review the months below, then use Apply Rollover when ready.', 'Revise los meses abajo y use Aplicar cambio de año cuando esté listo.')) + '</div></div>';
    }

    html += '<div class="rollover-preview-small" style="margin-bottom:10px;">' + escLocal(text('Preview recalculates before apply. Data changes only after final confirmation.', 'La vista previa se recalcula antes de aplicar. Los datos cambian solo después de la confirmación final.')) + '</div>';
    html += '<div class="rollover-preview-list">';
    result.rows.forEach(function (item) {
      const proposedLine = item.proposedCong ? '<div class="rollover-preview-small"><strong>' + escLocal(text('Preview result', 'Resultado previsto')) + ':</strong> ' + escLocal(item.proposedCong) + '</div>' : '';
      const sourceLine = item.sourceCong ? '<div class="rollover-preview-small"><strong>' + escLocal(text('Source', 'Origen')) + ':</strong> ' + escLocal(item.sourceCong) + '</div>' : '';
      const targetLabel = item.category === 'CONFLICT' || item.category === 'RESOLVED' ? text('Target has now', 'Destino tiene ahora') : text('Target already matches', 'Destino ya coincide');
      const targetLine = item.targetCong ? '<div class="rollover-preview-small"><strong>' + escLocal(targetLabel) + ':</strong> ' + escLocal(item.targetCong) + '</div>' : '';
      const overrideLine = item.overrideCong ? '<div class="rollover-preview-small"><strong>' + escLocal(text('Source-year override', 'Anulación del año origen')) + ':</strong> ' + escLocal(item.overrideCong) + '</div>' : '';
      const resolvedLine = item.category === 'RESOLVED' ? '<div><span class="rollover-resolution-badge">' + escLocal(item.resolutionNote || resolutionLabel(item.resolutionKind)) + '</span></div>' : '';
      html += '<div class="rollover-preview-row ' + rowClass(item.category) + '">' +
        '<strong>' + escLocal(names[item.month] || item.month) + ' — ' + escLocal(categoryLabel(item.category)) + '</strong>' +
        resolvedLine + proposedLine + sourceLine + targetLine + overrideLine +
        '<div class="rollover-preview-small">' + escLocal(rowDetail(item)) + '</div>' +
        resolutionActions(item) +
        '</div>';
    });
    html += '</div>';
    return html;
  }

  function buildApplySummary(result, sourceYear, targetYear) {
    const t = result.totals;
    return text('Apply rollover from ', 'Aplicar cambio de año de ') + sourceYear + text(' to ', ' a ') + targetYear + '?\n\n' +
      text('Fixed arrangements: ', 'Arreglos fijos: ') + t.fixed + '\n' +
      text('Year-specific rules: ', 'Reglas de años específicos: ') + t.yearSpecific + '\n' +
      text('Copied months: ', 'Meses copiados: ') + t.copied + '\n' +
      text('Resolved conflicts: ', 'Conflictos resueltos: ') + t.resolved + '\n' +
      text('Overrides not carried forward: ', 'Anulaciones no copiadas: ') + t.overrideReview + '\n' +
      text('Empty months: ', 'Meses vacíos: ') + t.empty + '\n\n' +
      text('This will update the target planning year after confirmation.', 'Esto actualizará el año destino después de confirmar.');
  }

  function rowFromPreviewItem(item) {
    return {
      id: newId(),
      month: item.month,
      congregation: item.proposedCong || '',
      contact: item.proposedCong ? lookupContact(item.proposedCong) : '',
      confirmed: false,
      note: item.category === 'FIXED_RULE' || item.category === 'YEAR_SPECIFIC' ? text('Fixed arrangement', 'Arreglo fijo') : item.category === 'RESOLVED' ? text('Resolved rollover conflict', 'Conflicto de cambio de año resuelto') : ''
    };
  }

  function applyRolloverNow(sourceYear, targetYear, result) {
    const targetPlan = ensurePlanningYear(targetYear);
    const existingByMonth = {};
    targetPlan.rows.forEach(function (row) { existingByMonth[rowMonth(row)] = row; });
    const nextRows = [];
    result.rows.forEach(function (item) {
      const current = existingByMonth[item.month];
      const next = rowFromPreviewItem(item);
      if (current && rowCongregation(current) === next.congregation) {
        next.id = current.id || next.id;
        next.contact = current.contact || next.contact;
        next.confirmed = current.confirmed || false;
        next.note = current.note || next.note;
      }
      nextRows.push(next);
    });
    targetPlan.rows = nextRows;
    if (typeof saveState === 'function') saveState();
    if (typeof renderAll === 'function') renderAll();
    else if (typeof renderPlanning === 'function') renderPlanning();
  }

  function showApplyComplete(result, targetYear) {
    const t = result.totals;
    const message = text('Rollover applied for ', 'Cambio de año aplicado para ') + targetYear + '.\n' +
      text('Fixed: ', 'Fijos: ') + t.fixed + ', ' +
      text('Year-specific: ', 'Años específicos: ') + t.yearSpecific + ', ' +
      text('Copied: ', 'Copiados: ') + t.copied + ', ' +
      text('Resolved: ', 'Resueltos: ') + t.resolved + ', ' +
      text('Overrides not carried forward: ', 'Anulaciones no copiadas: ') + t.overrideReview + '.';
    if (typeof toast === 'function') toast(message);
    const body = document.getElementById('rolloverPreviewShellBody');
    if (body) body.insertAdjacentHTML('afterbegin', '<div class="rollover-preview-ok"><strong>✓ ' + escLocal(text('Rollover complete', 'Cambio de año completado')) + '</strong><div class="rollover-preview-small">' + escLocal(message) + '</div></div>');
  }

  function handleApply() {
    const source = document.getElementById('rolloverPreviewSource');
    const target = document.getElementById('rolloverPreviewTarget');
    if (!source || !target) return;
    const sourceYear = Number(source.value);
    const targetYear = Number(target.value);
    const result = previewResults(sourceYear, targetYear);
    const validation = validationMessage(result);
    renderPreviewBody();
    if (validation) {
      if (typeof toast === 'function') toast(validation);
      return;
    }
    const message = buildApplySummary(result, sourceYear, targetYear);
    const proceed = function () {
      const fresh = previewResults(sourceYear, targetYear);
      const freshValidation = validationMessage(fresh);
      if (freshValidation) {
        renderPreviewBody();
        if (typeof toast === 'function') toast(freshValidation);
        return;
      }
      applyRolloverNow(sourceYear, targetYear, fresh);
      renderModalText(true);
      showApplyComplete(fresh, targetYear);
    };
    if (typeof showConfirm === 'function') showConfirm(message, proceed);
    else if (window.confirm(message)) proceed();
  }

  function handleResolution(action, sourceYear, targetYear, month, ruleId) {
    const result = previewResults(sourceYear, targetYear);
    const item = result.rows.find(function (row) { return Number(row.month) === Number(month); });
    if (!item || item.category !== 'CONFLICT') return;
    if (action === 'keep-target') {
      setResolution(sourceYear, targetYear, month, { kind: 'keep-target', targetCong: item.targetCong, sourceCong: item.sourceCong, proposedCong: item.proposedCong });
      saveAndRefresh();
      if (typeof toast === 'function') toast(text('Current schedule kept for this conflict.', 'Programa actual mantenido para este conflicto.'));
      return;
    }
    if (action === 'use-preview') {
      setResolution(sourceYear, targetYear, month, { kind: 'use-preview', targetCong: item.targetCong, sourceCong: item.sourceCong, proposedCong: item.proposedCong });
      saveAndRefresh();
      if (typeof toast === 'function') toast(text('Preview result selected for this conflict.', 'Resultado previsto seleccionado para este conflicto.'));
      return;
    }
    if (action === 'update-fixed') {
      const rule = findRuleForConflict(item, ruleId);
      if (!rule || !item.targetCong) {
        if (typeof toast === 'function') toast(text('Fixed arrangement rule could not be found.', 'No se pudo encontrar la regla de arreglo fijo.'));
        return;
      }
      const msg = text('Update the fixed arrangement to match the current target schedule? This changes future years. Continue?', '¿Actualizar el arreglo fijo para que coincida con el programa actual del destino? Esto cambiará años futuros. ¿Continuar?') + '\n\n' +
        text('Fixed Arrangement: ', 'Arreglo fijo: ') + String(rule.congregation || '') + '\n' +
        text('New Fixed Arrangement: ', 'Nuevo arreglo fijo: ') + item.targetCong;
      const proceed = function () {
        rule.congregation = item.targetCong;
        clearResolution(sourceYear, targetYear, month);
        saveAndRefresh();
        if (typeof toast === 'function') toast(text('Fixed arrangement updated.', 'Arreglo fijo actualizado.'));
      };
      if (typeof showConfirm === 'function') showConfirm(msg, proceed);
      else if (window.confirm(msg)) proceed();
    }
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
      '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px;flex-wrap:wrap;"><button type="button" id="rolloverPreviewShellDone"></button><button type="button" id="rolloverPreviewShellApply"></button></div>' +
      '</div>';
    document.body.appendChild(modal);
    function close() { modal.classList.remove('open'); }
    document.getElementById('rolloverPreviewShellClose').addEventListener('click', close);
    document.getElementById('rolloverPreviewShellDone').addEventListener('click', close);
    document.getElementById('rolloverPreviewShellApply').addEventListener('click', handleApply);
    modal.addEventListener('click', function (event) {
      const btn = event.target && event.target.closest ? event.target.closest('[data-rollover-resolution]') : null;
      if (btn) {
        event.preventDefault();
        handleResolution(btn.dataset.rolloverResolution, Number(btn.dataset.sourceYear), Number(btn.dataset.targetYear), Number(btn.dataset.month), btn.dataset.ruleId || '');
        return;
      }
      if (event.target === modal) close();
    });
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
    updateApplyButton();
  }
  function updateApplyButton() {
    const source = document.getElementById('rolloverPreviewSource');
    const target = document.getElementById('rolloverPreviewTarget');
    const apply = document.getElementById('rolloverPreviewShellApply');
    if (!source || !target || !apply) return;
    const result = previewResults(Number(source.value), Number(target.value));
    const validation = validationMessage(result);
    apply.textContent = validation ? text('Apply blocked', 'Aplicar bloqueado') : text('Apply Rollover', 'Aplicar cambio de año');
    apply.disabled = !!validation;
  }
  function renderModalText(preserveSelection) {
    const modal = buildModal();
    const years = yearOptions();
    const defaultSource = defaultSourceYear();
    const previousSource = document.getElementById('rolloverPreviewSource')?.value;
    const previousTarget = document.getElementById('rolloverPreviewTarget')?.value;
    const options = years.map(function (year) { return '<option value="' + year + '">' + year + '</option>'; }).join('');
    document.getElementById('rolloverPreviewShellTitle').textContent = text('Rollover Preview', 'Vista previa del cambio de año');
    document.getElementById('rolloverPreviewShellHint').textContent = text('Resolve conflicts, review, then apply after confirmation.', 'Resuelva conflictos, revise y luego aplique después de confirmar.');
    document.getElementById('rolloverSourceLabel').innerHTML = text('Source year', 'Año origen') + ': <select id="rolloverPreviewSource">' + options + '</select>';
    document.getElementById('rolloverTargetLabel').innerHTML = text('Target year', 'Año destino') + ': <select id="rolloverPreviewTarget">' + options + '</select>';
    document.getElementById('rolloverPreviewShellDone').textContent = text('Close', 'Cerrar');
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
