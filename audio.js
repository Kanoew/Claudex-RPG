'use strict';

// Son en code, sans fichier : une petite musique de style 8 bits, très discrète, et quelques bruitages (coup de faux, impact,
// dégâts, montée de niveau). Le navigateur n'autorise le son qu'après un geste du joueur : rien ne joue avant le premier appui.
// Deux réglages séparés, « Musique » et « Effets », gardés dans le navigateur et modifiables dans les menus.
const audio = { context: null, master: null, music: null, sfx: null, noise: null, musicOn: true, effectsOn: true, musicVolume: .6, effectsVolume: .6, tracks: {}, trackNode: null, trackSource: null, trackTheme: null, override: null, theme: null, step: 0, next: 0, timer: null, played: [] };
const musicKey = 'yarden-musique-1', effectsKey = 'yarden-effets-1', musicVolumeKey = 'yarden-volume-musique-1', effectsVolumeKey = 'yarden-volume-effets-1';
// Notes MIDI par croche (0 = silence). `abysse` : mineur, lent, tendu ; `ville` : pentatonique douce, plus chaude.
const musicThemes = {
  abysse: {
    seconds: .36, wave: 'square',
    lead: [69, 0, 72, 0, 76, 0, 72, 0, 74, 0, 77, 0, 81, 0, 77, 0, 76, 0, 72, 0, 71, 0, 72, 0, 69, 0, 0, 0, 64, 0, 0, 0],
    bass: [45, 0, 0, 0, 45, 0, 0, 0, 41, 0, 0, 0, 41, 0, 0, 0, 40, 0, 0, 0, 40, 0, 0, 0, 45, 0, 0, 0, 45, 0, 0, 0]
  },
  ville: {
    seconds: .32, wave: 'square',
    lead: [76, 0, 79, 0, 81, 0, 79, 0, 76, 0, 74, 0, 72, 0, 0, 0, 74, 0, 77, 0, 79, 0, 77, 0, 74, 0, 72, 0, 67, 0, 0, 0],
    bass: [48, 0, 0, 0, 55, 0, 0, 0, 53, 0, 0, 0, 55, 0, 0, 0, 50, 0, 0, 0, 57, 0, 0, 0, 55, 0, 0, 0, 48, 0, 0, 0]
  }
};

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
  if (audio.context || typeof AudioContext === 'undefined') return;
  try {
    const context = new AudioContext();
    const master = context.createGain(), music = context.createGain(), sfx = context.createGain();
    const trackNode = context.createGain();
    master.gain.value = 1;
    music.gain.value = audio.musicOn ? audio.musicVolume * .12 : 0;
    trackNode.gain.value = audio.musicOn ? audio.musicVolume * .8 : 0;
    sfx.gain.value = audio.effectsVolume * .8;
    music.connect(master); trackNode.connect(master); sfx.connect(master); master.connect(context.destination);
    const noise = context.createBuffer(1, 4410, 44100), data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    Object.assign(audio, { context, master, music, sfx, trackNode, noise, next: context.currentTime + .1, step: 0 });
    if (context.state === 'suspended') context.resume();
    audio.timer = setInterval(scheduleMusic, 120);
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

// Fête : arpèges rapides sur la, fa, sol, mi, comme une techno 8 bits entendue de loin.
(function buildParty() {
  const roots = [57, 53, 55, 52], lead = [], bass = [];
  for (const root of roots) for (let i = 0; i < 8; i++) { lead.push(root + 12 + [0, 7, 12, 7][i % 4]); bass.push(i % 2 === 0 ? root - 12 : 0); }
  musicThemes.fete = { seconds: .2, wave: 'square', lead, bass };
})();

const midiHz = note => 440 * Math.pow(2, (note - 69) / 12);

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

function scheduleMusic() {
  const context = audio.context, theme = musicThemes[audio.theme] || musicThemes.ville;
  if (!context || !theme || context.state !== 'running') return;
  if (audio.tracks[audio.theme]) { playTrack(); return; }
  stopTrack();
  while (audio.next < context.currentTime + .3) {
    const i = audio.step % theme.lead.length;
    if (theme.lead[i]) tone(theme.wave, theme.lead[i], audio.next, theme.seconds * 1.4, .5, audio.music);
    if (theme.bass[i]) tone('triangle', theme.bass[i], audio.next, theme.seconds * 3, 1, audio.music);
    audio.next += theme.seconds;
    audio.step++;
  }
}

// Musique selon le lieu : l'Abysse (donjon, antre) ou la ville (ruelle, appartement).
function syncMusic() {
  const theme = audio.override || (menu.open && menu.kind === 'title' ? 'titre' : currentZone.id === 'donjon' || currentZone.id === 'antre' ? 'abysse' : 'ville');
  if (theme === audio.theme) return;
  audio.theme = theme;
  audio.step = 0;
  if (audio.context) audio.next = audio.context.currentTime + .1;
}

// Musiques en fichier : assets/musique/titre, ville, abysse et fete (.mp3 ou .ogg), si elles existent ; sinon la musique en code joue.
function loadMusicFiles() {
  if (typeof fetch === 'undefined' || !audio.context || !audio.context.decodeAudioData) return;
  for (const name of ['titre', 'ville', 'abysse', 'fete']) {
    (async () => {
      for (const extension of ['mp3', 'ogg']) {
        try {
          const answer = await fetch(`assets/musique/${name}.${extension}?v=51`);
          if (!answer.ok) continue;
          audio.tracks[name] = await audio.context.decodeAudioData(await answer.arrayBuffer());
          return;
        } catch (error) { /* fichier absent ou illisible : on garde la musique en code */ }
      }
    })();
  }
}

function stopTrack() {
  if (!audio.trackSource) return;
  try { audio.trackSource.stop(); } catch (error) { /* déjà arrêtée */ }
  audio.trackSource = null;
  audio.trackTheme = null;
}

function playTrack() {
  if (audio.trackTheme === audio.theme && audio.trackSource) return;
  stopTrack();
  const buffer = audio.tracks[audio.theme];
  if (!buffer) return;
  const source = audio.context.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  source.connect(audio.trackNode);
  source.start();
  audio.trackSource = source;
  audio.trackTheme = audio.theme;
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

window.addEventListener('pointerdown', unlockAudio);
window.addEventListener('keydown', unlockAudio);
document.addEventListener('visibilitychange', () => {
  if (!audio.context) return;
  if (document.hidden) audio.context.suspend(); else audio.context.resume();
});
audio.musicOn = readSetting(musicKey);
audio.effectsOn = readSetting(effectsKey);
audio.musicVolume = readVolume(musicVolumeKey);
audio.effectsVolume = readVolume(effectsVolumeKey);
