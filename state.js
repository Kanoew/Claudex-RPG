'use strict';

// État partagé du jeu : éléments de la page, Yarden, monstres de chaque zone, salle courante, minuteries.
// La caméra suit Yarden dans la zone courante sur les petits écrans.
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const joystick = document.getElementById('joystick');
const stick = document.getElementById('stick');
const attackButton = document.getElementById('attack');
const skillButton = document.getElementById('skill');
const dodgeButton = document.getElementById('dodge');
const dodge = { remaining: 0, cooldown: 0, duration: .2, recovery: 1.1, speed: 500, x: 0, y: -1 };
const skill = { cost: 20, cooldown: 0, recovery: 3 };
const status = document.getElementById('status');
const result = document.getElementById('result');
const resultText = document.getElementById('result-text');
const resultDetails = document.getElementById('result-details');
const retryButton = document.getElementById('retry');
const player = { x: 0, y: 240, speed: 180, radius: 13, hp: 5, maxHp: 5, flash: 0, mana: 30, maxMana: 30, armed: false };
const weapon = { x: 0, y: 144 };
let exitOpen = false;
const enemies = zones.donjon.enemies.map(makeEnemy);
// Monstres de chaque zone ; seuls ceux de la zone courante bougent, se dessinent et reçoivent des coups.
const zoneEnemies = Object.fromEntries(Object.entries(zones).map(([id, zone]) => [id, id === 'donjon' ? enemies : zone.enemies.map(makeEnemy)]));
const activeEnemies = () => zoneEnemies[currentZone.id] || [];
const allEnemies = () => Object.values(zoneEnemies).flat();
const boss = enemies[2];
let combatOver = false;
let resultDelay = 0;
let paused = false;
let elapsed = 0;
let stage = 'entry';
let bossDelay = 0;
let zoneFade = 0;
// Faux tant que Yarden n'est pas entrée dans l'Abysse : la vie, le mana et les actions n'apparaissent qu'à partir de là.
let abyssReached = true;
// Niveau de Yarden affiché dans l'interface : 1 au début, 24 après l'Abysse (canon de Jordan).
let playerLevel = 1;
// Monnaie du jeu : des crédits (le chapitre 2 commence à 0).
let credits = 0;
// Le sac à dos : butin ramassé et pas encore vendu ; la faux reste scellée dans la ruelle jusqu'à la première nuit ; tenue d'Ishara (soiree, puis course).
const bag = [];
let scytheFreed = false;
// Chapitre 3 : la dette envers Félix et le nom sur les papiers.
let storyShownAt = 0;
let yardenOutfit = '';
let debt = 0;
let identityName = '';
let isharaOutfit = 'soiree';
// Faux avant l'ouverture de la faille dans la ruelle du chapitre 1.
let riftShown = true;
// Habillages des zones du chapitre 2 (voir render-ch2b.js) : chaque thème fournit floor, solid et tint.
const themeDrawers = {};
// Moment (en secondes) où la faille de la ruelle s'est ouverte : elle grandit depuis ce moment.
let riftOpenedAt = 0;
// Remplis par loadZone() à partir de la zone courante (voir zones.js).
const room = {};
const walls = [];
loadZone('donjon');
const input = { x: 0, y: 0, pointerId: null };
const keys = new Set();
const movementKeys = new Set(['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'z', 'q', 's', 'd', 'w', 'a']);
let width = 0;
let height = 0;
let lastTime = null;
let facing = { x: 0, y: -1 };
const attack = { remaining: 0, cooldown: 0, duration: .22, recovery: .5, range: 72, halfAngle: Math.PI / 3, angle: 0, hits: new Set() };
