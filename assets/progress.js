(function(){
  var STORE_KEY = 'vtol-pipeline-progress-v1';
  var state = {};
  try {
    state = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
  } catch(e) { state = {}; }

  var checkboxes = Array.prototype.slice.call(document.querySelectorAll('.checklist input[type="checkbox"]'));

  function save(){
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch(e) {}
  }

  function updatePhaseIndicator(phaseId){
    var list = document.querySelectorAll('.checklist[data-phase="' + phaseId + '"] input[type="checkbox"]');
    if (!list.length) return;
    var done = 0;
    list.forEach(function(cb){ if (cb.checked) done++; });
    var link = document.querySelector('.rail a[href="#' + phaseId + '"]');
    if (link) link.setAttribute('data-done', done === list.length ? 'true' : 'false');
  }

  function updateOverall(){
    if (!checkboxes.length) return;
    var done = checkboxes.filter(function(cb){ return cb.checked; }).length;
    var pct = Math.round((done / checkboxes.length) * 100);
    var pctEl = document.getElementById('pct');
    var fillEl = document.getElementById('pctFill');
    if (pctEl) pctEl.textContent = pct;
    if (fillEl) fillEl.style.width = pct + '%';
  }

  checkboxes.forEach(function(cb){
    if (state[cb.id]) { cb.checked = true; }
    cb.closest('.check-item').classList.toggle('done', cb.checked);
    cb.addEventListener('change', function(){
      state[cb.id] = cb.checked;
      save();
      cb.closest('.check-item').classList.toggle('done', cb.checked);
      var phase = cb.closest('.checklist').getAttribute('data-phase');
      updatePhaseIndicator(phase);
      updateOverall();
    });
  });

  document.querySelectorAll('.checklist').forEach(function(list){
    updatePhaseIndicator(list.getAttribute('data-phase'));
  });
  updateOverall();
})();
