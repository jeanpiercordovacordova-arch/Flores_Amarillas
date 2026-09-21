import './style.css';

const audio = document.querySelector('#backgroundMusic');
const playPause = document.querySelector('#playPause');
const mute = document.querySelector('#mute');
const enter = document.querySelector('#enterButton');
const replay = document.querySelector('#replayButton');
const welcomeScreen = document.querySelector('#welcomeScreen');
const welcomeForm = document.querySelector('#welcomeForm');
const nameInput = document.querySelector('#nameInput');
const wordInput = document.querySelector('#wordInput');
const formMessage = document.querySelector('#formMessage');
const personalGreeting = document.querySelector('#personalGreeting');
const specialWord = document.querySelector('#specialWord');

function updatePlayButton() {
  const playing = !audio.paused;
  playPause.textContent = playing ? 'Ⅱ' : '▶';
  playPause.setAttribute('aria-label', playing ? 'Pausar música' : 'Reproducir música');
}

async function startMusic() {
  try {
    await audio.play();
  } catch (_) {
    // The user can retry from the visible play control if their browser denies audio.
  } finally {
    updatePlayButton();
  }
}

function activateExperience() {
  document.body.classList.add('revealed');
  startMusic();
  document.querySelector('#ramo').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showPersonalisation(name, word) {
  personalGreeting.textContent = `Para Cintia `;
  const heart = document.createElement('em');
  heart.textContent = '♡';
  personalGreeting.append(heart);
  specialWord.querySelector('strong').textContent = word.toLocaleUpperCase('es');
}

function validateForm() {
  const name = nameInput.value.trim();
  const word = wordInput.value.trim();
  if (!name) { formMessage.textContent = 'Escribe tu nombre para continuar ♡'; nameInput.focus(); return null; }
  if (!word) { formMessage.textContent = 'Comparte una palabra bonita sobre ti ♡'; wordInput.focus(); return null; }
  if (/\s/.test(word)) { formMessage.textContent = 'Solo una palabra para describirte ♡'; wordInput.focus(); return null; }
  return { name, word };
}

welcomeForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const values = validateForm();
  if (!values) return;
  // This runs directly from the user's "Continuar" interaction, which is required by Safari/iOS.
  await startMusic();
  localStorage.setItem('flores.nombre', values.name);
  localStorage.setItem('flores.palabra', values.word);
  showPersonalisation(values.name, values.word);
  welcomeScreen.classList.add('is-leaving');
  document.body.classList.add('experience-ready');
  startMusic();
  setTimeout(() => { welcomeScreen.hidden = true; document.querySelector('#ramo').scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 520);
});

wordInput.addEventListener('input', () => { formMessage.textContent = ''; });
nameInput.addEventListener('input', () => { formMessage.textContent = ''; });
const savedName = localStorage.getItem('flores.nombre');
const savedWord = localStorage.getItem('flores.palabra');
if (savedName) nameInput.value = savedName;
if (savedWord) wordInput.value = savedWord;
const wordObserver = new IntersectionObserver((entries) => {
  if (entries.some(entry => entry.isIntersecting)) specialWord.classList.add('is-visible');
}, { threshold: .45 });
wordObserver.observe(document.querySelector('#dedicatoria'));

playPause.addEventListener('click', async () => {
  if (audio.paused) await startMusic(); else audio.pause();
  updatePlayButton();
});

mute.addEventListener('click', () => {
  audio.muted = !audio.muted;
  mute.textContent = audio.muted ? '◖×' : '◖))';
  mute.setAttribute('aria-label', audio.muted ? 'Activar sonido' : 'Silenciar música');
});

enter.addEventListener('click', activateExperience);
replay.addEventListener('click', () => {
  document.querySelector('.hero-art').classList.remove('burst');
  requestAnimationFrame(() => document.querySelector('.hero-art').classList.add('burst'));
});

audio.addEventListener('play', updatePlayButton);
audio.addEventListener('pause', updatePlayButton);
