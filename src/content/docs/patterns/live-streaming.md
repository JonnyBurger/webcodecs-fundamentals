---
title: Live Streaming with WebCodecs
description: Low-latency encoder pipelines
---

There are many ways to stream video over the internet, and of all the ways to deal with video streaming in the browser (`<video>`, MSE, WebRTC), WebCodecs provides the lowest level control. 

Emerging technologies like [Media Over Quic](../../projects/moq.md) use WebCodecs to provide lower latency and higher scalability than with previous options.

Unlike a transcoding pipeline, where it's pretty clear cut what needs to be done, how you would build a video-streaming application depends entirely on what you are trying to do.

Here are just a few kinds of applications with some form of video streaming:
* An application to watch live sports broadcasts
* Recording software to stream your webcam to multiple social-media live-streaming platforms
* A webinar tool where a few hosts stream content to many attendees

Each would have a different architecture.  To make this manageable, I'll focus on how to:

* Stream video from a browser to a browser (e.g. video conferencing)
* Stream video from a browser to a server (e.g. recording studio)
* Stream video from a server to a browser (e.g. live broadcast)

Because WebCodecs works with binary encoded video data, it's a lot easier to integrate with server media processing libraries like ffmpeg and gstreamer. 
I'll therefore assume you can do whatever prcessing you need based on your application's business logic with server media processing libraries, and I'll stick to how you'd stream video to/from the browser.


## Examples of streaming apps

Unlike building a video player on transcription 





## Recording locally


## Web transport


## Subscribing (Media Over Quic)


## Media Over Quic


## Saving it in the browser
* Basis for local recordings




What is quic:
- Sending over web transport


