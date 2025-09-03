const adhkars = [
  "سبحان الله وبحمده",
  "اللهم أنت ربي لا إله إلا أنت خلقتني وأنا عبدك وأنا على عهدك ووعدك ما استطعت",
  "سبحان الله العظيم",
  "أصبحنا وأصبح الملك لله والحمد لله لا إله إلا الله وحده لا شريك له",
  "لا إله إلا الله",
  "اللهم بك أصبحنا وبك أمسينا وبك نحيا وبك نموت وإليك النشور",
  "الحمد لله رب العالمين",
  "اللهم ما أصبح بي من نعمة أو بأحد من خلقك فمنك وحدك لا شريك لك",
  "اللهم صل على محمد",
  "سبحان الله وبحمده عدد خلقه ورضا نفسه وزنة عرشه ومداد كلماته",
  "حسبي الله ونعم الوكيل",
  "اللهم إني أصبحت أشهدك وأشهد حملة عرشك وملائكتك وجميع خلقك أنك أنت الله",
  "لا حول ولا قوة إلا بالله",
  "اللهم إني أعوذ بك من الهم والحزن وأعوذ بك من العجز والكسل وأعوذ بك من غلبة الدين",
  "رب اغفر لي وتب علي",
  "اللهم أنت السلام ومنك السلام تباركت يا ذا الجلال والإكرام",
  "توكلت على الله وحده",
  "أمسينا على فطرة الإسلام وعلى كلمة الإخلاص وعلى دين نبينا محمد صلى الله عليه وسلم",
  "اللهم اغفر لي ولوالدي",
  "اللهم اغفر لي ولوالدي وللمؤمنين يوم يقوم الحساب"
];
let currentAdhkar = '';

let timer = 60;
let timerInterval = null; // set interval result
let gameStarted = false;

let correctChars = 0;
let incorrectChars = 0;
let currentIndex = 0; // index for char that user is typing now
let typedHistory = []; 

const textDisplay = document.getElementById('textDisplay');
const inputField = document.getElementById('inputField');
const timerDisplay = document.getElementById('timer');
const wpmStat = document.getElementById('wpmStat');
const accuracyStat = document.getElementById('accuracyStat');
const charsStat = document.getElementById('charsStat');
const restartBtn = document.getElementById('restartBtn');
const newTextBtn = document.getElementById('newTextBtn');
const resultsModal = document.getElementById('resultsModal');

function init(){
    setNewText();
    inputField.value = '';
    inputField.disabled = false;
    gameStarted = false;
    correctChars = 0;
    incorrectChars = 0;
    currentIndex = 0;
    typedHistory = [];
    timer=60;
    updatedStats();
    updateTimer();
    resultsModal.classList.remove('active');
}

function setNewText(){
    currentAdhkar = adhkars[Math.floor(Math.random() * adhkars.length)];
    console.log(currentAdhkar);
    displayText();
}

function displayText() {
  textDisplay.innerHTML = currentAdhkar
    .split('')
    .map((char, index) => `<span id="char${index}">${char}</span>`)
    .join('');
  highlightCurrentChar();
}

function highlightCurrentChar() {
  const prevChar = document.querySelector('.current');
  if (prevChar) prevChar.classList.remove('current'); // كان مكتوب currnet
  const currentChar = document.getElementById(`char${currentIndex}`);
  if (currentChar) currentChar.classList.add('current');
}

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer--;
    updateTimer();
    if (timer <= 0) endGame();
  }, 1000);
}

function updateTimer(){
    const minutes = Math.floor(timer/60);
    const seconds = timer % 60;
    timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2,'0')}`
}

function calculateWPM() {
  const typedText = inputField.value.trim();

  const typedWords = typedText.length > 0 ? typedText.split(/\s+/) : [];

  const adhkarWords = currentAdhkar.split(/\s+/);

  let correctWords = 0;
  for (let i = 0; i < typedWords.length; i++) {
    if (typedWords[i] === adhkarWords[i]) {
      correctWords++;
    }
  }

  const secondsPassed = 60 - timer;

  return (secondsPassed > 0) ? (correctWords / secondsPassed).toFixed(2) : 0;
}


function calculateAccuracy(){
  const totalChars = correctChars + incorrectChars;
  if (totalChars === 0) return 0; 
  return Math.round((correctChars / totalChars) * 100);
}

function updatedStats(){
    wpmStat.textContent = calculateWPM();
    accuracyStat.textContent = `${calculateAccuracy()}%`
    charsStat.textContent = correctChars
}

function resetCharState(index){
    const charElement = document.getElementById(`char${index}`);
    if(charElement){
        charElement.classList.remove('correct','incorrect');
    }
}

inputField.addEventListener('input', (e) => {
  const inputValue = e.target.value;

  if (!gameStarted && e.inputType !== 'deleteContentBackward') {
    gameStarted = true;
    startTimer();
    textDisplay.classList.add('active');
  }

  const backspace = e.inputType === 'deleteContentBackward';

  if (backspace) {
    if (currentIndex > 0) {
      currentIndex--;
      const wasCorrect = typedHistory[currentIndex];
      if (wasCorrect === true) correctChars--;
      else if (wasCorrect === false) incorrectChars--;
      resetCharState(currentIndex);
      typedHistory.pop();
    }
  } else {
    if (currentIndex < currentAdhkar.length) {
      const expectedChar = currentAdhkar[currentIndex];
      const typedChar = inputValue[inputValue.length - 1];
      const el = document.getElementById(`char${currentIndex}`);

      if (typedChar === expectedChar) {
        el.classList.add('correct');
        typedHistory[currentIndex] = true;
        correctChars++;
      } else {
        el.classList.add('incorrect');
        typedHistory[currentIndex] = false;
        incorrectChars++;
      }
      currentIndex++;
    }
  }

  highlightCurrentChar();
  updatedStats();

  if (currentIndex >= currentAdhkar.length) endGame();
});

inputField.addEventListener('keydown', (e) => {
  if (['ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
    e.preventDefault();
  }
});

textDisplay.addEventListener('mousedown', (e) => e.preventDefault());
textDisplay.addEventListener('copy',e => e.preventDefault());

function endGame(){
    clearInterval(timerInterval);
    inputField.disabled = true;
    textDisplay.classList.remove('active');

    document.getElementById('finalWpm').textContent = calculateWPM();
    document.getElementById('finalAccuracy').textContent = `${calculateAccuracy()}%`;
    document.getElementById('finalChars').textContent = correctChars;
    document.getElementById('finalErrors').textContent= incorrectChars;

    resultsModal.classList.add('active');
}

function restartTest(){
    clearInterval(timerInterval);
    init();
}

restartBtn.addEventListener('click',restartTest);
newTextBtn.addEventListener('click',()=>{
    if(confirm(" هل متاكد انك تريد تغيير الذكر؟ ستخسر تطورك الحالى ")){
        restartTest();
    }
});


init();