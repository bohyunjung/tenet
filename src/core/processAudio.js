export async function processAudio(blob) {
    const context = new AudioContext();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = await context.decodeAudioData(arrayBuffer);

    const numChannels = buffer.numberOfChannels;
    const reversed = context.createBuffer(numChannels, buffer.length, buffer.sampleRate);

    for (let n = 0; n < numChannels; n++) {
        const data = reversed.getChannelData(n);
        data.set(buffer.getChannelData(n));
        data.reverse();
    }

    const source = context.createBufferSource();
    source.buffer = reversed;
    source.connect(context.destination);

    return { context, source };
}