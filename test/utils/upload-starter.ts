/* eslint-disable @typescript-eslint/no-misused-promises */
import { Range, Position, window } from 'vscode'
import { CommandManager } from '../../src/vscode/CommandManager'
import { IVSPicgoUploadStarterOptions } from './constants-and-interfaces'

export async function VSPicgoUploadStarter(
  options: IVSPicgoUploadStarterOptions
) {
  const editor = window.activeTextEditor

  if (!editor) {
    throw new Error('No activeTextEditor.')
  }

  await editor.edit((editorBuilder) => {
    // clean up content in test.md, insert custom content
    const fullRange = new Range(
      new Position(0, 0),
      editor.document.positionAt(editor.document.getText().length)
    )
    editorBuilder.replace(fullRange, options.editor.content)
  })

  editor.selection = options.editor.selection

  return await CommandManager.commandManager.uploadCommand(
    options.args4uploader
  )
}
