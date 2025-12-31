---
title: VideoEncoder
description: Why WebCodecs is harder than it looks
---


The `VideoEncoder` allows transforming [VideoFrame](./video-frame) objects into [EncodedVideoChunk](./encoded-video-chunk) objects allowing you to write rendered / raw video frames to a compressed/encoded video stream or file.

![](/src/assets/content/basics/encoder/video-encoder.png)


The basic "hello world" API for the decoder works like this:

```typescript
// Just capture the contents of a dummy canvas
const canvas = new OffscreenCanvas(1280, 720);
const encoder = new VideoEncoder({
    output: function(chunk: EncodedVideoChunk, meta: any){
        // Do something with the chunk
    },
    error: function(e: any)=> console.warn(e);
});

const encoder = encoder.configure({
    'codec': 'vp9.00.10.08.00',
     width: 1280,
     height: 720,
     bitrate: 1000000 //1 MBPS,
     framerate: 25
});

let framesSent = 0;
const start = performance.now();

setInterval(function(){
    const currentTimeMicroSeconds = (performance.now() - start)*1e3;
    const frame = new VideoFrame(canvas, {timestamp: currenTimeMicroSeconds });
    encoder.encode(frame, {keyFrame: framesSent%60 ==0}); //Key Frame every 60 frames;
}, 40);  // Capture a frame every 40 ms (25fps)

```

The `VideoEncoder` is the mirror operation to the `VideoDecoder`, but API and usage is a bit different, and like with the `VideoDecoder`, there is a big gap between hello world APIs and production.

In this article we'll focus specifically on the `VideoEnocder` and how to actually manage an encoder in a production pipeline.

[MediaBunny](../media-bunny/intro) abstracts the `VideoDecoder` away, simplifying a lot of the pipeline and process management,  so if you want to use MediaBunny, this section isn't necessary, but might still be helpful to understand how WebCodecs works.




Configuration:
- What codec do you want
- Bitrate calculation
- Resolution of 2



## Encoding is slower


## Finish condition
Encoding timeouts
Flush

## EncodeQueue (keep it less than 30)



## Encoding Loop



* renderFn
* encoderFree
* isFinished
* muxer
* Full demo