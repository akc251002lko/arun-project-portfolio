// Text Passages
const paragraphs = [
  "The quick brown fox jumps over the lazy dog near the river bank while the sun sets behind the hills.",
  "In computer science, algorithms are step-by-step procedures for solving problems. Efficient code is both fast and readable.",
  "Python is known for its simplicity and readability. Developers use it for web development, data analysis, artificial intelligence, and automation.",
  "JavaScript powers the interactive elements of websites. With modern frameworks, developers can build complex user interfaces quickly.",
  "Git and GitHub are essential tools for version control and collaboration. They allow teams to track changes and work together seamlessly.",
  "Termux brings the Linux terminal to Android devices. It transforms a phone into a portable development environment for coding on the go.",
  "Artificial intelligence assistants like ChatGPT help programmers debug code, learn new concepts, and brainstorm creative solutions.",
  "Responsive design ensures websites look great on any screen size. Mobile-first development is crucial in today's digital landscape."
];

// DOM Elements
const startScreen = document.getElementById('start-screen');
const typingArea = document.getElementById('typing-area');
const startBtn = document.getElementById('start-btn');
const codeDisplay = document.getElementById('code-display');
const hiddenInput = document.getElementById('hidden-input');
const codeArea = document.getElementById('code-area');
const timerEl = document.getElementById('timer');
const wpmEl = document.getElementById('wpm');
const accuracyEl = document.getElementById('accuracy');

const resultsModal = document.getElementById('results-modal');
const finalWpmEl = document.getElementById('final-wpm');
const finalAccuracyEl = document.getElementById('final-accuracy');
const finalTimeEl = document.getElementById('final-time');
const totalCharsEl = document.getElementById('total-chars');
const correctCharsEl = document.getElementById('correct-chars');
const incorrectCharsEl = document.getElementById('incorrect-chars');
const totalKeystrokesEl = document.getElementById('total-keystrokes');
const correctWordsEl = document.getElementById('correct-words');
const incorrectWordsEl = document.getElementById('incorrect-words');
const tryAgainBtn = document.getElementById('try-again-btn');

// State
let currentText = '';
let typedText = '';
let startTime = null;
let timerInterval = null;
let timeRemaining = 30;
let finished = false;
let totalKeystrokes = 0;
let correctChars = 0;
let incorrectChars = 0;
let correctWords = 0;
let incorrectWords = 0;

function getRandomParagraph() {
  return paragraphs[Math.floor(Math.random() * paragraphs.length)];
}

function loadTest() {
  currentText = getRandomParagraph();
  typedText = '';
  finished = false;
  timeRemaining = 30;
  hiddenInput.value = '';
  hiddenInput.disabled = false;
  codeArea.classList.remove('finished');
  resultsModal.classList.add('hidden');
  typingArea.classList.remove('hidden');
  startScreen.classList.add('hidden');
  if (timerInterval) clearInterval(timerInterval);
  startTime = null;
  totalKeystrokes = 0;
  correctChars = 0;
  incorrectChars = 0;
  correctWords = 0;
  incorrectWords = 0;
  updateTimer(30);
  updateWpm(0);
  updateAccuracy(100);
  renderText();
  hiddenInput.focus();
}

function renderText() {
  let html = '';
  for (let i = 0; i < currentText.length; i++) {
    const char = currentText[i];
    const typedChar = typedText[i];
    if (typedChar === undefined) html += `<span>${escapeHtml(char)}</span>`;
    else if (typedChar === char) html += `<span class="correct">${escapeHtml(char)}</span>`;
    else html += `<span class="incorrect">${escapeHtml(char)}</span>`;
  }
  if (typedText.length > currentText.length) {
    for (let i = currentText.length; i < typedText.length; i++) {
      html += `<span class="incorrect">${escapeHtml(typedText[i])}</span>`;
    }
  }
  html += `<span class="cursor"></span>`;
  codeDisplay.innerHTML = html;
  const cursor = codeDisplay.querySelector('.cursor');
  if (cursor) cursor.scrollIntoView({ block: 'nearest' });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function updateTimer(seconds) { timerEl.textContent = seconds + 's'; }
function updateWpm(wpm) { wpmEl.textContent = Math.round(wpm); }
function updateAccuracy(percent) { accuracyEl.textContent = Math.round(percent) + '%'; }

function calculateStats() {
  if (!startTime) return { wpm: 0, accuracy: 100, time: 30 };
  const elapsedSeconds = 30 - timeRemaining;
  const minutes = elapsedSeconds / 60;
  const typedLength = typedText.length;
  const words = typedLength / 5;
  const wpm = words / Math.max(minutes, 0.01);
  let correct = 0, incorrect = 0;
  const minLen = Math.min(typedText.length, currentText.length);
  for (let i = 0; i < minLen; i++) {
    if (typedText[i] === currentText[i]) correct++;
    else incorrect++;
  }
  if (typedText.length > currentText.length) incorrect += (typedText.length - currentText.length);
  const totalTypedChars = correct + incorrect;
  const accuracy = totalTypedChars > 0 ? (correct / totalTypedChars) * 100 : 100;
  return { wpm, accuracy, time: elapsedSeconds };
}

function computeDetailedStats() {
  correctChars = 0; incorrectChars = 0;
  const minLen = Math.min(typedText.length, currentText.length);
  for (let i = 0; i < minLen; i++) {
    if (typedText[i] === currentText[i]) correctChars++;
    else incorrectChars++;
  }
  if (typedText.length > currentText.length) incorrectChars += (typedText.length - currentText.length);

  const targetWords = currentText.split(' ');
  const typedWords = typedText.split(' ');
  const typedWordsCompleted = typedText.endsWith(' ') ? typedWords.slice(0, -1) : typedWords.slice(0, -1);
  correctWords = 0; incorrectWords = 0;
  for (let i = 0; i < typedWordsCompleted.length; i++) {
    if (i < targetWords.length && typedWordsCompleted[i] === targetWords[i]) correctWords++;
    else incorrectWords++;
  }
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    timeRemaining--;
    updateTimer(timeRemaining);
    const stats = calculateStats();
    updateWpm(stats.wpm);
    updateAccuracy(stats.accuracy);
    if (timeRemaining <= 0) finishTest();
  }, 1000);
}

function finishTest() {
  if (finished) return;
  finished = true;
  hiddenInput.disabled = true;
  if (timerInterval) clearInterval(timerInterval);
  computeDetailedStats();
  const stats = calculateStats();
  finalWpmEl.textContent = Math.round(stats.wpm);
  finalAccuracyEl.textContent = Math.round(stats.accuracy) + '%';
  finalTimeEl.textContent = Math.round(stats.time) + 's';
  totalCharsEl.textContent = typedText.length;
  correctCharsEl.textContent = correctChars;
  incorrectCharsEl.textContent = incorrectChars;
  totalKeystrokesEl.textContent = totalKeystrokes;
  correctWordsEl.textContent = correctWords;
  incorrectWordsEl.textContent = incorrectWords;
  resultsModal.classList.remove('hidden');
}

// Event Listeners
startBtn.addEventListener('click', loadTest);
codeArea.addEventListener('click', () => hiddenInput.focus());

hiddenInput.addEventListener('input', (e) => {
  if (finished) return;
  const newValue = e.target.value;
  if (newValue.length > typedText.length) totalKeystrokes++;
  typedText = newValue;
  if (!startTime) startTimer();
  renderText();
  const stats = calculateStats();
  updateWpm(stats.wpm);
  updateAccuracy(stats.accuracy);
  if (typedText.length >= currentText.length) finishTest();
});

hiddenInput.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') e.preventDefault();
});

tryAgainBtn.addEventListener('click', () => {
  finished = false;
  if (timerInterval) clearInterval(timerInterval);
  startTime = null;
  typedText = '';
  hiddenInput.value = '';
  hiddenInput.disabled = true;
  totalKeystrokes = 0;
  correctChars = 0;
  incorrectChars = 0;
  correctWords = 0;
  incorrectWords = 0;
  resultsModal.classList.add('hidden');
  typingArea.classList.add('hidden');
  startScreen.classList.remove('hidden');
});
