const video = document.getElementById("video")
const emotionText = document.getElementById("emotion")

async function loadModels() {

  await faceapi.nets.tinyFaceDetector.loadFromUri("models")
  await faceapi.nets.faceExpressionNet.loadFromUri("models")

  console.log("Models loaded")
}

async function startVideo() {

  try {

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true
    })

    video.srcObject = stream

  } catch (err) {
    console.error("Camera error:", err)
  }
}

video.addEventListener("playing", () => {

  console.log("Video playing")

  setInterval(async () => {

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      return
    }

    const detection =
      await faceapi
        .detectSingleFace(
          video,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 320,
            scoreThreshold: 0.5
          })
        )
        .withFaceExpressions()

    if (detection) {

      const expressions = detection.expressions

      const maxEmotion =
        Object.keys(expressions).reduce((a, b) =>
          expressions[a] > expressions[b] ? a : b
        )

      emotionText.innerText =
        "Current Emotion: " + maxEmotion

      console.log(expressions)

    } else {

      emotionText.innerText =
        "Current Emotion: No face detected"

    }

  }, 300)

})

async function init() {

  await loadModels()

  await startVideo()

}

init()