---
title: What is WebCodecs?
description: Beyond the spec - understanding the WebCodecs API and its place in web video engineering
---

WebCodecs is a browser API that enables low level control over video encoding and decoding of video files and streams on the client, allowing frontend application developers to manipulate video in the browser on a per-frame basis.
 

At it's most fundamental level, the WebCodecs API can boil down to two interfaces that the browser exposes: [VideoDecoder](https://developer.mozilla.org/en-US/docs/Web/API/VideoDecoder) and [VideoEncoder](https://developer.mozilla.org/en-US/docs/Web/API/VideoEncoder), which you can use to decode and encode video respectively, as well as two "Data types":  [EncodedVideoChunk](https://developer.mozilla.org/en-US/docs/Web/API/EncodedVideoChunk) and [VideoFrame](https://developer.mozilla.org/en-US/docs/Web/API/VideoFrame), which represent encoded vs raw video data respectively. We'll get to audio later.


### Data Types

Before we get to encoding/decoding, let's quickly look at how the browser understands encoded and decoded video.

##### Video Frame

A [VideoFrame](https://developer.mozilla.org/en-US/docs/Web/API/VideoFrame) object contains both the raw pixel image data, as well as 


### Processors



##### Decoder

To decode video you would use a `VideoDecoder` object, which just requires two proprties:  an ouput handler (a callback that returns a `VideoFrame` when it is decoded) and an error handler.

```typescript
const decoder = new VideoDecoder({
    output(frame: VideoFrame) {
         // Do something with the raw video frame
    },
    error(e) {
        // Report an error
    }
});
```

You need to first configure the decoder:
```typescript
decoder.configure(/* Some meta data we'll get to*/)
```

To actually decode video, you would call the `decode` method, passing your encoded video data in the form of (`EncodedVideoChunk`) objects, and the decoder would start returning `VideoFrame` objects in the output handler you defined earlier.

```typescript
decoder.decode(<EncodedVideoChunk> encodedVideoData);

```



##### Encoder

Encoding Video is very similar, but reverses the process. Whereas a `VideoDecoder` transforms `EncodedVideoChunk` objects to `VideoFrame` objects, a `VideoEncoder` will transform `VideoFrame` objects to `EncodedVideoChunk` objects.

```typescript
const encoder = new VideoEncoder({
    output(chunk: EncodedVideoChunk, metaData?: Object) {
         // Do something with the raw video frame
    },
    error(e) {
        // Report an error
    }
});
```

Again, you'd need to configure your encoder

```typescript
encoder.configure(/* Video Encoding settings*/)
```

To actually encode video, you would call the `encode` method, passing your raw `VideoFrame` objects, and the encoder would start returning `EncodedvideoChunk` objects in the output handler you defined earlier.

```typescript
encoder.encode(<VideoFrame> rawVideoFrame);

```



