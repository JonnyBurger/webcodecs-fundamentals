# Project Context: WebCodecsFundamentals.org

## 1. The Mission
We are building **WebCodecsFundamentals.org**, a canonical educational resource for the WebCodecs API. 

* **The Problem:** Current WebCodecs documentation is fragmented between abstract W3C specs and outdated blog posts (circa 2020). There is no "Production Manual" that covers real-world challenges like memory management, ring buffers, or AV sync.
* **The Solution:** A high-performance documentation site that serves as the "Missing Manual" for modern video engineering on the web.
* **The Strategic Goal:** This site is an **Authority Asset**. It builds domain authority to support our primary tool, [Free.Upscaler.Video](https://free.upscaler.video) (100k MAU). By establishing this site as the industry standard, we secure backlinks from major browser vendors (Chrome/Mozilla) and drive high-intent traffic to our tools.

## 2. Target Audience
1.  **Browser Engineers & Standards Bodies:** (e.g., Thomas Steiner @ Google, Mozilla DevRel). They need a high-quality external resource to link to.
2.  **Senior Frontend Engineers:** Developers building video editors, transcoders, or AI tools who are stuck on complex "gotchas."
3.  **The "Alliance":** Partners in the ecosystem (Remotion, MediaBunny) who need a central knowledge hub to reference.

## 3. Technical Requirements
We need a **Markdown/MDX-based documentation site** that feels "Official" and "High-Performance."

* **Framework:** Use a modern static site generator optimized for documentation (Recommended: **Astro Starlight** or **Nextra**).
* **Styling:** Clean, typography-focused, "read-mode" aesthetic. Similar to `webgpufundamentals.org` or the Vercel docs. Dark mode is mandatory.
* **Code Blocks:** Must support syntax highlighting with line focusing/highlighting capabilities.
* **Performance:** The site itself must be a demo of high performance (100 Lighthouse score).

## 4. Content Strategy & Tone
* **Tone:** Authoritative, "Senior Engineer to Senior Engineer." No fluff.
* **Pedagogical Approach:** "The Pain $\to$ The Cure."
    * *Step 1:* Show the "Vanilla" WebCodecs way (and why it's hard).
    * *Step 2:* Show the "Production" way (using patterns like Ring Buffers and libraries like MediaBunny).

## 5. Site Structure (Sitemap)

### I. Introduction
* **What is WebCodecs?** (Beyond the spec: The death of canvas hacks).
* **Why use it?** (Editors, Transcoders, Live Streaming).
* **The Reality Check:** Why it's harder than it looks (Muxing, Audio, Synchronization).

### II. Core Concepts (The Mental Model)
* **CPU vs. GPU Memory:** `ImageData` vs `VideoFrame`.
* **The Threading Model:** Main Thread vs. Workers (Transferable objects).
* **File Handling:** Streams vs. Buffers vs. FileSystemHandles.

### III. The Design Patterns (The "Missing Manual")
* **The Decoding Loop:**
    * *Vanilla:* Using `MP4Box` manually (The "Hard Way").
    * *Modern:* Using **MediaBunny** for robust demuxing (The "Standard Way").
* **Playback Architecture:**
    * Implementing a **Ring Buffer** to prevent memory crashes.
    * Handling **Backpressure** (Pause decoding when render queue is full).
    * **AV Sync:** The math of aligning `AudioData` with `VideoFrame`.
* **Transcoding:**
    * Managing encoder queues.
    * Determining when a job is truly "finished" (Flushing).
* **Live Streaming:** (Placeholder for future content).

### IV. High-Performance Architecture
* **Zero-Copy Rendering:** Passing `VideoFrame` directly to WebGPU/WebGL.
* **Memory Management:** Explicit resource closing (`frame.close()`) to avoid GPU leaks.
* **Compute:** OffscreenCanvas patterns.

### V. Common Issues (The Debugger)
* Buffer Stalls & Jitter.
* Encoder Timeouts & Keyframe snapping.
* Codec Compatibility Matrix (H.264 vs AV1 vs VP9).

## 6. Implementation Notes for Claude
* **Code Examples:** When generating content, create isolated, copy-pasteable blocks.
* **Pseudocode:** For complex logic (like Ring Buffers), provide high-level pseudocode before the actual implementation.
* **Links:** Ensure the footer or intro includes a "Built by the team at [Free.Upscaler.Video](https://free.upscaler.video)" link.
