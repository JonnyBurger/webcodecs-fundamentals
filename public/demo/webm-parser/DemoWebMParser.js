// @ts-check

/**
 * @typedef {Object} VideoTrack
 * @property {number} trackNumber
 * @property {string} codecId
 * @property {'video' | 'audio'} type
 * @property {Uint8Array} [description]
 */

/**
 * @typedef {Object} VIntResult
 * @property {number} value
 * @property {number} size
 */

export class DemoWebMParser {
  constructor() {
    this.ebmlDecoder = new EBML.Decoder();
  }

  /**
   * @param {ArrayBuffer} buffer
   * @returns {{ tracks: VideoTrack[], videoTrack: VideoTrack | undefined, chunks: EncodedVideoChunk[] }}
   */
  parse(buffer) {
    const ebmlElements = this.ebmlDecoder.decode(buffer);
    const tracks = this.getTracks(ebmlElements);
    const videoTrack = tracks.find(t => t.type === 'video');
    const chunks = this.getVideoChunks(ebmlElements, videoTrack);

    return { tracks, videoTrack, chunks };
  }

  /**
   * @param {any[]} ebmlElements
   * @returns {VideoTrack[]}
   */
  getTracks(ebmlElements) {
    const tracks = [];

    for (let i = 0; i < ebmlElements.length; i++) {
      const el = ebmlElements[i];

      if (el.name === 'TrackEntry') {
        const track = {};

        for (let j = i + 1; j < ebmlElements.length; j++) {
          const trackEl = ebmlElements[j];

          if (trackEl.name === 'TrackEntry') break;

          if (trackEl.name === 'TrackNumber') {
            track.trackNumber = trackEl.value;
          } else if (trackEl.name === 'CodecID') {
            track.codecId = trackEl.value;
          } else if (trackEl.name === 'TrackType') {
            track.type = trackEl.value === 1 ? 'video' : 'audio';
          } else if (trackEl.name === 'CodecPrivate') {
            track.description = trackEl.data;
          }
        }

        if (track.trackNumber) {
          tracks.push(track);
        }
      }
    }

    return tracks;
  }

  /**
   * @param {any[]} ebmlElements
   * @param {VideoTrack} track
   * @returns {EncodedVideoChunk[]}
   */
  getVideoChunks(ebmlElements, track) {
    const chunks = [];

    for (let i = 0; i < ebmlElements.length; i++) {
      const el = ebmlElements[i];

      if (el.name !== 'Cluster') continue;

      let tsEl;
      let k;

      for (let j = i; j < ebmlElements.length; j++) {
        const elJ = ebmlElements[j];

        if (elJ.name === 'Timestamp') {
          tsEl = elJ;
          k = j;
          break;
        }
      }

      if (tsEl && k) {
        const clusterTimestamp = tsEl.value;

        for (let j = k + 1; j < ebmlElements.length; j++) {
          const elJ = ebmlElements[j];

          if (elJ.name !== 'SimpleBlock') break;

          const data = new Uint8Array(elJ.data);
          let offset = 0;

          const { value: trackNum, size } = this.readVInt(data, offset);
          offset += size;

          const relativeTs = (data[offset] << 8) | data[offset + 1];
          offset += 2;

          const flags = data[offset];
          offset += 1;

          const isKeyframe = (flags & 0x80) !== 0;
          const frameData = data.slice(offset);
          const blockTimestamp = relativeTs + clusterTimestamp;

          if (trackNum === track.trackNumber) {
            const chunk = new EncodedVideoChunk({
              type: isKeyframe ? "key" : "delta",
              timestamp: blockTimestamp * 1e3,
              data: frameData,
              duration: 42 * 1e3
            });

            chunks.push(chunk);
          }
        }
      }
    }

    return chunks;
  }

  /**
   * @param {Uint8Array} data
   * @param {number} offset
   * @returns {VIntResult}
   */
  readVInt(data, offset) {
    const firstByte = data[offset];

    let size = 1;
    let mask = 0x80;
    while (size <= 8 && (firstByte & mask) === 0) {
      size++;
      mask >>= 1;
    }

    let value = firstByte & (mask - 1);

    for (let i = 1; i < size; i++) {
      value = (value << 8) | data[offset + i];
    }

    return { value, size };
  }
}
