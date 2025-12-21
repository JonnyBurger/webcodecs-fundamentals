---
title: What are Codecs?
description: Beyond the spec - understanding the WebCodecs API and its place in web video engineering
---





The actual interfaces themselves look deceptively simple.


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
const decoder = new VideoDecoder({
    output(frame: VideoFrame) {
         // Do something with the raw video frame
    },
    error(e) {
        // Report an error
    }
});
```

To actually decode video, you would call the `decode` method, passing your encoded video data in the form of (`EncodedVideoChunk`) objects, and the decoder would start returning `VideoFrame` objects in the output handler you defined earlier.

```typescript
decoder.decode(<EncodedVideoChunk> encodedVideoData);

```



