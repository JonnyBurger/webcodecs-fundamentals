---
title: What is WebCodecs?
description: Beyond the spec - understanding the WebCodecs API and its place in web video engineering
---

WebCodecs is a browser API that enables low level control over video encoding and decoding of video files and streams on the client, allowing frontend application developers to manipulate video in the browser on a per-frame basis.
 

At it's most fundamental level, the WebCodecs API can boil down to two interfaces that the browser exposes: [VideoDecoder](https://developer.mozilla.org/en-US/docs/Web/API/VideoDecoder) and [VideoEncoder](https://developer.mozilla.org/en-US/docs/Web/API/VideoEncoder), which you can use to decode and encode video respectively, as well as two "Data types":  [EncodedVideoChunk](https://developer.mozilla.org/en-US/docs/Web/API/EncodedVideoChunk) and [VideoFrame](https://developer.mozilla.org/en-US/docs/Web/API/VideoFrame), which represent encoded vs raw video data respectively. We'll get to audio later.


The core API for WebCodecs looks deceptively simple:


![](/src/assets/content/basics/what-is-webcodecs/simplified.svg)

Where the decoder and encoder are just processors that transform `EncodedVideoChunk` objects into `VideoFrame` objects and vice versa.

##### Decoder

To decode video you would use a `VideoDecoder` object, which just requires two proprties:  an ouput handler (a callback that returns a `VideoFrame` when it is decoded) and an error handler.

```typescript
const decoder = new VideoDecoder({
    output(frame: VideoFrame) {
         // Do something with the raw video frame
    },
    error(e) {/* Report an error */}
});
```

We need to first configure the decoder
```typescript
decoder.configre(/* Decoder config, will cover later */)
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
    error(e) {/* Report an error */}
});
```
Again we need to configure the encoder
```typescript
encoder.configure(/* Encoding settings*/)
```

To actually encode video, you would call the `encode` method, passing your raw `VideoFrame` objects, and the encoder would start returning `EncodedvideoChunk` objects in the output handler you defined earlier.

```typescript
encoder.encode(<VideoFrame> rawVideoFrame);

```


##### There's a lot more to it

That looks simple enough, but there's quite bit more to it. Just a few of the biggest items:

* Getting `EncodingVideoChunk` objects from an actual video file is a whole other thing called demuxing, and WebCodecs doesn't help with that
* `VideoFrame` objects have a large memory footprint, and if you don't mange them properly, it may crash the browser.
* The same encoding settings may not work on different devices or different browsers
* Decoders and Encoders can fail, and you need to manage their state and lifecycle

So while a hello-world tutorial for WebCodecs can fit in less than 30 lines of code, building a production-level WebCodecs requires a lot more code, a lot more process management and a lot more edge case and error handling.

<!--

```typescript



function transcodeVideo(file: File){

    return new Promise(async function(resolve){

            const source_chunks = getChunks(file);
            const dest_chunks = [];

            const encoder = new VideoEncoder({
                output(chunk: EncodedVideoChunk) {
                    dest_chunks.push(chunk);

                    if(dest_chunks.length === source_chunks.length){
                        resolve(new Blob(dest_chunks), {'type': 'video/mp4'})
                    }
                },
                error(e) {}
            });

            encoder.configure(/*encoding Settings */)

            const decoder = new VideoDecoder({
                output(frame: VideoFrame) {
                    encoder.encode(frame)
                },
                error(e) {}
            });


            const decoderConfig = getDecoderConfig(file)
            decoder.configure(decoderConfig);


            for (const chunk of source_chunks){
                deocder.decode(source_chunks)
            }

    })

}




```
Again we need to configure the encoder
```typescript
encoder.configure(/* Encoding settings*/)
```

-->

