import { altArrayBuffer }  from '../utils/altArrayBuffer'

function _reverseAudio(someBuffer, n) {
    Array.prototype.reverse.call(someBuffer.getChannelData(n));
}

export function processAudio(blob) {
    let context = new (window.AudioContext || window.webkitAudioContext)();
    let source = context.createBufferSource();

    Blob.prototype.arrayBuffer = Blob.prototype.arrayBuffer || altArrayBuffer;
    
    blob.arrayBuffer().then(arrayBuffer => {
        context.decodeAudioData(arrayBuffer, (buffer) => {
            let numChannels = buffer.numberOfChannels;
            let audioToReverse;
            audioToReverse = context.createBuffer(numChannels, buffer.length, buffer.sampleRate);
            for (let n = 0; n < numChannels; n++) {
                audioToReverse.getChannelData(n).set(buffer.getChannelData(n));
                setTimeout(_reverseAudio(audioToReverse, n), 500);
            }
            source.buffer = audioToReverse;
            source.connect(context.destination);
        });
    });

    return source;
}