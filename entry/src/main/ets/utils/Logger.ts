import hilog from '@ohos.hilog';

export class Logger {
  private Logger() {};
  private static readonly DOMAIN = 0x0003;
  private static readonly TAG = "Logger";

  public static debug(format: string, ...args: unknown[]): void {
    hilog.debug(this.DOMAIN, this.TAG, format, args);
  }

  public static info(format: string, ...args: unknown[]): void {
    hilog.info(this.DOMAIN, this.TAG, format, args);
  }

  public static warn(format: string, ...args: unknown[]): void {
    hilog.warn(this.DOMAIN, this.TAG, format, args);
  }

  public static error(format: string, ...args: unknown[]): void {
    hilog.error(this.DOMAIN, this.TAG, format, args);
  }

  public static fatal(format: string, ...args: unknown[]): void {
    hilog.fatal(this.DOMAIN, this.TAG, format, args);
  }
}
