const video = document.getElementById("video");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri(
    "https://raw.githubusercontent.com/willtrinh/face-recognition/master/models/"
  ),
  faceapi.nets.faceLandmark68Net.loadFromUri(
    "https://raw.githubusercontent.com/willtrinh/face-recognition/master/models/"
  ),
  faceapi.nets.faceRecognitionNet.loadFromUri(
    "https://raw.githubusercontent.com/willtrinh/face-recognition/master/models/"
  ),
  faceapi.nets.faceExpressionNet.loadFromUri(
    "https://raw.githubusercontent.com/willtrinh/face-recognition/master/models/"
  ),
]).then(startVideo);

function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: {} })
    .then(stream => {
      video.srcObject = stream;
      // Vorläufige Positionierung des Video-Elements
      /*video.style.position = 'fixed';
      video.style.bottom = '10px';
      video.style.left = '10px';*/
      video.onloadedmetadata = () => {
        adjustVideoAndCanvasSizeAndPosition();
      };
    })
    .catch(err => console.error('Error accessing the webcam', err));
}

function adjustVideoAndCanvasSizeAndPosition() {
  // Anpassen der Größe und Position des Video-Elements
  video.style.position = 'fixed';
  video.style.bottom = '10px';
  video.style.left = '10px';
  video.width = 400; // Breite anpassen
  video.height = video.videoHeight / (video.videoWidth / 400); // Höhe basierend auf dem Seitenverhältnis anpassen

  // Canvas-Element entsprechend anpassen
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  canvas.style.position = 'fixed';
  canvas.style.bottom = '10px';
  canvas.style.left = '10px';
  canvas.width = video.width;
  canvas.height = video.height;

  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  startFaceDetection(canvas, displaySize); // Startet die Gesichtserkennung
}

function startFaceDetection(canvas, displaySize) {
  video.addEventListener("play", () => {
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

      // Erkennung der stärksten Emotion und Abspielen des entsprechenden Audiotracks
      detections.forEach(detection => {
        const emotions = detection.expressions;
        const maxEmotion = Object.keys(emotions).reduce((a, b) => emotions[a] > emotions[b] ? a : b);

        // Aktualisieren Sie das Textfeld mit der aktuellen Emotion
        document.getElementById('currentEmotion').innerText = maxEmotion;
        playAudioForEmotion(maxEmotion);
      });
    }, 100);
  });
}
