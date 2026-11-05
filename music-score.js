'use strict';

// Partitions et instruments partagés par le jeu et l'aperçu audio.
// Une case = une croche ; huit cases = une mesure. Les motifs varient sur seize mesures.
const musicThemes = {
  titre: { label: 'Le Sang de Tiamat', bpm: 76, roots: [45, 41, 48, 43], chords: [[0, 3, 7, 14], [0, 4, 7, 11], [0, 4, 7, 14], [0, 4, 7, 9]], motif: [12, null, 7, null, 3, 7, null, null, 10, null, 7, 3, null, 2, 0, null], instrument: 'bell', kit: 'soft', cutoff: 3400, air: .25 },
  ruelle: { label: 'La ruelle, la nuit', bpm: 72, roots: [42, 38, 45, 40], chords: [[0, 3, 7, 14], [0, 4, 7, 11], [0, 4, 7, 14], [0, 5, 7, 12]], motif: [7, null, null, 3, null, null, 2, null, 0, null, null, null, 7, null, 14, null], instrument: 'keys', kit: 'soft', cutoff: 1600, air: .28 },
  ville: { label: 'Les rues de Lausanne', bpm: 94, swing: .10, roots: [48, 45, 41, 43], chords: [[0, 4, 7, 14], [0, 3, 7, 10], [0, 4, 7, 11], [0, 5, 7, 14]], motif: [7, null, 12, 14, null, 7, 4, null, 12, null, 7, null, 2, 4, null, 7], instrument: 'keys', kit: 'city', cutoff: 4200, air: .13 },
  appartement: { label: 'Chez Ishara', bpm: 78, swing: .06, roots: [48, 43, 45, 41], chords: [[0, 4, 7, 14], [0, 4, 7, 9], [0, 3, 7, 10], [0, 4, 7, 11]], motif: [4, null, 7, null, 14, null, 12, 7, 4, null, 2, null, 0, null, null, null], instrument: 'keys', kit: 'brush', cutoff: 3200, air: .12 },
  nuit: { label: 'Le parquet, les voix', bpm: 60, roots: [45, 41, 38, 40], chords: [[0, 3, 7, 14], [0, 4, 7, 11], [0, 3, 7, 10], [0, 5, 7, 12]], motif: [12, null, null, null, 7, null, null, null, 3, null, null, null, 2, null, null, null], instrument: 'bell', kit: 'none', cutoff: 2200, air: .30 },
  abysse: { label: 'Cristal noir', bpm: 86, roots: [38, 34, 41, 36], chords: [[0, 3, 7, 14], [0, 4, 7, 11], [0, 3, 7, 10], [0, 5, 7, 12]], motif: [0, null, 7, null, 12, null, 3, null, 7, null, 14, null, 12, 7, null, null], instrument: 'pluck', kit: 'pulse', cutoff: 2600, air: .25 },
  antre: { label: 'L’araignée de cristal', bpm: 92, roots: [38, 39, 34, 33], chords: [[0, 3, 7, 13], [0, 4, 7, 11], [0, 4, 7, 12], [0, 5, 7, 13]], motif: [12, null, null, 13, null, 7, null, null, 0, null, 7, null, 3, null, 1, null], instrument: 'bell', kit: 'tension', cutoff: 3000, air: .32 },
  combat: { label: 'La rupture', bpm: 124, roots: [38, 34, 41, 36], chords: [[0, 3, 7, 12], [0, 4, 7, 12], [0, 3, 7, 10], [0, 5, 7, 12]], motif: [0, 7, 12, null, 7, 3, 7, null, 12, 7, 14, 12, null, 7, 3, 2], instrument: 'pluck', kit: 'combat', cutoff: 4400, air: .12 },
  quatreb: { label: 'Ce qui obéit aux murs', bpm: 66, roots: [45, 46, 41, 40], chords: [[0, 3, 7, 14], [0, 4, 7, 11], [0, 4, 7, 12], [0, 3, 7, 13]], motif: [12, null, 7, null, null, 3, null, null, 14, null, null, 12, 7, null, 1, null], instrument: 'bell', kit: 'clock', cutoff: 2400, air: .30 },
  dossier: { label: 'Une ligne dans un registre', bpm: 80, roots: [40, 36, 37, 35], chords: [[0, 3, 7, 14], [0, 4, 7, 11], [0, 3, 7, 10], [0, 5, 7, 13]], motif: [7, null, null, 7, null, 3, null, null, 7, null, 8, null, 7, null, 2, null], instrument: 'keys', kit: 'tension', cutoff: 2100, air: .20 },
  ouchy: { label: 'Le seizième étage', bpm: 82, swing: .08, roots: [41, 45, 38, 43], chords: [[0, 4, 7, 11], [0, 3, 7, 14], [0, 3, 7, 10], [0, 5, 7, 9]], motif: [11, null, 7, 4, null, null, 14, null, 12, null, 7, null, 4, null, 2, null], instrument: 'keys', kit: 'brush', cutoff: 3700, air: .22 },
  fete: { label: 'La fête derrière les murs', bpm: 118, roots: [45, 41, 48, 43], chords: [[0, 3, 7, 12], [0, 4, 7, 12], [0, 4, 7, 14], [0, 4, 7, 12]], motif: [0, 7, 12, 7, 3, 7, 12, 14, 12, 7, 3, 7, 0, 7, 12, 7], instrument: 'pluck', kit: 'party', cutoff: 1300, air: .08 }
};

const midiHz = note => 440 * Math.pow(2, (note - 69) / 12);

function createMusicBus(context, output, theme, noise) {
  const input = context.createGain(), filter = context.createBiquadFilter();
  const delay = context.createDelay(2), feedback = context.createGain(), wet = context.createGain();
  filter.type = 'lowpass'; filter.frequency.value = theme.cutoff; filter.Q.value = .5;
  delay.delayTime.value = 60 / theme.bpm * .75; feedback.gain.value = .23; wet.gain.value = theme.air;
  input.connect(filter); filter.connect(output); filter.connect(delay);
  delay.connect(feedback); feedback.connect(delay); delay.connect(wet); wet.connect(output);
  return { input, noise, voices: new Set(), nodes: [input, filter, delay, feedback, wet], disposeAt: Infinity };
}

function disposeMusicBus(bus) {
  for (const voice of bus.voices) { try { voice.stop(); } catch (error) { /* Déjà terminée. */ } }
  for (const node of bus.nodes) node.disconnect();
  bus.voices.clear();
}

function musicVoice(context, bus, wave, hz, at, length, volume, attack = .008) {
  const oscillator = context.createOscillator(), envelope = context.createGain();
  oscillator.type = wave; oscillator.frequency.setValueAtTime(hz, at);
  envelope.gain.setValueAtTime(0, at);
  envelope.gain.linearRampToValueAtTime(volume, at + attack);
  envelope.gain.exponentialRampToValueAtTime(.0001, at + Math.max(attack + .02, length));
  oscillator.connect(envelope); envelope.connect(bus.input);
  bus.voices.add(oscillator);
  oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); bus.voices.delete(oscillator); };
  oscillator.start(at); oscillator.stop(at + length + .03);
  return oscillator;
}

function musicNote(context, bus, instrument, note, at, length, volume) {
  const hz = midiHz(note);
  musicVoice(context, bus, instrument === 'pluck' ? 'triangle' : 'sine', hz, at, length, volume);
  // Un harmonique discret donne du corps aux touches et un éclat métallique aux cloches.
  musicVoice(context, bus, 'sine', hz * (instrument === 'bell' ? 2.76 : 2), at, length * .48, volume * .18);
}

function musicDrum(context, bus, kind, at, volume) {
  if (kind === 'kick') {
    const osc = musicVoice(context, bus, 'sine', 120, at, .22, volume);
    osc.frequency.exponentialRampToValueAtTime(42, at + .16);
  } else if (kind === 'rim') {
    musicVoice(context, bus, 'triangle', 430, at, .055, volume * .4);
    musicVoice(context, bus, 'sine', 175, at, .07, volume * .6);
  } else {
    const source = context.createBufferSource(), filter = context.createBiquadFilter(), envelope = context.createGain();
    source.buffer = bus.noise; source.loop = true;
    filter.type = 'highpass'; filter.frequency.value = kind === 'brush' ? 2500 : 6500;
    envelope.gain.setValueAtTime(volume, at); envelope.gain.exponentialRampToValueAtTime(.0001, at + (kind === 'brush' ? .17 : .045));
    source.connect(filter); filter.connect(envelope); envelope.connect(bus.input);
    bus.voices.add(source);
    source.onended = () => { source.disconnect(); filter.disconnect(); envelope.disconnect(); bus.voices.delete(source); };
    source.start(at); source.stop(at + .2);
  }
}

function scheduleMusicStep(context, bus, theme, step, at) {
  const eighth = 30 / theme.bpm, beat = step % 8, bar = Math.floor(step / 8), chordIndex = bar % 4;
  const root = theme.roots[chordIndex], chord = theme.chords[chordIndex];
  const phrase = Math.floor(bar / 4) % 4;
  // A, réponse, respiration, retour : pas une ligne identique répétée à l'infini.
  const note = theme.motif[step % theme.motif.length];
  const swingAt = at + (step % 2 ? (theme.swing || 0) * eighth : 0);
  if (note !== null && !(phrase === 2 && beat > 3)) {
    const octave = phrase === 1 && beat >= 6 ? 12 : 0;
    // La tierce suit l'accord, sans transformer par accident un passage mineur en majeur.
    const interval = [3, 4].includes(note % 12) ? Math.floor(note / 12) * 12 + chord[1] : note;
    musicNote(context, bus, theme.instrument, root + 12 + interval + octave, swingAt, eighth * 2.6, .42 * (beat % 2 ? .78 : 1));
  }
  if (beat === 0) {
    chord.slice(1).forEach((interval, i) => musicVoice(context, bus, 'sine', midiHz(root + 12 + interval), at + i * .035, eighth * 7.8, .13, .35));
    musicVoice(context, bus, 'triangle', midiHz(root), at, eighth * 3.5, .48, .025);
  }
  if (beat === 4 && theme.kit !== 'none') musicVoice(context, bus, 'sine', midiHz(root + (phrase === 3 ? 7 : 0)), at, eighth * 3, .38, .02);
  const kit = theme.kit;
  if (kit === 'none') return;
  if (['party', 'combat', 'city', 'pulse', 'tension', 'soft'].includes(kit) &&
      (beat === 0 || (kit === 'party' && beat % 2 === 0) || (kit === 'combat' && [3, 4, 6].includes(beat)) || (['city', 'pulse'].includes(kit) && beat === 4))) {
    musicDrum(context, bus, 'kick', at, kit === 'soft' ? .20 : .55);
  }
  if (['city', 'party', 'combat'].includes(kit) && [2, 6].includes(beat)) musicDrum(context, bus, 'rim', at, .3);
  if (kit === 'clock' && beat % 2 === 0) musicDrum(context, bus, 'rim', at, .09);
  if (kit === 'brush' && [2, 6].includes(beat)) musicDrum(context, bus, 'brush', swingAt, .16);
  if (['city', 'party', 'combat', 'tension', 'pulse'].includes(kit) && beat % 2 === 1) musicDrum(context, bus, 'hat', swingAt, beat === 7 ? .17 : .10);
  if (bar % 4 === 3 && beat === 7 && ['city', 'combat', 'party'].includes(kit)) musicDrum(context, bus, 'rim', at + eighth * .5, .18);
}
