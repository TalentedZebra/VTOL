(function(){
  var canvas = document.getElementById('pid-canvas');
  if (!canvas) return;
  var kpSlider = document.getElementById('pid-kp');
  var kiSlider = document.getElementById('pid-ki');
  var kdSlider = document.getElementById('pid-kd');
  var noiseToggle = document.getElementById('pid-noise');
  var kpValue = document.getElementById('pid-kp-value');
  var kiValue = document.getElementById('pid-ki-value');
  var kdValue = document.getElementById('pid-kd-value');
  var finalEl = document.getElementById('pid-final');
  var overshootEl = document.getElementById('pid-overshoot');
  var ctx = canvas.getContext('2d');

  var VW = 800, VH = 380;

  // Simplified physical model constants, tuned (see repo history / commit message) so the
  // three behaviors this page describes in text are clearly visible at reasonable slider
  // positions: sluggish P-only undershoot, oscillatory high-P, and a smooth well-tuned PID.
  var INERTIA = 0.35;
  var DAMPING = 0.9;
  var BIAS = -4; // a small constant disturbance torque (e.g. a trim imbalance) so I has something real to correct
  var TARGET = 30;
  var DT = 0.02;
  var DURATION = 5; // seconds
  var NOISE_AMPLITUDE = 1.3;

  // simple deterministic PRNG so results are reproducible frame to frame while the toggle is on
  var rngState = 12345;
  function nextRand(){
    rngState = (rngState * 1103515245 + 12345) & 0x7fffffff;
    return rngState / 0x7fffffff;
  }

  function simulate(Kp, Ki, Kd, noiseOn){
    rngState = 12345;
    var theta = 0, omega = 0, integral = 0;
    var measuredPrevError = TARGET - 0;
    var steps = Math.round(DURATION / DT);
    var series = new Array(steps);
    for (var i = 0; i < steps; i++) {
      var noise = noiseOn ? (nextRand() - 0.5) * 2 * NOISE_AMPLITUDE : 0;
      var measuredTheta = theta + noise;
      var e = TARGET - measuredTheta;
      integral += e * DT;
      var derivative = (e - measuredPrevError) / DT;
      measuredPrevError = e;
      var u = Kp * e + Ki * integral + Kd * derivative;
      var alpha = (u - DAMPING * omega + BIAS) / INERTIA;
      omega += alpha * DT;
      theta += omega * DT;
      series[i] = theta;
    }
    return series;
  }

  function readColors(){
    var cs = getComputedStyle(document.documentElement);
    function v(name, fallback){
      var val = cs.getPropertyValue(name);
      return val ? val.trim() : fallback;
    }
    return {
      surface2: v('--surface-2', '#eee'),
      line: v('--line', '#ccc'),
      lineStrong: v('--line-strong', '#999'),
      ink: v('--ink', '#111'),
      inkMuted: v('--ink-muted', '#555'),
      inkFaint: v('--ink-faint', '#888'),
      teal: v('--teal', '#0a7'),
      accent: v('--accent', '#c40'),
      warn: v('--warn', '#a70')
    };
  }

  function render(){
    var Kp = parseFloat(kpSlider.value);
    var Ki = parseFloat(kiSlider.value);
    var Kd = parseFloat(kdSlider.value);
    var noiseOn = noiseToggle && noiseToggle.checked;

    kpValue.textContent = Kp.toFixed(1);
    kiValue.textContent = Ki.toFixed(2);
    kdValue.textContent = Kd.toFixed(2);

    var series = simulate(Kp, Ki, Kd, noiseOn);
    var colors = readColors();

    var dataMin = Math.min(0, TARGET, Math.min.apply(null, series));
    var dataMax = Math.max(TARGET, Math.max.apply(null, series));
    var pad = Math.max(2, (dataMax - dataMin) * 0.12);
    var yMin = dataMin - pad, yMax = dataMax + pad;

    var marginL = 46, marginR = 16, marginT = 16, marginB = 34;
    var plotW = VW - marginL - marginR;
    var plotH = VH - marginT - marginB;

    function xPix(t){ return marginL + (t / DURATION) * plotW; }
    function yPix(val){ return marginT + (1 - (val - yMin) / (yMax - yMin)) * plotH; }

    ctx.clearRect(0, 0, VW, VH);
    ctx.fillStyle = colors.surface2;
    ctx.fillRect(0, 0, VW, VH);

    // gridlines + axis labels (y)
    ctx.strokeStyle = colors.line;
    ctx.fillStyle = colors.inkFaint;
    ctx.font = '11px IBM Plex Mono, monospace';
    ctx.lineWidth = 1;
    var ySteps = 5;
    for (var g = 0; g <= ySteps; g++) {
      var val = yMin + (yMax - yMin) * (g / ySteps);
      var py = yPix(val);
      ctx.beginPath();
      ctx.moveTo(marginL, py);
      ctx.lineTo(VW - marginR, py);
      ctx.stroke();
      ctx.fillText(val.toFixed(0), 6, py + 4);
    }
    var xSteps = 5;
    for (var xg = 0; xg <= xSteps; xg++) {
      var tval = DURATION * (xg / xSteps);
      var px = xPix(tval);
      ctx.fillText(tval.toFixed(1) + 's', px - 10, VH - marginB + 16);
    }

    // target line
    ctx.strokeStyle = colors.inkMuted;
    ctx.setLineDash([5, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(marginL, yPix(TARGET));
    ctx.lineTo(VW - marginR, yPix(TARGET));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = colors.inkMuted;
    ctx.fillText('target', VW - marginR - 40, yPix(TARGET) - 6);

    // response curve
    ctx.strokeStyle = noiseOn && Kd > 1.5 ? colors.warn : colors.teal;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (var i = 0; i < series.length; i++) {
      var t = i * DT;
      var x = xPix(t), y = yPix(series[i]);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // axes
    ctx.strokeStyle = colors.lineStrong;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(marginL, marginT);
    ctx.lineTo(marginL, VH - marginB);
    ctx.lineTo(VW - marginR, VH - marginB);
    ctx.stroke();

    var finalVal = series[series.length - 1];
    var maxVal = Math.max.apply(null, series);
    var overshootPct = ((maxVal - TARGET) / TARGET) * 100;
    if (finalEl) finalEl.textContent = finalVal.toFixed(1) + ' (target ' + TARGET + ')';
    if (overshootEl) overshootEl.textContent = overshootPct > 0.5 ? '+' + overshootPct.toFixed(0) + '%' : 'none';
  }

  function resizeCanvas(){
    var wrap = canvas.parentElement;
    var cssWidth = wrap.clientWidth;
    var cssHeight = cssWidth * (VH / VW);
    var dpr = window.devicePixelRatio || 1;
    canvas.style.width = cssWidth + 'px';
    canvas.style.height = cssHeight + 'px';
    canvas.width = Math.round(VW * dpr);
    canvas.height = Math.round(VH * dpr);
    ctx.setTransform(canvas.width / VW, 0, 0, canvas.height / VH, 0, 0);
    render();
  }

  [kpSlider, kiSlider, kdSlider].forEach(function(el){
    el.addEventListener('input', render);
  });
  if (noiseToggle) noiseToggle.addEventListener('change', render);
  window.addEventListener('resize', resizeCanvas);
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', render);
  }

  resizeCanvas();
})();
