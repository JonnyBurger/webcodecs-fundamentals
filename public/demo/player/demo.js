// Let's create a simple implementation that shows how to use the player
// CDN import 
import {WebCodecsPlayer} from 'https://unpkg.com/webcodecs-examples@0.1.3/dist/index.js';
// Use import {WebCodecsPlayer} from 'webcodecs-examples' when using npm install

let player = null;

async function getFileWithPermission() {
  try {
    // Request a video file using showOpenFilePicker
    const [fileHandle] = await window.showOpenFilePicker({
      types: [{
        description: 'Video Files',
        accept: {
          'video/*': ['.mp4', '.webm', '.mov']
        }
      }],
      multiple: false
    });

    return await fileHandle.getFile();
  } catch (error) {
    console.error('Error accessing file:', error);
    throw error;
  }
}

function formatTime(seconds) {
  seconds = Math.floor(seconds);
  const minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

async function setupVideoControls(videoPlayer) {
  const playBtn = document.getElementById('playBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const seekBar = document.getElementById('seekBar');
  const currentTimeEl = document.getElementById('currentTime');
  const durationEl = document.getElementById('duration');
  const videoControls = document.getElementById('videoControls');
  const debugPanel = document.getElementById('debugPanel');

  let isDraggingSeekBar = false;
  let videoDuration = videoPlayer.duration || 0;
  let debugUpdateInterval = null;

  // Enable controls
  videoControls.classList.remove('disabled');
  debugPanel.classList.remove('disabled');

  // Set initial duration
  durationEl.textContent = formatTime(videoDuration);

  // Play button
  playBtn.addEventListener('click', async () => {
    console.log('Playing');
    await videoPlayer.play();
  });

  // Pause button
  pauseBtn.addEventListener('click', () => {
    console.log('Pausing');
    videoPlayer.pause();
  });

  // Seek bar input (while dragging)
  seekBar.addEventListener('input', () => {
    isDraggingSeekBar = true;
    const seekTime = (seekBar.value / 100) * videoDuration;
    currentTimeEl.textContent = formatTime(seekTime);
  });

  // Seek bar change (on release)
  seekBar.addEventListener('change', async () => {
    const seekTime = (seekBar.value / 100) * videoDuration;
    await videoPlayer.seek(seekTime);
    isDraggingSeekBar = false;
  });

  // Listen for time updates
  videoPlayer.on('tick', (time) => {
    if (!isDraggingSeekBar) {
      currentTimeEl.textContent = formatTime(time);
      if (videoDuration > 0) {
        seekBar.value = (time / videoDuration) * 100;
      }
    }
  });

  // Update UI based on player state
  videoPlayer.on('play', () => {
    playBtn.disabled = true;
    pauseBtn.disabled = false;
    console.log('Playing - Current time:', videoPlayer.getCurrentTime());
  });

  videoPlayer.on('pause', () => {
    playBtn.disabled = false;
    pauseBtn.disabled = true;
    console.log('Paused at:', videoPlayer.getCurrentTime());
  });

  videoPlayer.on('ended', () => {
    playBtn.disabled = false;
    pauseBtn.disabled = true;
    console.log('Playback ended');
  });

  // Initial state
  pauseBtn.disabled = true;

  console.log('Player initialized at time:', videoPlayer.getCurrentTime());
  console.log('Video duration:', videoPlayer.duration);

  // Update debug info periodically
  async function updateDebugInfo() {
    try {
      const debugInfo = await videoPlayer.getDebugInfo();

      // Audio
      if (debugInfo.trackData && debugInfo.trackData.audio) {
        const audio = debugInfo.trackData.audio;
        document.getElementById('debugAudioCodec').textContent = audio.codec || '--';
        document.getElementById('debugAudioSampleRate').textContent = audio.sampleRate + ' Hz';
        document.getElementById('debugAudioChannels').textContent = audio.numberOfChannels;
        document.getElementById('debugAudioStartTime').textContent = audio.startTime?.toFixed(2) + 's' || '--';
        document.getElementById('debugAudioPauseTime').textContent = audio.pauseTime?.toFixed(2) + 's' || '--';
      }

      // Video
      if (debugInfo.trackData && debugInfo.trackData.video) {
        const video = debugInfo.trackData.video;
        document.getElementById('debugVideoCodec').textContent = video.codec || '--';
        document.getElementById('debugVideoResolution').textContent =
          video.width && video.height ? `${video.width}x${video.height}` : '--';
        document.getElementById('debugVideoFrameRate').textContent =
          video.frameRate ? `${video.frameRate} fps` : '--';

        if (video.activeRenderer) {
          document.getElementById('debugVideoRenderBufferSize').textContent =
            video.activeRenderer.renderBufferSize ?? '--';
          document.getElementById('debugVideoDecodeQueueSize').textContent =
            video.activeRenderer.decodeQueueSize ?? '--';
          document.getElementById('debugVideoLastRenderedTime').textContent =
            video.activeRenderer.lastRenderedTime
              ? (video.activeRenderer.lastRenderedTime / 1000000).toFixed(2) + 's'
              : '--';
        } else {
          document.getElementById('debugVideoRenderBufferSize').textContent = '--';
          document.getElementById('debugVideoDecodeQueueSize').textContent = '--';
          document.getElementById('debugVideoLastRenderedTime').textContent = '--';
        }
      }

      // Clock
      if (debugInfo.clock) {
        document.getElementById('debugClockIsPlaying').textContent =
          debugInfo.clock.isPlaying ? 'Yes' : 'No';
        document.getElementById('debugClockCurrentTime').textContent =
          debugInfo.clock.currentTime.toFixed(2) + 's';
      }
    } catch (error) {
      console.error('Error updating debug info:', error);
    }
  }

  // Update debug info every 500ms
  debugUpdateInterval = setInterval(updateDebugInfo, 500);
  updateDebugInfo(); // Initial update

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (debugUpdateInterval) {
      clearInterval(debugUpdateInterval);
    }
    if (player) {
      player.terminate();
    }
  });
}

async function downloadDemoVideo() {
  const url = 'https://katana-misc-files.s3.us-east-1.amazonaws.com/videos/bbb-fixed.mp4';
  const progressContainer = document.getElementById('progressContainer');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');

  try {
    progressContainer.style.display = 'block';
    progressText.textContent = 'Downloading demo video...';

    const response = await fetch(url);
    if (!response.ok) throw new Error('Download failed');

    const contentLength = response.headers.get('content-length');
    const total = parseInt(contentLength, 10);
    let loaded = 0;

    const reader = response.body.getReader();
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      chunks.push(value);
      loaded += value.length;

      const progress = (loaded / total) * 100;
      progressBar.style.width = progress + '%';
      progressText.textContent = `Downloading: ${Math.round(progress)}% (${(loaded / 1024 / 1024).toFixed(1)} MB / ${(total / 1024 / 1024).toFixed(1)} MB)`;
    }

    // Combine chunks into single ArrayBuffer
    const arrayBuffer = new Uint8Array(loaded);
    let position = 0;
    for (const chunk of chunks) {
      arrayBuffer.set(chunk, position);
      position += chunk.length;
    }

    progressText.textContent = 'Download complete! Creating file...';

    // Convert ArrayBuffer to File
    const blob = new Blob([arrayBuffer], { type: 'video/mp4' });
    const file = new File([blob], 'demo-video.mp4', { type: 'video/mp4' });

    progressContainer.style.display = 'none';
    return file;
  } catch (error) {
    progressContainer.style.display = 'none';
    console.error('Error downloading demo video:', error);
    throw error;
  }
}

async function onFileSelected(file) {
  console.log('File selected:', file.name, file.type, file.size);

  const canvas = document.getElementById('canvas');

  try {
    // Import the WebCodecsPlayer from npm via CDN
    // Once published to npm, this will load from esm.sh


    player = new WebCodecsPlayer({ src: file, canvas });

    console.log('Initializing player...');
    await player.initialize();
    console.log('Player initialized successfully');

    await setupVideoControls(player);
  } catch (error) {
    console.error('Error initializing player:', error);
    alert('Failed to initialize player. Make sure the webcodecs-examples package is built and linked.\n\nError: ' + error.message);
  }
}

// Set up file picker buttons
document.addEventListener('DOMContentLoaded', () => {
  const loadFileBtn = document.getElementById('loadFileBtn');
  const loadDemoBtn = document.getElementById('loadDemoBtn');

  loadFileBtn.addEventListener('click', async () => {
    try {
      const file = await getFileWithPermission();
      await onFileSelected(file);
      loadFileBtn.style.display = 'none';
      loadDemoBtn.style.display = 'none';
    } catch (error) {
      console.error('Failed to load video:', error);
      if (error.name !== 'AbortError') { // User cancelled
        alert('Failed to load video: ' + error.message);
      }
    }
  });

  loadDemoBtn.addEventListener('click', async () => {
    loadFileBtn.disabled = true;
    loadDemoBtn.disabled = true;

    try {
      const file = await downloadDemoVideo();
      await onFileSelected(file);
      loadFileBtn.style.display = 'none';
      loadDemoBtn.style.display = 'none';
    } catch (error) {
      console.error('Failed to load demo video:', error);
      alert('Failed to load demo video: ' + error.message);
      loadFileBtn.disabled = false;
      loadDemoBtn.disabled = false;
    }
  });
});
