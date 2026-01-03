---
title: WebAudio Playback
description: How to play audio in the browser with WebAudio
---

WebAudio is a browser API for playing audio in the browser. Just like WebCodecs enables low-level control of video playback compared to the `<video>` element, WebAudio enables low level control of audio playback compared to the `<audio>` element.

WebAudio contains all the components to create a custom audio rendering pipeline, including the audio equivalent of `<VideoFrame>` (source), `<canvas>` (destination) and WebGPU/ (processing).


| Stage | Video Rendering | Audio Rendering |
|-------|-----------------|-----------------|
| **Raw Data** | `VideoFrame` | `AudioBuffer` |
| **Processing Pipeline** | WebGL / WebGPU | Web Audio API nodes |
| **Output Destination** |`<cavas>`| AudioContext.destination (speakers) |



Unlike for video, audio processing is done one API (WebAudio). And while in video, you'd normally think of doing *per-frame* operations in a loop, as in


```javascript
for (const frame of frames){
    render(frame)
}
```

In WebAudio, you need to think of audio processing as a pipeline, with *sources*, *destinations* and *nodes* (intermemediate effects / filters).

![](/src/assets/content/audio/web-audio/pipeline.svg)

Where `GainNode` just multiplies the audio signal by a constant (volume control), which is the simplest filter you can add. Here is what this pipeline actually looks like in code:


```typescript

const ctx = new AudioContext(); //Kind of like audio version of 'canvas context'

const rawFileBinary = <ArrayBuffer> await file.arrayBuffer();
const audioBuffer = <AudioBuffer> await ctc.decodeAudioData(rawFileBinary);

const sourceNode = <AudioNode> ctx.createBufferSource();
const gainNode  = <AudioNode> ctx.createGain();

sourceNode.connect(gainNode);
gainNode.connect(ctx.destination);

sourceNode.start(); //Starts playing audio in your speakers!
```


Because WebAudio provides the only interface to output custom audio to the user's speakers, you'll **need** to use WebAudio for audio/video playback.

In this article we'll explain the main componens of WebAudio, and then provide some working code examples to play audio in the browser and add basic controls like volume, playback speed and start/stop/seek.

That should provide enough background to then build a full video player with webcodecs and webaudio, which we'll cover [here](../../patterns/playback/).

# Concepts

### AudioContext

The work with WebAudio, you need to create an `AudioContext` object, which is like a master interface for WebAudio, and everything you do in WebAudio will require or interact with the `AudioContext`.

```
const ctx = new AudioContext();
```

WebAudio works as a 'graph', where you have a destination, one or more sources, and intermediate processing items called *nodes* that you connect together.

![](/src/assets/content/audio/web-audio/pipeline.svg)


The `AudioContext` is actually an instance of an individual graph, but is also the interface for a bunch of other things like creating nodes and decoding audio.

### Buffers

An `AudioBuffer` is WebAudio's representation of raw audio data. You can create an `AudioBuffer` by using `ctx.decodeAudioData(<ArrayBuffer>)` like so:

```typescript
const rawFileBinary = <ArrayBuffer> await file.arrayBuffer();
const audioBuffer = <AudioBuffer> await ctx.decodeAudioData(rawFileBinary);
```

If that sounds similar to [AudioData](../audio-data) and `AudioDecoder`, it is. Both WebAudio and WebCodecs have a way to decode audio files into raw audio data. But you need `AudioBuffer` to work with WebAudio, and you need WebAudio to play audio back in brower. 

WebAudio also has a much simpler API. You can get raw audio samples from an `AudioBuffer` as so:

```typescript
const leftChannel = <Float32Array> audioBuffer.getChannelData(0);
const rightChannel = <Float32Array> audioBuffer.getChannelData(1);
```

You can also create an `AudioBuffer` from raw audio samples as so:

```typescript
const audioBuffer = <AudioBuffer> await ctx.createAudioBuffer(2, 1000, 44100);
audioBuffer.copyToChannel(leftChannel, 0);
audioBuffer.copyToChannel(rightChannel, 0);
```

 Where you'd first create a new blank `AudioBuffer` from `ctx.createAudioBuffer(numChannels, numSamples, sampleRatate)` and then copy float32 data to it.


### Nodes

WebAudio represents the audio processing pipeline as a graph, where you connect *nodes* together, and there is specifically an `AudioNode` type, as well as many types of nodes.

##### Source Node
To actually play audio, you'll need a source node, specifically an `AudioBufferSourceNode` 

```typescript
const sourceNode = <AudioBufferSourceNode> ctx.createBufferSource();
sourceNode.buffer = audioBuffer;
```



##### Destination Node
You play the source node, you need to connect it to an `AudioDestinationNode`, which is just `ctx.destination`.

```typescript
const destination = <AudioDestinationNode> ctx.destination;
```

You'd connect it as below:

```typescript
sourceNode.connect(ctx.destination);
```


##### Gain Node

I don't want to overcomplicate things, but if you want to build a real audio player, you'll likely need *some* intermediate effects, like volume control or playback speed. Probably the simplest is a `GainNode`  which scales the audio by a constant factor (the gain).

You'd create a gain node by doing the following:
```typescript
const gainNode  = <AudioNode> ctx.createGain();
gainNode.gain = 2; // Double the volume

sourceNode.connect(gainNode);
gainNode.connect(ctx.destination);

```

That creates the following pipeline we started with:


![](/src/assets/content/audio/web-audio/pipeline.svg)


### Play/pause

To actually play audio, you'd use

```typescript
sourceNode.start(); //Starts playing audio in your speakers!
```

This source will pass audio through all the effects/nodes you connected in the graph. It will keep playing the source audio until it goes through the entire audio. 

You can detect when the audio finishes with the `onended`callback:

```typescript
sourceNode.onended = () => {
//finish handler
};
```

And you can stop the audio at any time:

```typescript
sourceNode.stop();
```


You can also "seek" by starting the audio at a specific point in the audio (in seconds)

```typescript
sourceNode.start(0, 10); //starts playing immediately, from t=10 in source
```

So if you had a 20 second audio clip, the above would start playing from halfway through the clip.


### Timeline

While WebAudio has an otherwise simple API, managing the playback timeline is where it gets annoyingly difficult.

**Problem**:  
Web Audio lets you connect multiple audio sources.

```typescript
sourceNode1.connect(ctx.destination);
sourceNode2.connect(ctx.destination);
sourceNode1.start();
sourceNode2.start();
```

This will play both audio sources back at the same time.  But each source might have a different duration.  You can also stop one source arbitrarily:

```typescript
sourceNode1.stop();
```

And don't forget that we can seek within sources. 

```typescript
sourceNode2.start(0, 10); 
```

So then, how do measure playback progress? How do you construct a universal timeline when you can arbitrarily add and remove sources mid playback?


**Solution**:  

WebAudio's solution is to measure time from when you create the `AudioContext` using `ctx.currentTime`.

```typescript
const ctx = new AudioContext();
console.log(ctx.currentTime); //0
```

This 'internal clock' will keep ticking even if you don't play anything. It literally just measures how much time (in seconds) has passed since you created it.

```typescript

setTimeout(()=>console.log(ctx.currentTime), 1000); //~1 second
setTimeout(()=>console.log(ctx.currentTime), 5000); //~5 seconds
setTimeout(()=>console.log(ctx.currentTime), 7000); //~7 seconds
```

This creates a consistent, reliable reference point to do timeline calculations.


**Management**

But then it's up to you to do those calculations. Presumably as the application developer, you know and have control over what audio sources you are going to play and when, and how long each audio source is.


So let's say you create an `AudioBuffer` 10 seconds after the `AudioContext` is created. The `AudioBuffer` corresponds to a 15 second clip, and you plan to play just 3 seconds of audio, corresponding to `t=5` to `t=8`  in the source audio file.

![](/src/assets/content/audio/web-audio/timeline.svg)

You're now working with multiple timelines, including (a) the `AudioContext` timeline, (b) the source audio file timeline, and (c) the timeline you want to display to users. It's up to you to keep track of the different timelines, and calculate offsets as necessary.


To illustrate the fictitious scenario, to play the audio properly, you would do

```typescript
sourceNode2.start(10, 5, 3);  
```

Where you start playing the source when `ctx.currentTime==10`, start playing from 5 seconds into the file, and you play for 3 seconds.

Playback progress would be

```
const playBackProgress = (ctx.currentTime - 10)/3;
```


Practically speaking, for playing back a single audio file, you'd keep track of the value of `ctx.currentTime` every time you stop and start the audio, and you'd need to calculate offsets properly, coordinating between the different timelines.

#### Clean up

When everything is done, you can clean up by disconnecting all the nodes

```
sourceNode.disconnect();
```

And you can close the `AudioContext` when you're done to free up resources.

```
ctx.close();
```

# Concrete examples

** Basic Playback**

** Start/stop, timeline**


** Seek **


# Extra functionality

## Gain

## Speed / playback


# 

