import tuanjie from 'libtuanjie.so'

export class SyncCallHelper {
  #userData: number;

  constructor(userData: number) {
    this.#userData = userData;
  }

  resolve(result): void {
    tuanjie.nativeJSSyncCallResult(this.#userData, result);
  }
}