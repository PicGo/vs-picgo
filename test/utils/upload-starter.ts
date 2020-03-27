import { Range, Position, window, workspace } from 'vscode';
import { DEFAULT_CONFIGS, IVSPicgoUploadStarterOptions, IVSPicgoConfigurationKeys } from './constants-and-interfaces';
import { EVSPicgoHooks } from '../../src/vs-picgo';

export async function VSPicgoUploadStarter(options: IVSPicgoUploadStarterOptions): Promise<string> {
  // load custom configuration
  const mergedConfig = Object.assign({}, DEFAULT_CONFIGS, options.configuration);

  // update configuration
  for (const section of Object.keys(mergedConfig)) {
    await workspace
      .getConfiguration('', null)
      .update(section, mergedConfig[section as IVSPicgoConfigurationKeys], true);
  }

  const editor = window.activeTextEditor;

  if (!editor) {
    throw new Error('No activeTextEditor.');
  }

  await editor.edit(editorBuilder => {
    // clean up content in test.md, insert custom content
    const fullRange = new Range(new Position(0, 0), editor.document.positionAt(editor.document.getText().length));
    editorBuilder.replace(fullRange, options.editor.content);
  });

  editor.selection = options.editor.selection;

  await options.vspicgo.upload(options.args4uploader);

  return new Promise((resolve, reject) => {
    options.vspicgo.on(EVSPicgoHooks.updated, async (res: string) => {
      console.log('updated: ' + res);
      const { document } = editor;
      await document.save();
      resolve(document.getText());
    });
  });
}
