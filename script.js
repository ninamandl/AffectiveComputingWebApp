// Audio-Datei-Pools für jede Emotion
    const audioPools = {
      happy: [
        'assets/audio/happy/Egal135bpm.mp3',
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
    

// Globale Variablen
    let currentAudio = null;
    let emotionLock = false;
    let isPaused = false;
    let currentEmotion = '';
    let emotionTimer = 5; // 5 Sekunden Countdown
    let emotionInterval;

    // Funktion zur zufälligen Auswahl und Abspielen einer Audiodatei
      function playAudioForEmotion(emotion) {
        if (isPaused || emotion === 'neutral') {
          console.log("Playback paused or neutral expression detected. No action taken.");
          resetTimer();
          return;
        }

        if (emotionLock) {
          console.log("Emotion lock is active. Please wait.");
          return;
        }

        startTimer(emotion); // Startet den Timer, wenn eine neue Emotion erkannt wird
      }


    // Statusanzeige aktualisieren
      function updateEmotionStatus(active) {
        const statusElement = document.getElementById('emotionStatus');
        const statusText = document.getElementById('emotionStatusText');

        if (active) {
          statusElement.classList.remove('inactive');
          statusText.textContent = 'Emotionserkennung aktiv';
          statusElement.style.backgroundColor = '#dff0d8';
          statusElement.style.color = '#3c763d';
        } else {
          statusElement.classList.add('inactive');
          statusText.textContent = 'Emotionserkennung inaktiv';
          statusElement.style.backgroundColor = '#f2dede';
          statusElement.style.color = '#a94442';
        }
      }

    document.addEventListener('DOMContentLoaded', function () {
      // Buttons
      const pauseButton = document.getElementById('pauseButton');
      const resumeButton = document.getElementById('resumeButton');
      const pauseBothButton = document.getElementById('pauseBothButton');

      // Funktion zum Pausieren der Erkennung
      function pauseRecognition() {
        isPaused = true;
        updateEmotionStatus(false);
        console.log("Emotion recognition paused.");
        // Button-Zustände aktualisieren
        pauseButton.disabled = true;
        resumeButton.disabled = false;
        pauseBothButton.disabled = false;
      }

      // Funktion zum Pausieren von Musik und Erkennung
      function pauseBoth() {
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0; // Audio zurücksetzen
        }
        isPaused = true;
        updateEmotionStatus(false);
        console.log("Music and emotion recognition paused.");
        // Button-Zustände aktualisieren
        pauseButton.disabled = true;
        resumeButton.disabled = false;
        pauseBothButton.disabled = true;
      }

      // Funktion zum Fortsetzen der Erkennung
      function resumeRecognition() {
        isPaused = false;
        // Stelle sicher, dass der emotionLock aufgehoben wird
        emotionLock = false;
        updateEmotionStatus(true); // Setze Status auf aktiv
        console.log("Recognition resumed.");

        // Button-Zustände aktualisieren
        pauseButton.disabled = false;
        resumeButton.disabled = true;
        pauseBothButton.disabled = false;
      }


      // Event-Listener für Buttons
      pauseButton.addEventListener('click', pauseRecognition);
      pauseBothButton.addEventListener('click', pauseBoth);
      resumeButton.addEventListener('click', resumeRecognition);

      // Initialisieren Sie den Resume-Button als deaktiviert
      resumeButton.disabled = true;

      // Initialisierung des Status
      updateEmotionStatus(true);
    });


    function updateEmotionStatus(active) {
      const statusElement = document.getElementById('emotionStatus');
      const statusText = document.getElementById('emotionStatusText');

      if (active) {
        statusElement.classList.remove('inactive');
        statusText.textContent = 'Emotionserkennung aktiv';
        statusElement.style.backgroundColor = '#dff0d8';
        statusElement.style.color = '#3c763d';
      } else {
        statusElement.classList.add('inactive');
        statusText.textContent = 'Emotionserkennung inaktiv';
        statusElement.style.backgroundColor = '#f2dede';
        statusElement.style.color = '#a94442';
      }
    }

  function updateTimer() {
    if (emotionTimer > 0) {
      emotionTimer--;
      updateTimerDisplay(emotionTimer); // Timeranzeige aktualisieren
    } else {
      if (currentEmotion !== 'neutral') { // Überprüfen, ob die aktuelle Emotion nicht neutral ist
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }

        const audioFiles = audioPools[currentEmotion];
        if (!audioFiles || audioFiles.length === 0) {
          console.log(`No audio files found for the emotion: ${currentEmotion}`);
          return;
        }

        const selectedAudioFile = audioFiles[Math.floor(Math.random() * audioFiles.length)];
        currentAudio = new Audio(selectedAudioFile);
        currentAudio.play();
        console.log(`Playing audio for ${currentEmotion}: ${selectedAudioFile}`);
      }
      clearInterval(emotionInterval); // Stoppe den Timer
      resetTimer(); // Setze den Timer zurück
    }
  }
  // Funktion zum Zurücksetzen des Timers
    function resetTimer() {
      emotionTimer = 5; // Timer auf 5 Sekunden zurücksetzen
      updateTimerDisplay(emotionTimer, false); // Timeranzeige zurücksetzen und Farbe auf Grün ändern
    }

// Funktion zum Starten des Timers
    function startTimer(newEmotion) {
      if (currentEmotion !== newEmotion) {
        currentEmotion = newEmotion;
        clearInterval(emotionInterval); // Vorherigen Timer stoppen, falls vorhanden
        resetTimer(); // Timer zurücksetzen
        emotionInterval = setInterval(updateTimer, 1000); // Timer jede Sekunde aktualisieren
      }
    }

// Funktion zum Aktualisieren der Timeranzeige
    function updateTimerDisplay(time, isActive = true) {
      const timerElement = document.getElementById('emotionTimer');
      timerElement.textContent = time.toString();
      // Wenn der Timer bei 0 ist, wechsle die Farbe zu Rot, sonst Grün
      if (time === 0) {
        timerElement.style.backgroundColor = 'green';
      } else {
        timerElement.style.backgroundColor = 'red';
      }
    }

