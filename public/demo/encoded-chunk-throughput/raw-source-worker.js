// Raw source worker: generates VideoFrames without encoding

const width = 320;
const height = 240;
const frameRate = 30;
let frameNumber = 0;
let sourceCanvas;
let sourceCtx;

self.addEventListener('message', (e) => {
  if (e.data.type === 'init') {
    sourceCanvas = e.data.canvas;
    sourceCtx = sourceCanvas.getContext('2d');
  } else if (e.data.type === 'start') {
    startGenerating();
  }
});

function startGenerating() {
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

    // Send raw VideoFrame to main thread
    self.postMessage({
      type: 'frame',
      frame: videoFrame
    }, [videoFrame]);

    frameNumber++;

    if (frameNumber < 300) {
      setTimeout(render, 1000 / frameRate);
    }
  }

  render();
}
