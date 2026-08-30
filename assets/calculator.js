(function(){
  var WCG_KEY = 'vtol-tools-weight-cg-v1';

  var wcgBody = document.getElementById('wcg-tbody');
  if (!wcgBody) return; // this script only runs on the calculator page

  var nextId = 1;
  var rows = [];

  function loadRows(){
    var stored = null;
    try { stored = JSON.parse(localStorage.getItem(WCG_KEY) || 'null'); } catch(e) { stored = null; }
    if (stored && Array.isArray(stored) && stored.length) {
      rows = stored;
    } else {
      rows = [
        { id: 1, name: 'Battery', weight: '', distance: '' },
        { id: 2, name: 'Flight controller', weight: '', distance: '' }
      ];
    }
    nextId = rows.reduce(function(max, r){ return Math.max(max, r.id); }, 0) + 1;
  }

  function saveRows(){
    try { localStorage.setItem(WCG_KEY, JSON.stringify(rows)); } catch(e) {}
  }

  function num(v){
    var n = parseFloat(v);
    return isFinite(n) ? n : 0;
  }

  function renderRows(){
    wcgBody.innerHTML = '';
    rows.forEach(function(row){
      var tr = document.createElement('tr');
      tr.setAttribute('data-row-id', row.id);

      var tdName = document.createElement('td');
      var nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.className = 'tool-input';
      nameInput.placeholder = 'Component name';
      nameInput.value = row.name || '';
      nameInput.addEventListener('input', function(){
        row.name = nameInput.value;
        saveRows();
      });
      tdName.appendChild(nameInput);

      var tdWeight = document.createElement('td');
      var weightInput = document.createElement('input');
      weightInput.type = 'number';
      weightInput.className = 'tool-input';
      weightInput.step = 'any';
      weightInput.placeholder = '0';
      weightInput.value = row.weight || '';
      weightInput.addEventListener('input', function(){
        row.weight = weightInput.value;
        saveRows();
        recalcWeightCG();
      });
      tdWeight.appendChild(weightInput);

      var tdDistance = document.createElement('td');
      var distInput = document.createElement('input');
      distInput.type = 'number';
      distInput.className = 'tool-input';
      distInput.step = 'any';
      distInput.placeholder = '0';
      distInput.value = row.distance || '';
      distInput.addEventListener('input', function(){
        row.distance = distInput.value;
        saveRows();
        recalcWeightCG();
      });
      tdDistance.appendChild(distInput);

      var tdRemove = document.createElement('td');
      var removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'btn btn-sm btn-remove';
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', function(){
        rows = rows.filter(function(r){ return r.id !== row.id; });
        saveRows();
        renderRows();
        recalcWeightCG();
      });
      tdRemove.appendChild(removeBtn);

      tr.appendChild(tdName);
      tr.appendChild(tdWeight);
      tr.appendChild(tdDistance);
      tr.appendChild(tdRemove);
      wcgBody.appendChild(tr);
    });
  }

  function recalcWeightCG(){
    var totalWeight = 0;
    var moment = 0;
    rows.forEach(function(row){
      var w = num(row.weight);
      var d = num(row.distance);
      totalWeight += w;
      moment += w * d;
    });
    var cg = totalWeight > 0 ? moment / totalWeight : 0;

    var totalEl = document.getElementById('wcg-total-weight');
    var cgEl = document.getElementById('wcg-cg-position');
    if (totalEl) totalEl.textContent = totalWeight.toFixed(1);
    if (cgEl) cgEl.textContent = totalWeight > 0 ? cg.toFixed(1) : '—';

    var totalBtn = document.getElementById('tm-use-total');
    if (totalBtn) totalBtn.textContent = 'Use Weight & CG total (' + totalWeight.toFixed(1) + ' g)';
    var wlBtn = document.getElementById('wl-use-total');
    if (wlBtn) wlBtn.textContent = 'Use Weight & CG total (' + totalWeight.toFixed(1) + ' g)';

    return { totalWeight: totalWeight, cg: cg };
  }

  var addRowBtn = document.getElementById('wcg-add-row');
  if (addRowBtn) {
    addRowBtn.addEventListener('click', function(){
      rows.push({ id: nextId++, name: '', weight: '', distance: '' });
      saveRows();
      renderRows();
      recalcWeightCG();
    });
  }

  loadRows();
  renderRows();
  recalcWeightCG();

  /* ---------- Thrust margin ---------- */
  var tmThrust = document.getElementById('tm-motor-thrust');
  var tmCount = document.getElementById('tm-motor-count');
  var tmWeight = document.getElementById('tm-weight');
  var tmUseTotal = document.getElementById('tm-use-total');
  var tmTotalThrustEl = document.getElementById('tm-total-thrust');
  var tmRatioEl = document.getElementById('tm-ratio');
  var tmStatusEl = document.getElementById('tm-status');

  function recalcThrustMargin(){
    var perMotor = num(tmThrust ? tmThrust.value : 0);
    var count = num(tmCount ? tmCount.value : 0);
    var weight = num(tmWeight ? tmWeight.value : 0);
    var totalThrust = perMotor * count;
    var ratio = weight > 0 ? totalThrust / weight : 0;

    if (tmTotalThrustEl) tmTotalThrustEl.textContent = totalThrust.toFixed(0);
    if (tmRatioEl) tmRatioEl.textContent = (weight > 0 && totalThrust > 0) ? ratio.toFixed(2) + '×' : '—';

    if (tmStatusEl) {
      tmStatusEl.className = 'pill';
      if (weight <= 0 || totalThrust <= 0) {
        tmStatusEl.textContent = 'Enter thrust and weight';
        tmStatusEl.classList.add('optional');
      } else if (ratio >= 2.0) {
        tmStatusEl.textContent = 'Good — ' + ratio.toFixed(2) + '×';
        tmStatusEl.classList.add('good');
      } else if (ratio >= 1.5) {
        tmStatusEl.textContent = 'Marginal — ' + ratio.toFixed(2) + '×';
        tmStatusEl.classList.add('warn');
      } else {
        tmStatusEl.textContent = 'Insufficient — ' + ratio.toFixed(2) + '×';
        tmStatusEl.classList.add('bad');
      }
    }
  }

  [tmThrust, tmCount, tmWeight].forEach(function(el){
    if (el) el.addEventListener('input', recalcThrustMargin);
  });
  if (tmUseTotal) {
    tmUseTotal.addEventListener('click', function(){
      var totals = recalcWeightCG();
      if (tmWeight) tmWeight.value = totals.totalWeight.toFixed(1);
      recalcThrustMargin();
    });
  }
  recalcThrustMargin();

  /* ---------- Wing loading ---------- */
  var wlWeight = document.getElementById('wl-weight');
  var wlUseTotal = document.getElementById('wl-use-total');
  var wlAreaDirect = document.getElementById('wl-area-direct');
  var wlSpan = document.getElementById('wl-wingspan');
  var wlChord = document.getElementById('wl-chord');
  var wlModeDirect = document.getElementById('wl-mode-direct');
  var wlModeSpanChord = document.getElementById('wl-mode-spanchord');
  var wlDirectFields = document.getElementById('wl-direct-fields');
  var wlSpanChordFields = document.getElementById('wl-spanchord-fields');
  var wlAreaEl = document.getElementById('wl-area');
  var wlLoadingEl = document.getElementById('wl-loading');
  var wlTierEl = document.getElementById('wl-tier');

  function wingLoadingTier(gPerDm2){
    if (gPerDm2 < 35) return { label: 'Light — very forgiving (trainer/glider territory)', cls: 'good' };
    if (gPerDm2 < 55) return { label: 'Moderate — sport-trainer range', cls: 'good' };
    if (gPerDm2 < 75) return { label: 'Brisk — sport/aerobatic range, less forgiving', cls: 'warn' };
    return { label: 'Heavy — fast and demanding, little margin for error', cls: 'bad' };
  }

  function updateWingLoadingModeVisibility(){
    var useDirect = wlModeDirect && wlModeDirect.checked;
    if (wlDirectFields) wlDirectFields.hidden = !useDirect;
    if (wlSpanChordFields) wlSpanChordFields.hidden = !!useDirect;
  }

  function recalcWingLoading(){
    updateWingLoadingModeVisibility();
    var weight = num(wlWeight ? wlWeight.value : 0);
    var area;
    if (wlModeDirect && wlModeDirect.checked) {
      area = num(wlAreaDirect ? wlAreaDirect.value : 0);
    } else {
      var span = num(wlSpan ? wlSpan.value : 0);
      var chord = num(wlChord ? wlChord.value : 0);
      area = (span * chord) / 10000; // mm^2 -> dm^2 (1 dm^2 = 10,000 mm^2)
    }
    var loading = (weight > 0 && area > 0) ? weight / area : 0;

    if (wlAreaEl) wlAreaEl.textContent = area > 0 ? area.toFixed(2) : '—';
    if (wlLoadingEl) wlLoadingEl.textContent = loading > 0 ? loading.toFixed(1) : '—';

    if (wlTierEl) {
      wlTierEl.className = 'pill';
      if (loading > 0) {
        var tier = wingLoadingTier(loading);
        wlTierEl.textContent = tier.label;
        wlTierEl.classList.add(tier.cls);
      } else {
        wlTierEl.textContent = 'Enter weight and wing area';
        wlTierEl.classList.add('optional');
      }
    }
  }

  [wlWeight, wlAreaDirect, wlSpan, wlChord].forEach(function(el){
    if (el) el.addEventListener('input', recalcWingLoading);
  });
  [wlModeDirect, wlModeSpanChord].forEach(function(el){
    if (el) el.addEventListener('change', recalcWingLoading);
  });
  if (wlUseTotal) {
    wlUseTotal.addEventListener('click', function(){
      var totals = recalcWeightCG();
      if (wlWeight) wlWeight.value = totals.totalWeight.toFixed(1);
      recalcWingLoading();
    });
  }
  recalcWingLoading();
})();
