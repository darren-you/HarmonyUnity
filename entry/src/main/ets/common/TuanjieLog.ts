import hilog from '@ohos.hilog';

export class TuanjieLog {
  private static readonly DOMAIN = 0x0001;
  private static readonly TUANJIE_TAG = "Tuanjie";

  public static debug(format: string, ...args: unknown[]): void {
    hilog.debug(this.DOMAIN, this.TUANJIE_TAG, format, args);
  }

  public static info(format: string, ...args: unknown[]): void {
    hilog.info(this.DOMAIN, this.TUANJIE_TAG, format, args);
  }

  public static warn(format: string, ...args: unknown[]): void {
    hilog.warn(this.DOMAIN, this.TUANJIE_TAG, format, args);
  }

  public static error(format: string, ...args: unknown[]): void {
    hilog.error(this.DOMAIN, this.TUANJIE_TAG, format, args);
  }

  public static fatal(format: string, ...args: unknown[]): void {
    hilog.fatal(this.DOMAIN, this.TUANJIE_TAG, format, args);
  }
}
