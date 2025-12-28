// Encoder worker: generates frames and encodes them

const width = 320;
const height = 240;
const frameRate = 30;
let frameNumber = 0;
let encoder;
let sourceCanvas;
let sourceCtx;

self.addEventListener('message', (e) => {
  if (e.data.type === 'init') {
    sourceCanvas = e.data.canvas;
    sourceCtx = sourceCanvas.getContext('2d');
  } else if (e.data.type === 'start') {
    startEncoding();
  }
});

function startEncoding() {
  encoder = new VideoEncoder({
    output: (chunk, metadata) => {
      // Send encoded chunk to main thread
      self.postMessage({
        type: 'chunk',
        chunk: chunk
      });
    },
    error: (e) => console.error('Encoder error:', e)
  });

  encoder.configure({
    codec: 'vp09.00.10.08',
    width,
    height,
    bitrate: 500_000,
    framerate: frameRate
  });

  generateFrames();
}

function generateFrames() {
  function render() {
    // Draw frame to source canvas
    sourceCtx.fillStyle = '#000';
    sourceCtx.fillRect(0, 0, width, height);

    sourceCtx.fillStyle = '#fff';
    sourceCtx.font = '24px monospace';
    sourceCtx.fillText(`Frame ${frameNumber}`, 20, height / 2);

    // Create VideoFrame from source canvas
    const videoFrame = new VideoFrame(sourceCanvas, {
      timestamp: frameNumber * (1e6 / frameRate)
    });

    // Encode
    encoder.encode(videoFrame, { keyFrame: frameNumber % 60 === 0 });
    videoFrame.close();

    frameNumber++;

    if (frameNumber < 300) {
      setTimeout(render, 1000 / frameRate);
    } else {
      encoder.flush();
    }
  }

  render();
}
