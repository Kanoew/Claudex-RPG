'use strict';

// Musique procédurale par lieu, avec fichiers de remplacement facultatifs.
// Aucun son avant le premier geste ; musique et effets ont leurs propres réglages.
const audio = { context: null, master: null, music: null, sfx: null, noise: null, duck: null, ducked: false, musicOn: true, effectsOn: true, musicVolume: .6, effectsVolume: .6, tracks: {}, requested: new Set(), loadingTheme: null, trackNode: null, trackSource: null, trackEnvelope: null, trackTheme: null, bus: null, synthTheme: null, retired: [], override: null, theme: null, step: 0, next: 0, timer: null, played: [] };
const musicKey = 'yarden-musique-1', effectsKey = 'yarden-effets-1', musicVolumeKey = 'yarden-volume-musique-1', effectsVolumeKey = 'yarden-volume-effets-1';
const musicFileVersion = 64;

function readSetting(key) {
  const store = storage();
  try { return !store || store.getItem(key) !== '0'; } catch (error) { return true; }
}

function readVolume(key) {
  const store = storage();
  try { const value = store && Number(store.getItem(key)); return value >= 0 && value <= 1 && store.getItem(key) !== null ? value : .6; } catch (error) { return .6; }
}

const musicLabel = () => audio.musicOn ? 'Musique : activée' : 'Musique : coupée';
const effectsLabel = () => audio.effectsOn ? 'Effets : activés' : 'Effets : coupés';

// À appeler au premier geste du joueur (clic, touche, doigt) : crée le moteur sonore.
function unlockAudio() {
  // Sur certains navigateurs Android, l'appui du doigt (pointerdown) ne compte pas comme un geste autorisé : le son reste suspendu.
  // On retente donc à chaque geste (appui, relâchement, clic, touche) tant que le contexte n'est pas en marche.
  if (audio.context) {
    if (audio.context.state === 'suspended' && !document.hidden) audio.context.resume();
    return;
  }
  if (typeof AudioContext === 'undefined') return;
  try {
    const context = new AudioContext();
    const master = context.createGain(), music = context.createGain(), sfx = context.createGain();
    const trackNode = context.createGain(), duck = context.createGain();
    master.gain.value = 1;
    music.gain.value = audio.musicOn ? audio.musicVolume * .12 : 0;
    trackNode.gain.value = audio.musicOn ? audio.musicVolume * .8 : 0;
    sfx.gain.value = audio.effectsVolume * .8;
    music.connect(duck); trackNode.connect(duck); duck.connect(master); sfx.connect(master); master.connect(context.destination);
    const noise = context.createBuffer(1, 4410, 44100), data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    Object.assign(audio, { context, master, music, sfx, trackNode, noise, duck, next: context.currentTime + .1, step: 0 });
    if (context.state === 'suspended') context.resume();
    audio.timer = setInterval(scheduleMusic, 120);
    syncMusic();
    loadMusicFiles();
  } catch (error) {
    audio.context = null;
  }
}

function saveSetting(key, on) {
  const store = storage();
  try { if (store) store.setItem(key, typeof on === 'number' ? String(on) : on ? '1' : '0'); } catch (error) { /* tant pis */ }
}

function applyMusicGain() {
  if (audio.music) audio.music.gain.value = audio.musicOn ? audio.musicVolume * .12 : 0;
  if (audio.trackNode) audio.trackNode.gain.value = audio.musicOn ? audio.musicVolume * .8 : 0;
}

function setMusic(on) {
  audio.musicOn = on;
  applyMusicGain();
  saveSetting(musicKey, on);
}

// Curseurs de volume (0 à 1) : la musique d'un côté, les bruitages de l'autre.
function setMusicVolume(value) {
  audio.musicVolume = Math.max(0, Math.min(1, value));
  applyMusicGain();
  saveSetting(musicVolumeKey, audio.musicVolume);
}

function setEffectsVolume(value) {
  audio.effectsVolume = Math.max(0, Math.min(1, value));
  if (audio.sfx) audio.sfx.gain.value = audio.effectsVolume * .8;
  saveSetting(effectsVolumeKey, audio.effectsVolume);
}

function setEffects(on) {
  audio.effectsOn = on;
  saveSetting(effectsKey, on);
}

function tone(wave, note, start, length, volume, target) {
  const context = audio.context, oscillator = context.createOscillator(), gain = context.createGain();
  oscillator.type = wave;
  oscillator.frequency.setValueAtTime(midiHz(note), start);
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + .01);
  gain.gain.linearRampToValueAtTime(0, start + length);
  oscillator.connect(gain); gain.connect(target);
  oscillator.start(start); oscillator.stop(start + length + .02);
}

function retireSynth() {
  if (!audio.bus) return;
  const now = audio.context.currentTime, bus = audio.bus;
  const level = bus.input.gain.value;
  bus.input.gain.cancelScheduledValues(now);
  bus.input.gain.setValueAtTime(level, now);
  bus.input.gain.linearRampToValueAtTime(0, now + .45);
  bus.disposeAt = now + .7;
  audio.retired.push(bus);
  audio.bus = null; audio.synthTheme = null;
}

function scheduleMusic() {
  const context = audio.context;
  if (!context || context.state !== 'running') return;
  // Les scènes peuvent changer de lieu pendant un dialogue, lorsque le jeu est figé.
  syncMusic();
  audio.retired = audio.retired.filter(bus => {
    if (bus.disposeAt > context.currentTime) return true;
    disposeMusicBus(bus); return false;
  });
  const ducked = story.active;
  if (ducked !== audio.ducked) {
    audio.ducked = ducked;
    audio.duck.gain.setTargetAtTime(ducked ? .72 : 1, context.currentTime, .18);
  }
  if (!audio.musicOn || audio.musicVolume === 0) {
    retireSynth(); stopTrack(); audio.next = context.currentTime + .05; return;
  }
  loadMusicFiles();
  if (audio.tracks[audio.theme]) { retireSynth(); playTrack(); return; }
  stopTrack();
  const theme = musicThemes[audio.theme] || musicThemes.ville;
  if (audio.synthTheme !== audio.theme) {
    retireSynth();
    audio.bus = createMusicBus(context, audio.music, theme, audio.noise);
    audio.bus.input.gain.setValueAtTime(0, context.currentTime);
    audio.bus.input.gain.linearRampToValueAtTime(1, context.currentTime + .4);
    audio.synthTheme = audio.theme;
  }
  // Après une interruption, pas de rattrapage de milliers de notes dans le passé.
  if (audio.next < context.currentTime - .3) audio.next = context.currentTime + .04;
  while (audio.next < context.currentTime + .3) {
    scheduleMusicStep(context, audio.bus, theme, audio.step, audio.next);
    audio.next += 30 / theme.bpm;
    audio.step = (audio.step + 1) % 128;
  }
}

function musicForPlace() {
  if (menu.open && menu.kind === 'title') return 'titre';
  if (audio.override && musicThemes[audio.override]) return audio.override;
  const zone = currentZone.id;
  if (zone === 'antre') return 'antre';
  if ((zone === 'donjon' && boss.active && boss.hp > 0) ||
      (zone === 'square' && ch4.broken && squareCreature().hp > 0)) return 'combat';
  if (['donjon', 'run', 'faille'].includes(zone)) return 'abysse';
  if (zone === 'exterieur') return 'ruelle';
  if (zone === 'appartement') return home.stage === 'nuit' ? 'nuit' : 'appartement';
  if (['cour', 'escalier', 'quatreb'].includes(zone)) return 'quatreb';
  if (['preau', 'square'].includes(zone)) return 'dossier';
  if (['hall', 'penthouse'].includes(zone)) return 'ouchy';
  return 'ville';
}

function syncMusic() {
  const theme = musicForPlace();
  if (theme === audio.theme) return;
  audio.theme = theme;
  audio.step = 0;
  if (audio.context) audio.next = audio.context.currentTime + .05;
}

// Un seul téléchargement à la fois, pour le lieu courant. Deux pistes décodées
// au maximum : les douze musiques longues ne remplissent pas la mémoire du téléphone.
async function loadMusicFiles() {
  const name = audio.theme;
  if (typeof fetch === 'undefined' || !audio.context || !audio.context.decodeAudioData ||
      !musicThemes[name] || audio.loadingTheme || audio.requested.has(name) || audio.tracks[name] || !audio.musicOn) return;
  audio.loadingTheme = name;
  audio.requested.add(name);
  try {
    for (const extension of ['mp3', 'ogg']) {
      try {
        const answer = await fetch(`assets/musique/${name}.${extension}?v=${musicFileVersion}`);
        if (!answer.ok) continue;
        const bytes = await answer.arrayBuffer();
        if (audio.theme !== name) { audio.requested.delete(name); return; }
        const buffer = await audio.context.decodeAudioData(bytes);
        if (audio.theme !== name) { audio.requested.delete(name); return; }
        for (const cached of Object.keys(audio.tracks)) {
          if (cached !== audio.trackTheme) { delete audio.tracks[cached]; audio.requested.delete(cached); }
        }
        audio.tracks[name] = buffer;
        return;
      } catch (error) { /* Fichier absent ou illisible : partition en code. */ }
    }
  } finally { audio.loadingTheme = null; }
}

function stopTrack() {
  if (!audio.trackSource) return;
  const now = audio.context.currentTime;
  const level = audio.trackEnvelope.gain.value;
  audio.trackEnvelope.gain.cancelScheduledValues(now);
  audio.trackEnvelope.gain.setValueAtTime(level, now);
  audio.trackEnvelope.gain.linearRampToValueAtTime(0, now + .45);
  try { audio.trackSource.stop(now + .5); } catch (error) { /* Déjà terminée. */ }
  audio.trackSource = null; audio.trackEnvelope = null; audio.trackTheme = null;
}

function playTrack() {
  if (audio.trackTheme === audio.theme && audio.trackSource) return;
  stopTrack();
  const buffer = audio.tracks[audio.theme];
  if (!buffer) return;
  const source = audio.context.createBufferSource(), envelope = audio.context.createGain();
  source.buffer = buffer; source.loop = true;
  const now = audio.context.currentTime;
  envelope.gain.setValueAtTime(0, now); envelope.gain.linearRampToValueAtTime(1, now + .5);
  source.connect(envelope); envelope.connect(audio.trackNode);
  source.onended = () => { source.disconnect(); envelope.disconnect(); };
  source.start();
  audio.trackSource = source; audio.trackEnvelope = envelope; audio.trackTheme = audio.theme;
}

function playSfx(name) {
  const context = audio.context;
  if (!context || !audio.effectsOn) return;
  audio.played.push(name);
  if (audio.played.length > 20) audio.played.shift();
  const now = context.currentTime;
  if (name === 'slash') {
    // Souffle de lame : bruit filtré qui descend, plus un petit sifflement.
    const source = context.createBufferSource(), filter = context.createBiquadFilter(), gain = context.createGain();
    source.buffer = audio.noise; source.loop = true;
    filter.type = 'bandpass'; filter.Q.value = 1.2;
    filter.frequency.setValueAtTime(3600, now); filter.frequency.exponentialRampToValueAtTime(700, now + .14);
    gain.gain.setValueAtTime(.7, now); gain.gain.linearRampToValueAtTime(0, now + .15);
    source.connect(filter); filter.connect(gain); gain.connect(audio.sfx);
    source.start(now); source.stop(now + .17);
    const whistle = context.createOscillator(), whistleGain = context.createGain();
    whistle.type = 'sawtooth';
    whistle.frequency.setValueAtTime(1100, now); whistle.frequency.exponentialRampToValueAtTime(240, now + .12);
    whistleGain.gain.setValueAtTime(.12, now); whistleGain.gain.linearRampToValueAtTime(0, now + .12);
    whistle.connect(whistleGain); whistleGain.connect(audio.sfx);
    whistle.start(now); whistle.stop(now + .14);
  } else if (name === 'hit' || name === 'hurt') {
    const oscillator = context.createOscillator(), gain = context.createGain();
    oscillator.type = name === 'hit' ? 'square' : 'sawtooth';
    oscillator.frequency.setValueAtTime(name === 'hit' ? 240 : 200, now);
    oscillator.frequency.exponentialRampToValueAtTime(name === 'hit' ? 90 : 55, now + (name === 'hit' ? .09 : .22));
    gain.gain.setValueAtTime(name === 'hit' ? .3 : .35, now); gain.gain.linearRampToValueAtTime(0, now + (name === 'hit' ? .1 : .24));
    oscillator.connect(gain); gain.connect(audio.sfx);
    oscillator.start(now); oscillator.stop(now + .26);
  } else if (name === 'levelup') {
    [72, 76, 79, 84].forEach((note, i) => tone('square', note, now + i * .09, .16, .35, audio.sfx));
  }
}

for (const gesture of ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown']) window.addEventListener(gesture, unlockAudio);
// Les deux premières pistes (écran titre, puis ruelle) sont mises en cache dès l'ouverture, pour qu'elles démarrent sans attente au premier geste.
if (typeof fetch === 'function') setTimeout(() => { for (const name of ['titre', 'ruelle']) fetch(`assets/musique/${name}.mp3?v=${musicFileVersion}`).catch(() => {}); }, 1500);
document.addEventListener('visibilitychange', () => {
  if (!audio.context) return;
  if (document.hidden) audio.context.suspend(); else audio.context.resume();
});
audio.musicOn = readSetting(musicKey);
audio.effectsOn = readSetting(effectsKey);
audio.musicVolume = readVolume(musicVolumeKey);
audio.effectsVolume = readVolume(effectsVolumeKey);
