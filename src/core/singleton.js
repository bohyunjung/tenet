class TenetSingleton {
  constructor() {
    this._source = null;
    this._mediaRecorder = null;
    this._userMedia = null;
  }

  get source() {
    return this._source;
  }

  set source(value) {
    this._source = value;
  }

  get mediaRecorder() {
    return this._mediaRecorder;
  }

  set mediaRecorder(value) {
    this._mediaRecorder = value;
  }

  get userMeida() {
    return this._userMeida;
  }

  set userMeida(value) {
    this._userMeida = value;
  }
}

export default new TenetSingleton();
