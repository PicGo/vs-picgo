import vscode from 'vscode'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Editor {
  static get editor() {
    return vscode.window.activeTextEditor
  }

  static async writeToEditor(text: string) {
    const editor = this.editor
    return await editor?.edit((textEditor) => {
      textEditor.replace(editor.selection, text)
    })
  }
}
