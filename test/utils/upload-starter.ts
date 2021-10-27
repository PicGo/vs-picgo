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

  const applied = await editor.edit((editorBuilder) => {
    // clean up content in test.md, insert custom content
    const endPosition = editor.document.positionAt(
      editor.document.getText().length
    )
    console.log(
      'document text',
      editor.document.getText(),
      editor.document.getText().length
    )
    console.log('endPosition', endPosition)
    const fullRange = new Range(new Position(0, 0), endPosition)
    editorBuilder.replace(fullRange, options.editor.content)
  })
  if (!applied) {
    console.error('edit cannot be applied')
  }

  editor.selection = options.editor.selection

  console.log('before upload text content', editor.document.getText())
  const ans = await CommandManager.commandManager.uploadCommand(
    options.args4uploader
  )
  console.log('after upload text content', editor.document.getText())
  return ans
}
