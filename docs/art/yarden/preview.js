'use strict';

(() => {
  const data = JSON.parse(document.getElementById('animation-data').textContent);
  const select = document.getElementById('animation');
  const pauseButton = document.getElementById('pause');
  const canvas = document.getElementById('sprite');
  const context = canvas.getContext('2d');
  const status = document.getElementById('status');
  const basePath = '../../../assets/yarden/';
  const entries = Object.entries(data.animations).map(([id, animation]) => ({ id, ...animation }));
  entries.push({ id: 'look', label: 'Seize directions du regard', frames: 16, durationsMs: Array(16).fill(180) });
  for (const entry of entries) {
    const option = document.createElement('option');
    option.value = entry.id;
    option.textContent = entry.label;
    select.append(option);
  }
  let entry = entries[0];
  let images = [];
  let frame = 0;
  let elapsed = 0;
  let previous = null;
  let paused = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let generation = 0;

  function refreshPause() {
    pauseButton.textContent = paused ? 'Lire' : 'Pause';
    pauseButton.setAttribute('aria-pressed', String(paused));
  }

  function draw() {
    context.clearRect(0, 0, 96, 104);
    if (!images.length) return;
    const image = images[entry.id === 'look' ? Math.floor(frame / 8) : 0];
    const column = entry.id === 'look' ? frame % 8 : frame;
    context.drawImage(image, column * 96, 0, 96, 104, 0, 0, 96, 104);
  }

  async function load() {
    const token = ++generation;
    entry = entries.find(item => item.id === select.value) || entries[0];
    frame = 0;
    elapsed = 0;
    previous = null;
    images = [];
    draw();
    status.textContent = 'Chargement…';
    const selected = entry;
    const files = selected.id === 'look' ? data.look.rows.map(row => row.file) : [selected.file];
    try {
      const loaded = await Promise.all(files.map(file => new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error(file));
        image.src = basePath + file;
      })));
      if (token !== generation) return;
      images = loaded;
      status.textContent = `${selected.label} · ${selected.frames} images · cases 96 × 104`;
      draw();
    } catch (error) {
      if (token === generation) status.textContent = `Image introuvable : ${error.message}. Conserver toute l’arborescence du dépôt.`;
    }
  }

  function tick(now) {
    const delta = previous === null ? 0 : Math.min(now - previous, 250);
    previous = now;
    if (!paused && images.length && !document.hidden) {
      elapsed += delta;
      while (elapsed >= entry.durationsMs[frame]) {
        elapsed -= entry.durationsMs[frame];
        frame = (frame + 1) % entry.frames;
      }
      draw();
    }
    requestAnimationFrame(tick);
  }

  pauseButton.addEventListener('click', () => { paused = !paused; refreshPause(); });
  select.addEventListener('change', load);
  document.addEventListener('visibilitychange', () => { previous = null; });
  refreshPause();
  load();
  requestAnimationFrame(tick);
})();
