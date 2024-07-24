import { GetFromGlobalThis } from '../common/GlobalThisUtil'

@CustomDialog
export struct SoftInputDialog {
  private showMessage: string = ''
  private inputMessage: string = ''
  onTextChange: (msg: string) => void = () => {
  }
  onTextSelectionChange: (start: number, end: number) => void = () => {
  }
  accept: (msg: string) => void = () => {
  }
  controller?: CustomDialogController
  cancel: () => void = () => {
  }
  confirm: () => void = () => {
  }

  build() {
    Column() {
      Row() {
        TextInput({ text: GetFromGlobalThis('inputInitialText') })
          .backgroundColor('#ffffff')
          .layoutWeight(1)
          .onChange((value) => {
            if (this.onTextChange) {
              this.onTextChange(value);
            }
            this.inputMessage = value;
          })
          .onTextSelectionChange((start, end) => {
            if (this.onTextSelectionChange) {
              this.onTextSelectionChange(start, end);
            }
          })
          .onSubmit((value) => {
            if (this.accept) {
              this.accept(this.inputMessage);
            }
            this.controller!.close();
          })
        Blank(8).width(16)
        Button('完成').onClick(() => {
          if (this.accept) {
            this.accept(this.inputMessage);
          }
          this.controller!.close();
        })
      }.padding({ left: 8, right: 8, top: 8, bottom: 8 })
      .backgroundColor(Color.Gray)

    }
    .width('100%')

    .justifyContent(FlexAlign.End)
  }
}