// Globale Variablen
let currentAudio = null;
let emotionLock = false;
let isPaused = false;
let currentEmotion = '';
let emotionTimer = null;
const requiredHoldTime = 5000; // 5 Sekunden in Millisekunden
let emotionStartTime = 0; // Zeitpunkt, zu dem die letzte Emotion begonnen wurde


// Audio-Datei-Pools für jede Emotion
const audioPools = {
    happy: [
    'assets/audio/happy/Egal135bpm',
    'assets/audio/happy/September175bpm.mp3',
    'assets/audio/happy/forALongTime160bpm.mp3',
    'assets/audio/happy/n3vb49ß08s2_128bpm.mp3',
    'assets/audio/happy/harpsiwalk120bpmXVeil.mp3',
    ],
    sad: [
    'assets/audio/sad/keinAusweg114bpm.mp3',
    'assets/audio/sad/Time140bpm.mp3',
    'assets/audio/sad/sweets144bpm.mp3',
    'assets/audio/sad/einLetztesMal143bpm.mp3',
    'assets/audio/sad/bagAfterBag130bpm.mp3',
    ],
    fearful: [
    'assets/audio/fearful/Suspense_BPM105.mp3',
    'assets/audio/fearful/Suspense_BPM146.mp3',
    'assets/audio/fearful/Suspense_BPM106.mp3',
    'assets/audio/fearful/drop142bpm.mp3',
    'assets/audio/fearful/nurEinStück132bpm.mp3',
    'assets/audio/fearful/Cinematic_Electro_BPM120.mp3',
    ],
    angry: [
    'assets/audio/angry/Suspense_BPM96.mp3',
    'assets/audio/angry/deathracer_163bpm.mp3',
    'assets/audio/angry/NotYourType_165bpm_A_Major.mp3',
    'assets/audio/angry/Suspense_BPM96.mp3',
    'assets/audio/angry/Suspense__BPM106.mp3',
    'assets/audio/angry/Suspense__BPM146.mp3',
    'assets/audio/angry/I_mNeverComingHome_160bpm.mp3',
    'assets/audio/angry/toxic172bpm.mp3',
    ],
    disgusted: [
    'assets/audio/disgusted/mysterious-celesta-114064.mp3',

    ],
    surprised: [
    'assets/audio/surprised/vivaldi-the-four-seasons-quotsummerquot-presto-rv-315-175720.mp3',
    ],
    // Weitere Emotionen und zugehörige Audiodateien können hier hinzugefügt werden
};
// Funktion zur zufälligen Auswahl und Abspielen einer Audiodatei
function playAudioForEmotion(emotion) {
  if (isPaused || emotion === 'neutral') {
    console.log("Playback paused or neutral expression detected. No action taken.");
    return;
  }

  if (emotionLock) {
    console.log("Emotion lock is active. Please wait.");
    return;
  }

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  const audioFiles = audioPools[emotion];
  if (!audioFiles || audioFiles.length === 0) {
    console.log(`No audio files found for the emotion: ${emotion}`);
    return;
  }

  const selectedAudioFile = audioFiles[Math.floor(Math.random() * audioFiles.length)];
  currentAudio = new Audio(selectedAudioFile);
  currentAudio.play();

  console.log(`Playing audio for ${emotion}: ${selectedAudioFile}`);

  // Emotionssperre setzen
  emotionLock = true;
  updateEmotionStatus(false); // Setze Status auf inaktiv

  // Emotionssperre nach 5 Sekunden aufheben
  setTimeout(() => {
    emotionLock = false;
    if (!isPaused) {
      updateEmotionStatus(true); // Setze Status auf aktiv, wenn nicht pausiert
    }
  }, 5000);
}

// Funktion zur Aktualisierung der Emotionsstatusanzeige
function updateEmotionStatus(active) {
  const statusElement = document.getElementById('emotionStatus');
  const statusText = document.getElementById('emotionStatusText');

  if (active) {
    statusElement.classList.remove('inactive');
    statusText.textContent = 'Emotionserkennung aktiv';
  } else {
    statusElement.classList.add('inactive');
    statusText.textContent = 'Emotionserkennung inaktiv';
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const pauseButton = document.getElementById('pauseButton');
  const resumeButton = document.getElementById('resumeButton');
  const pauseBothButton = document.getElementById('pauseBothButton');

  // Funktion zum Pausieren der Erkennung
  function pauseRecognition() {
    isPaused = true;
    updateEmotionStatus(false);
    console.log("Emotion recognition paused.");
    pauseButton.disabled = true;
    resumeButton.disabled = false;
    pauseBothButton.disabled = false;
  }

  // Funktion zum Pausieren von Musik und Erkennung
  function pauseBoth() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    isPaused = true;
    updateEmotionStatus(false);
    console.log("Music and emotion recognition paused.");
    pauseButton.disabled = true;
    resumeButton.disabled = false;
    pauseBothButton.disabled = true;
  }

  // Funktion zum Fortsetzen der Erkennung
  function resumeRecognition() {
    isPaused = false;
    emotionLock = false;
    updateEmotionStatus(true);
    console.log("Recognition resumed.");
    pauseButton.disabled = false;
    resumeButton.disabled = true;
    pauseBothButton.disabled = false;
  }

  pauseButton.addEventListener('click', pauseRecognition);
  pauseBothButton.addEventListener('click', pauseBoth);
  resumeButton.addEventListener('click', resumeRecognition);

  resumeButton.disabled = true;
  updateEmotionStatus(true);
});