/*
  DONUT
  A spinning 3D donut drawn with text characters, in the spirit of
  Andy Sloane's famous donut.c. No 3D library: just trigonometry.

  How it works, per frame:
  1. Walk around the donut's surface point by point.
  2. Rotate each point in 3D, then project it onto the 2D screen.
  3. Work out how much light hits that point (a dot product).
  4. Brighter points get "denser" characters:  . , - ~ : ; = ! * # $ @
  A depth buffer keeps only the point closest to the viewer per cell.
*/
window.Donut = (function () {
  "use strict";

  const CHARS = ".,-~:;=!*#$@";
  const R1 = 1;   // radius of the tube
  const R2 = 2;   // distance from the centre to the tube
  const K2 = 5;   // distance from the viewer

  function start(canvas) {
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cols = 0, rows = 0, cellW = 0, cellH = 0, dpr = 1;
    let A = 0.9, B = 0.4;            // current rotation angles
    let vA = 0.012, vB = 0.006;      // spin speed
    const baseA = 0.012, baseB = 0.006;
    let colors = readColors();
    let visible = true;
    let running = false;

    function readColors() {
      const s = getComputedStyle(document.documentElement);
      return {
        ink: s.getPropertyValue("--ink").trim() || "#16140f",
        muted: s.getPropertyValue("--muted").trim() || "#6b6559",
        accent: s.getPropertyValue("--accent").trim() || "#e0461b",
      };
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      cols = rect.width < 420 ? 44 : 60;
      cellW = canvas.width / cols;
      cellH = cellW * 1.85;
      rows = Math.floor(canvas.height / cellH);
      ctx.font = `500 ${cellW * 1.55}px "Geist Mono", ui-monospace, monospace`;
      ctx.textBaseline = "top";
      ctx.textAlign = "center";
      draw();
    }

    function draw() {
      const size = cols * rows;
      const out = new Array(size).fill(-1);
      const zbuf = new Float32Array(size);
      const cosA = Math.cos(A), sinA = Math.sin(A);
      const cosB = Math.cos(B), sinB = Math.sin(B);
      const K1 = (cols * K2 * 2.3) / (8 * (R1 + R2));
      const aspect = cellW / cellH;

      for (let theta = 0; theta < 6.283; theta += 0.07) {
        const ct = Math.cos(theta), st = Math.sin(theta);
        for (let phi = 0; phi < 6.283; phi += 0.02) {
          const cp = Math.cos(phi), sp = Math.sin(phi);
          const cx = R2 + R1 * ct;
          const cy = R1 * st;

          const x = cx * (cosB * cp + sinA * sinB * sp) - cy * cosA * sinB;
          const y = cx * (sinB * cp - sinA * cosB * sp) + cy * cosA * cosB;
          const z = K2 + cosA * cx * sp + cy * sinA;
          const ooz = 1 / z;

          const xp = Math.floor(cols / 2 + K1 * ooz * x);
          const yp = Math.floor(rows / 2 - K1 * ooz * y * aspect);
          if (xp < 0 || xp >= cols || yp < 0 || yp >= rows) continue;

          const L = cp * ct * sinB - cosA * ct * sp - sinA * st + cosB * (cosA * st - ct * sinA * sp);
          const idx = xp + yp * cols;
          if (L > 0 && ooz > zbuf[idx]) {
            zbuf[idx] = ooz;
            out[idx] = Math.min(CHARS.length - 1, Math.floor(L * 8));
          }
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const offsetY = (canvas.height - rows * cellH) / 2;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const level = out[i + j * cols];
          if (level < 0) continue;
          ctx.fillStyle = level >= 9 ? colors.accent : level >= 3 ? colors.ink : colors.muted;
          ctx.fillText(CHARS[level], i * cellW + cellW / 2, offsetY + j * cellH);
        }
      }
    }

    function frame() {
      if (!visible || document.hidden) { running = false; return; }
      A += vA;
      B += vB;
      // After a drag, ease the speed back to the gentle default.
      vA += (baseA - vA) * 0.03;
      vB += (baseB - vB) * 0.03;
      draw();
      requestAnimationFrame(frame);
    }

    function play() {
      if (reduceMotion || running) return;
      running = true;
      requestAnimationFrame(frame);
    }

    /* Drag to spin (mouse, pen or finger) */
    let dragging = false, lastX = 0, lastY = 0;
    canvas.addEventListener("pointerdown", (e) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      B += dx * 0.01;
      A += dy * 0.01;
      vB = dx * 0.004;
      vA = dy * 0.004;
      if (reduceMotion) draw();
    });
    const endDrag = () => { dragging = false; };
    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);

    /* Only animate while on screen and while the tab is open (saves battery). */
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) play();
    }).observe(canvas);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) play(); });

    /* Re-read colours when the theme changes. */
    const refresh = () => { colors = readColors(); draw(); };
    new MutationObserver(refresh).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", refresh);

    window.addEventListener("resize", resize);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(resize);
    resize();
    play();
  }

  return { start };
})();
