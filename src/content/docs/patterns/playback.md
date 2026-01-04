---
title: How to build a Video Player in WebCodecs
description: High level architectural explanation of how to build a video player in WebCodecs
---


![](/src/assets/content/patterns/player/webcodecs-player.png)

In the [Video Decoder](../../basics/decoder) section, we showed how to to build a [video decoding loop](../../basics/decoder#decoding-loop) in WebCodecs.

<details>
<summary>Decode Loop Demo</summary>
<iframe src="/demo/decode-loop/index.html" frameBorder="0" width="720" height="600" style="height:580px" ></iframe>
</details>


In the [WebAudio](../../audio/web-audio) section, we showed how to build an [audio player](../../audio/web-audio#webaudio-audio-player) with WebAudio.

<details>
<summary>Web Audio Player</summary>
<iframe src="/demo/web-audio/playback-speed.html" frameBorder="0" width="720" height="550" style="height: 415px;"></iframe>
</details>


In this guide, we'll go over how to put these two components together to create a working video player in WebCodecs. 


I don't expect anyone to actually use this demo video player as-is in their projects. If you are working with WebCodecs, you presumably have some custom requirements that you can't accomplish with the `<video>` tag. 

Instead, the goal is to explain all the components you'll need, and how to integrate them together into a working video player based on best practices.


The architecture is derived from my battle-tested production apps [1][2].  It's not the only way to build a WebCodecs based video player, but there aren't other good guides on how to do this, and LLMs are phenomenally bad at WebCodecs. 

So consider this a starting point for building a player, and as you get more comfortable with WebCodecs, you can adjust as needed for your own use cases.

The full source code is available [here](https://github.com/sb2702/webcodecs-examples/tree/main/src/player).

## Components of a WebCodecs Player