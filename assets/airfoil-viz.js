(function(){
  var canvas = document.getElementById('airfoil-canvas');
  if (!canvas) return;
  var slider = document.getElementById('aoa-slider');
  var valueEl = document.getElementById('aoa-value');
  var stallBadge = document.getElementById('airfoil-stall-badge');
  var ctx = canvas.getContext('2d');

  var VW = 800, VH = 420; // virtual/logical drawing space
  var chordPx = 260;
  var pivotX = 300, pivotY = 220; // quarter-chord pivot point
  var CRITICAL_AOA = 16; // degrees; matches the "typically 15-18 deg" range added to the page text
  var SEP_FORWARD_RATE = 0.05; // how fast (in xc per extra degree) the separation point marches toward the LE
  var MIN_SEP_XC = 0.22;

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
      inkMuted: v('--ink-muted', '#555'),
      inkFaint: v('--ink-faint', '#888'),
      teal: v('--teal', '#0a7'),
      accent: v('--accent', '#c40'),
      warn: v('--warn', '#a70')
    };
  }

  // ---------- airfoil geometry (simplified NACA-4-digit-style camber + thickness) ----------
  var CAMBER_M = 0.04, CAMBER_P = 0.4, THICKNESS_T = 0.12;

  function nacaThickness(xc){
    var t = THICKNESS_T;
    return 5 * t * (0.2969 * Math.sqrt(xc) - 0.1260 * xc - 0.3516 * xc * xc + 0.2843 * xc * xc * xc - 0.1015 * xc * xc * xc * xc);
  }
  function nacaCamber(xc){
    var m = CAMBER_M, p = CAMBER_P;
    if (m === 0) return 0;
    if (xc < p) return (m / (p * p)) * (2 * p * xc - xc * xc);
    return (m / ((1 - p) * (1 - p))) * ((1 - 2 * p) + 2 * p * xc - xc * xc);
  }
  // local coords: y-down-positive (canvas convention). Camber bulges "up" on screen -> negative local y.
  function localUpper(xc){
    return -(nacaCamber(xc) + nacaThickness(xc)) * chordPx;
  }
  function localLower(xc){
    return -(nacaCamber(xc) - nacaThickness(xc)) * chordPx;
  }
  function localX(xc){
    return (xc - 0.25) * chordPx; // pivot at quarter chord
  }

  function rotate(lx, ly, aRad){
    return {
      x: pivotX + (lx * Math.cos(aRad) - ly * Math.sin(aRad)),
      y: pivotY + (lx * Math.sin(aRad) + ly * Math.cos(aRad))
    };
  }

  function airfoilOutline(aRad){
    var pts = [];
    var n = 40;
    for (var i = 0; i <= n; i++) {
      var xc = i / n;
      pts.push(rotate(localX(xc), localUpper(xc), aRad));
    }
    for (var j = n; j >= 0; j--) {
      var xc2 = j / n;
      pts.push(rotate(localX(xc2), localLower(xc2), aRad));
    }
    return pts;
  }

  // ---------- streamlines ----------
  // Each lane: side ('u'|'l'), standoff (px, added away from the surface), y0 (far-upstream world y)
  var LANES = [
    { side: 'u', standoff: 10, y0: pivotY - 34 },
    { side: 'u', standoff: 26, y0: pivotY - 64 },
    { side: 'u', standoff: 44, y0: pivotY - 96 },
    { side: 'l', standoff: 10, y0: pivotY + 34 },
    { side: 'l', standoff: 26, y0: pivotY + 64 },
    { side: 'l', standoff: 44, y0: pivotY + 96 }
  ];

  function easeInOut(t){
    return t * t * (3 - 2 * t);
  }

  function separationXc(aoaDeg){
    if (aoaDeg <= CRITICAL_AOA) return 1.05; // no separation; keep just past TE
    var xc = 1.0 - (aoaDeg - CRITICAL_AOA) * SEP_FORWARD_RATE;
    return Math.max(MIN_SEP_XC, xc);
  }

  function buildStreamline(lane, aoaDeg, t){
    var aRad = aoaDeg * Math.PI / 180;
    var sepXc = lane.side === 'u' ? separationXc(aoaDeg) : 1.05;
    var stalled = aoaDeg > CRITICAL_AOA && lane.side === 'u';

    // near-field: sample xc from -0.18 to 1.18
    var near = [];
    var nSamples = 70;
    var xcStart = -0.18, xcEnd = 1.18;
    for (var i = 0; i <= nSamples; i++) {
      var xc = xcStart + (xcEnd - xcStart) * (i / nSamples);
      var xcClamped = Math.max(0, Math.min(1, xc));
      var baseLocalY = (lane.side === 'u' ? localUpper(xcClamped) : localLower(xcClamped));
      var dir = lane.side === 'u' ? -1 : 1; // stand-off moves further away from body
      var ly = baseLocalY + dir * lane.standoff;

      // turbulence past the separation point (upper lanes only, once stalled)
      if (stalled && xc > sepXc) {
        var distPast = xc - sepXc;
        var amp = Math.min(22, distPast * 60 + (aoaDeg - CRITICAL_AOA) * 0.9);
        var wiggle = Math.sin(xc * 26 + t * 3.2 + lane.standoff) * amp
                   + Math.sin(xc * 53 + t * 5.1 + lane.standoff * 1.7) * amp * 0.35;
        ly += wiggle * (dir); // push turbulence outward-biased
      }

      var lx = localX(xcClamped) + (xc < 0 ? xc * chordPx : (xc > 1 ? (xc - 1) * chordPx : 0));
      // extend lx linearly beyond [0,1] using chord scale so the near-field still reads as roughly straight approach/departure
      near.push(rotate(lx, ly, aRad));
    }

    var entry = near[0];
    var exit = near[near.length - 1];

    // far upstream: blend from (20, lane.y0) to entry point
    var upstream = [];
    var upSamples = 18;
    for (var u = 0; u <= upSamples; u++) {
      var ux = 20 + (entry.x - 20) * (u / upSamples);
      var frac = easeInOut(u / upSamples);
      var uy = lane.y0 + (entry.y - lane.y0) * frac;
      upstream.push({ x: ux, y: uy });
    }

    // wake / downstream: blend exit tangent into a downwash slope, then hold that slope
    var downstream = [];
    var downSamples = 40;
    var wakeEndX = VW - 20;
    var blendDist = 90;
    // downwash rate: bends downward (positive y = down on screen). Stronger for lanes closer to the body,
    // stronger with more AoA (more circulation -> more downward deflection of the whole flow field).
    var closeness = 1 - Math.min(1, (lane.standoff - 10) / 40); // 1.0 for innermost lane, ~0.15 for outermost
    var aoaFactor = Math.max(0, aoaDeg + 3) / 20; // small downwash even near zero AoA (cambered airfoil), grows with AoA
    var downwashRate = 0.55 * closeness * aoaFactor;
    if (stalled) downwashRate *= 0.4; // separated flow produces much less orderly downwash right at the wing

    for (var d = 0; d <= downSamples; d++) {
      var dx = exit.x + (wakeEndX - exit.x) * (d / downSamples);
      var travelled = dx - exit.x;
      var blended = Math.min(1, travelled / blendDist);
      var rampY = exit.y + downwashRate * blendDist * easeInOut(blended) + downwashRate * Math.max(0, travelled - blendDist);
      var dy = rampY;
      if (stalled) {
        var amp2 = 14 + (aoaDeg - CRITICAL_AOA) * 0.6;
        dy += Math.sin(dx * 0.09 + t * 3.2 + lane.standoff) * amp2 * Math.min(1, travelled / 60);
      }
      downstream.push({ x: dx, y: dy });
    }

    return upstream.concat(near, downstream);
  }

  // ---------- drawing ----------
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
    var aoaDeg = parseFloat(slider.value);
    var colors = readColors();
    var stalled = aoaDeg > CRITICAL_AOA;

    ctx.clearRect(0, 0, VW, VH);
    ctx.fillStyle = colors.surface2;
    ctx.fillRect(0, 0, VW, VH);

    // faint horizontal reference line (freestream direction)
    ctx.strokeStyle = colors.line;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(20, pivotY);
    ctx.lineTo(VW - 20, pivotY);
    ctx.stroke();
    ctx.setLineDash([]);

    // streamlines
    LANES.forEach(function(lane, laneIdx){
      var pts = buildStreamline(lane, aoaDeg, t);
      var laneStalled = lane.side === 'u' && stalled;
      ctx.strokeStyle = laneStalled ? colors.warn : colors.teal;
      ctx.globalAlpha = laneStalled ? 0.85 : 0.8;
      ctx.lineWidth = laneStalled ? 2 : 1.6;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();

      // direction arrowheads at a couple of fixed points along the line
      ctx.fillStyle = ctx.strokeStyle;
      drawArrowhead(pts, Math.floor(pts.length * 0.28));
      drawArrowhead(pts, Math.floor(pts.length * 0.62));
      if (!laneStalled) drawArrowhead(pts, Math.floor(pts.length * 0.86));
      ctx.globalAlpha = 1;
    });

    // airfoil body
    var aRad = aoaDeg * Math.PI / 180;
    var outline = airfoilOutline(aRad);
    ctx.beginPath();
    ctx.moveTo(outline[0].x, outline[0].y);
    for (var k = 1; k < outline.length; k++) ctx.lineTo(outline[k].x, outline[k].y);
    ctx.closePath();
    ctx.fillStyle = colors.inkFaint;
    ctx.fill();
    ctx.strokeStyle = colors.ink;
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // AoA readout + stall badge
    if (valueEl) valueEl.textContent = aoaDeg.toFixed(1);
    if (stallBadge) {
      stallBadge.hidden = !stalled;
    }
    canvas.dataset.aoa = aoaDeg.toFixed(1);
    canvas.dataset.stalled = stalled ? 'true' : 'false';
    canvas.dataset.separationXc = separationXc(aoaDeg).toFixed(3);
  }

  function loop(now){
    if (startTime === null) startTime = now;
    var t = (now - startTime) / 1000;
    render(t);
    rafId = requestAnimationFrame(loop);
  }

  function ensureMotionState(){
    if (hasInteracted && !reducedMotion()) {
      render(0.4); // immediate feedback; the rAF loop (below) takes over from the next frame
      if (rafId === null) {
        startTime = null;
        rafId = requestAnimationFrame(loop);
      }
    } else {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      render(0.4); // static frame; 0.4 avoids a perfectly symmetric zero-phase wiggle when stalled
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
    // map our virtual VW x VH drawing space onto the (dpr-scaled) backing store
    ctx.setTransform(canvas.width / VW, 0, 0, canvas.height / VH, 0, 0);
    ensureMotionState();
  }

  slider.addEventListener('input', function(){
    hasInteracted = true;
    ensureMotionState();
  });

  window.addEventListener('resize', resizeCanvas);
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(){
      ensureMotionState();
    });
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', ensureMotionState);
  }

  resizeCanvas();
})();
