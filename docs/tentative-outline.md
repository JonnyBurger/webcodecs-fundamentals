

**Intro**

* What is Webcodecs  
  * About the spec

* When might use webcodecs  
  * Video Editing software  
  * Video transcoding  
  * Live Streaming  
  * Custom Playback experiences

* What webcodecs solves  
  * Death of hacks  
  * High performance video operations  
  * Low level control

* Limitations  
  * Complex  
  * Whatever the browser controls  
  * No DRM

**WebCodecs looks simple, but is more complex in practice**

* Core Elements

	

* Decoding

* Encoding

* Looks simple, right?

Why it’s much more complex

* Muxing/Demuxing

* Audio

* Startup times

* Flushing

* Encode / Decode Queue

* Decoders and Encoders can get corrupted

WebGPU

**Core concepts** 

* GPU vs CPU  
  * CPU:  
    * ImageData  
    * 2dCanvasContext  
  * GPU:  
    * VideoFrame  
    * ImageBitmap  
    * WebGL  
    * WebGPU  
    * Bitmaprenderer


* Main thread vs worker  
  * Sending file objects (copy vs handle)  
  * Sending ArrayBuffers, VideoFrames etc…

* File loading  
  * file.arrayBuffer()  
  * File.stream  
  * File Object vs FileSystemFileHandle vs Blob vs Uint8Array

**Design Patterns**

* Playback  
  * bufferIndex: What is the index of the next EncodedVideoChunk to send to the decoder  
  * RenderBuffer: Current Array of rendered VideoFrame objects  
  * render function: Take in a time stamp, fetch the next appropriate video frame (skipping video frames necessary), closing unused video frames  
  * fillRenderBuffer  
  * seek  
  * buffering

* Transcoding  
  * End to end process  
  * Limiting decode queue size  
  * Limiting number of video frame objects in active memory  
  * Limiting EncodeQueue Size  
  * Decoder Index  
  * Encoder Index  
  * Tracking \# of frames processed  
  * When to flush the encoder / decoder  
  * When is the job finished?

* Live streaming  
  * TBD

**MediaBunny**

* Playback  
  * MediaBunny implementation

* Transcoding  
  * MEdiaBunny implementation

* Live streaming  
  * Media  bunny implementation

**Memory Management**

* Video Frames in Memory  
* CPU/GPU Decode

**Compute Management**

* Work in an offscreen thread, especially when encoding

* Don’t use 2d canvas ctx to drawImage  
  * bitmaprender is better  
  * WebGPU is even better

**Common issues**

* Buffer stalls

* Encoding timeouts  
    
* Codec compatibility

* Codec failure

