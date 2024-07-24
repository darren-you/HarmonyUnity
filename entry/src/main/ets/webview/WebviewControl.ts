import worker from '@ohos.worker';

const workerPort = worker.workerPort;

export class WebviewControl {
  public CreateWebview(ml: number, mt: number, mr: number, mb: number, visible: boolean) {
    console.info('>>>> CreateWebview method enter');
    workerPort.postMessage({ type: "RUN_ON_UI_THREAD_JS", funcName: "CreateWebView"});
    this.SetMargins(ml, mt, mr, mb);
    this.SetVisibility(visible);
  }

  public RemoveWebview(): void {
    console.info('>>>> RemoveWebview method enter');
    workerPort.postMessage({ type: "RUN_ON_UI_THREAD_JS", funcName: "RemoveWebview"});
  }

  public LoadURL(url: string): void {
    console.info('>>>> LoadURL method enter url is ' + url);
    workerPort.postMessage({ type: "RUN_ON_UI_THREAD_JS", funcName: "LoadURL", url: url });
  }

  public LoadHTMLString(contents: string, baseUrl: string): void {
    console.info('>>>> LoadHTMLString method enter');
    workerPort.postMessage({
      type: "RUN_ON_UI_THREAD_JS",
      funcName: "LoadHTMLString",
      contents: contents,
      baseUrl: baseUrl
    });
  }

  public LoadData(contents: string, baseUrl: string): void {
    console.info('>>>> LoadData method enter');
    workerPort.postMessage({
      type: "RUN_ON_UI_THREAD_JS",
      funcName: "LoadData",
      contents: contents,
      baseUrl: baseUrl
    });
  }

  public EvaluateJS(jsContents: string): void {
    console.info('>>>> EvaluateJS method enter ' + jsContents);
    workerPort.postMessage({
      type: "RUN_ON_UI_THREAD_JS",
      funcName: "EvaluateJS",
      jsContents: jsContents
    });
  }

  public Reload(): void {
    console.info('>>>> Reload method enter');
    workerPort.postMessage({
      type: "RUN_ON_UI_THREAD_JS",
      funcName: "Reload"
    });
  }

  public StopLoading(): void {
    console.info('>>>> StopLoading method enter');
    workerPort.postMessage({
      type: "RUN_ON_UI_THREAD_JS",
      funcName: "StopLoading"
    });
  }

  public GoForward(): void {
    console.info('>>>> GoForward method enter');
    workerPort.postMessage({
      type: "RUN_ON_UI_THREAD_JS",
      funcName: "GoForward"
    });
  }

  public GoBack(): void {
    console.info('>>>> GoBack method enter');
    workerPort.postMessage({
      type: "RUN_ON_UI_THREAD_JS",
      funcName: "GoBack"
    });
  }

  public SetVisibility(visible: boolean): void {
    console.info('>>>> SetVisibility method enter, visible is ' + visible);
    workerPort.postMessage({
      type: "RUN_ON_UI_THREAD_JS",
      funcName: "SetVisibility",
      visible: visible
    });
  }

  public SetMargins(ml: number, mt: number, mr: number, mb: number): void {
    console.info('>>>> SetMargins method enter');
    workerPort.postMessage({
      type: "RUN_ON_UI_THREAD_JS",
      funcName: "SetMargins",
      ml: ml,
      mt: mt,
      mr: mr,
      mb: mb
    });
  }
}

