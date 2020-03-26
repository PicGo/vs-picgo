import * as glob from 'glob';
import * as path from 'path';
import * as Mocha from 'mocha';

export function run(): Promise<void> {
  // Create the mocha test
  const mocha = new Mocha({
    color: true,
    ui: 'bdd',
  });

  const testsRoot = path.resolve(__dirname, '../suite');

  return new Promise((resolve, reject) => {
    glob('**/**test.js', { cwd: testsRoot }, (err, files) => {
      if (err) {
        return reject(err);
      }

      files.forEach((file): Mocha => mocha.addFile(path.resolve(testsRoot, file)));

      try {
        mocha.run(failures => {
          if (failures > 0) {
            reject(new Error(`${failures} tests failed.`));
          }
          resolve();
        });
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  });
}
