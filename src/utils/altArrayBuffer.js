// https://gist.github.com/hanayashiki/8dac237671343e7f0b15de617b0051bd

export function altArrayBuffer() {
    return new Promise((resolve) => {
        let fr = new FileReader();
        fr.onload = () => {
            resolve(fr.result);
        };
        fr.readAsArrayBuffer(this);
    })
}