(function(){
  var canvas = document.getElementById('airfoil-shape-canvas');
  if (!canvas) return;
  var camberSlider = document.getElementById('shape-camber-slider');
  var thicknessSlider = document.getElementById('shape-thickness-slider');
  var camberValue = document.getElementById('shape-camber-value');
  var thicknessValue = document.getElementById('shape-thickness-value');
  var clValue = document.getElementById('shape-cl-value');
  var ctx = canvas.getContext('2d');

  var VW = 800, VH = 340;
  var chordPx = 280;
  var pivotX = 300, pivotY = 190;
  var AOA_FIXED_DEG = 4; // small, constant -- this widget isolates shape, not angle of attack
  var CAMBER_P = 0.4; // camber-position parameter held fixed; only camber magnitude is a control
  var K_CAMBER = 2; // thin-airfoil-theory-style zero-lift-angle approximation: alpha_L0 ~= -2*m

  var hasInteracted = false;
  var rafId = null;
  var startTime = null;

  function reducedMotion(){
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
      ink: v('--ink', '#111'),
      inkFaint: v('--ink-faint', '#888'),
      teal: v('--teal', '#0a7')
    };
  }

  // Same simplified NACA-4-digit-style thickness/camber formulas as airfoil-viz.js,
  // but with camber/thickness taken as live parameters instead of fixed constants,
  // since this widget's whole point is varying them.
  function nacaThickness(xc, t){
    return 5 * t * (0.2969 * Math.sqrt(xc) - 0.1260 * xc - 0.3516 * xc * xc + 0.2843 * xc * xc * xc - 0.1015 * xc * xc * xc * xc);
  }
  function nacaCamber(xc, m, p){
    if (m === 0) return 0;
    if (xc < p) return (m / (p * p)) * (2 * p * xc - xc * xc);
    return (m / ((1 - p) * (1 - p))) * ((1 - 2 * p) + 2 * p * xc - xc * xc);
  }
  function localUpper(xc, m, t){ return -(nacaCamber(xc, m, CAMBER_P) + nacaThickness(xc, t)) * chordPx; }
  function localLower(xc, m, t){ return -(nacaCamber(xc, m, CAMBER_P) - nacaThickness(xc, t)) * chordPx; }
  function localX(xc){ return (xc - 0.25) * chordPx; }

  function rotate(lx, ly, aRad){
    return {
      x: pivotX + (lx * Math.cos(aRad) - ly * Math.sin(aRad)),
      y: pivotY + (lx * Math.sin(aRad) + ly * Math.cos(aRad))
    };
  }

  function airfoilOutline(m, t, aRad){
    var pts = [];
    var n = 40;
    for (var i = 0; i <= n; i++) {
      var xc = i / n;
      pts.push(rotate(localX(xc), localUpper(xc, m, t), aRad));
    }
    for (var j = n; j >= 0; j--) {
      var xc2 = j / n;
      pts.push(rotate(localX(xc2), localLower(xc2, m, t), aRad));
    }
    return pts;
  }

  var LANES = [
    { side: 'u', standoff: 10, y0: pivotY - 30 },
    { side: 'u', standoff: 26, y0: pivotY - 56 },
    { side: 'u', standoff: 44, y0: pivotY - 86 },
    { side: 'l', standoff: 10, y0: pivotY + 30 },
    { side: 'l', standoff: 26, y0: pivotY + 56 },
    { side: 'l', standoff: 44, y0: pivotY + 86 }
  ];

  function easeInOut(t){ return t * t * (3 - 2 * t); }

  // No stall/turbulence machinery here at all -- angle of attack is fixed small, so flow
  // stays attached across the whole camber/thickness range. Only the smooth downwash
  // bend varies, driven by the same (alpha + camber) quantity that drives the C_L number
  // below, so the picture and the number always agree.
  function buildStreamline(lane, m, t, effectiveAngleRad, aRad, time){
    var near = [];
    var nSamples = 60;
    var xcStart = -0.18, xcEnd = 1.18;
    for (var i = 0; i <= nSamples; i++) {
      var xc = xcStart + (xcEnd - xcStart) * (i / nSamples);
      var xcClamped = Math.max(0, Math.min(1, xc));
      var baseLocalY = (lane.side === 'u' ? localUpper(xcClamped, m, t) : localLower(xcClamped, m, t));
      var dir = lane.side === 'u' ? -1 : 1;
      var ly = baseLocalY + dir * lane.standoff;
      var lx = localX(xcClamped) + (xc < 0 ? xc * chordPx : (xc > 1 ? (xc - 1) * chordPx : 0));
      near.push(rotate(lx, ly, aRad));
    }

    var entry = near[0];
    var exit = near[near.length - 1];

    var upstream = [];
    var upSamples = 16;
    for (var u = 0; u <= upSamples; u++) {
      var ux = 20 + (entry.x - 20) * (u / upSamples);
      var frac = easeInOut(u / upSamples);
      var uy = lane.y0 + (entry.y - lane.y0) * frac;
      upstream.push({ x: ux, y: uy });
    }

    var downstream = [];
    var downSamples = 34;
    var wakeEndX = VW - 20;
    var blendDist = 80;
    var closeness = 1 - Math.min(1, (lane.standoff - 10) / 40);
    // downwash grows with the same effective lift-producing angle (AoA + camber contribution)
    // used for C_L -- more camber visibly bends the flow down more, same driver as the number.
    var downwashRate = 0.9 * closeness * effectiveAngleRad;
    for (var d = 0; d <= downSamples; d++) {
      var dx = exit.x + (wakeEndX - exit.x) * (d / downSamples);
      var travelled = dx - exit.x;
      var blended = Math.min(1, travelled / blendDist);
      var dy = exit.y + downwashRate * blendDist * easeInOut(blended) + downwashRate * Math.max(0, travelled - blendDist);
      downstream.push({ x: dx, y: dy });
    }

    return upstream.concat(near, downstream);
  }

  function drawArrowhead(points, idx){
    if (idx < 1 || idx >= points.length) return;
    var p0 = points[idx - 1], p1 = points[idx];
    var angle = Math.atan2(p1.y - p0.y, p1.x - p0.x);
    var size = 6;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p1.x - size * Math.cos(angle - 0.4), p1.y - size * Math.sin(angle - 0.4));
    ctx.lineTo(p1.x - size * Math.cos(angle + 0.4), p1.y - size * Math.sin(angle + 0.4));
    ctx.closePath();
    ctx.fill();
  }

  function render(t){
    var camberPct = parseFloat(camberSlider.value); // 0..9, i.e. m = 0..0.09
    var thicknessPct = parseFloat(thicknessSlider.value); // 6..18, i.e. t = 0.06..0.18
    var m = camberPct / 100;
    var thick = thicknessPct / 100;
    var aRad = AOA_FIXED_DEG * Math.PI / 180;
    var effectiveAngleRad = aRad + K_CAMBER * m;
    var cl = 2 * Math.PI * effectiveAngleRad;

    var colors = readColors();
    ctx.clearRect(0, 0, VW, VH);
    ctx.fillStyle = colors.surface2;
    ctx.fillRect(0, 0, VW, VH);

    ctx.strokeStyle = colors.line;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(20, pivotY);
    ctx.lineTo(VW - 20, pivotY);
    ctx.stroke();
    ctx.setLineDash([]);

    LANES.forEach(function(lane){
      var pts = buildStreamline(lane, m, thick, effectiveAngleRad, aRad, t);
      ctx.strokeStyle = colors.teal;
      ctx.globalAlpha = 0.8;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();
      ctx.fillStyle = ctx.strokeStyle;
      drawArrowhead(pts, Math.floor(pts.length * 0.3));
      drawArrowhead(pts, Math.floor(pts.length * 0.65));
      drawArrowhead(pts, Math.floor(pts.length * 0.88));
      ctx.globalAlpha = 1;
    });

    var outline = airfoilOutline(m, thick, aRad);
    ctx.beginPath();
    ctx.moveTo(outline[0].x, outline[0].y);
    for (var k = 1; k < outline.length; k++) ctx.lineTo(outline[k].x, outline[k].y);
    ctx.closePath();
    ctx.fillStyle = colors.inkFaint;
    ctx.fill();
    ctx.strokeStyle = colors.ink;
    ctx.lineWidth = 1.8;
    ctx.stroke();

    if (camberValue) camberValue.textContent = camberPct.toFixed(1);
    if (thicknessValue) thicknessValue.textContent = thicknessPct.toFixed(0);
    if (clValue) clValue.textContent = cl.toFixed(2);
    canvas.dataset.camberM = m.toFixed(4);
    canvas.dataset.thicknessT = thick.toFixed(4);
    canvas.dataset.cl = cl.toFixed(4);
  }

  function loop(now){
    if (startTime === null) startTime = now;
    var t = (now - startTime) / 1000;
    render(t);
    rafId = requestAnimationFrame(loop);
  }

  function ensureMotionState(){
    if (hasInteracted && !reducedMotion()) {
      render(0.4);
      if (rafId === null) { startTime = null; rafId = requestAnimationFrame(loop); }
    } else {
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
      render(0.4);
    }
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
    ensureMotionState();
  }

  [camberSlider, thicknessSlider].forEach(function(el){
    el.addEventListener('input', function(){
      hasInteracted = true;
      ensureMotionState();
    });
  });

  window.addEventListener('resize', resizeCanvas);
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ensureMotionState);
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', ensureMotionState);
  }

  resizeCanvas();
})();
