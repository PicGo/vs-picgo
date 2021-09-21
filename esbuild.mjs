/* eslint-disable no-console */
// We use .mjs because globby package now is pure-esm, and can only be imported in esm mode, because this is a simple build script and we do not want to bother run esm-to-cjs build process, we just change our build script to esm
// We cannot use "type": "module" in package.json because VSCode supports cjs modules only at the present
import { globbySync } from 'globby'
import esbuild from 'esbuild'
import fse from 'fs-extra'
import minimist from 'minimist'
import { lessLoader } from 'esbuild-plugin-less'
import inlineImportPlugin from 'esbuild-plugin-inline-import'

const args = minimist(process.argv.slice(2))
const isWatch = args.watch || args.w
const isTest = args.test || args.t
const isProduction = args.production

// Following the log format of https://github.com/connor4312/esbuild-problem-matchers
const status = (msg) => console.log(`${isWatch ? '[watch] ' : ''}${msg}`)

const firstBuildFinished = new Set()
let buildStartTime

/** @type {import('esbuild').Plugin} */
const watchPlugin = (type) => ({
  name: 'watcher',
  setup(build) {
    build.onStart(() => {
      buildStartTime = Date.now()
      status(`${type} build started.`)
    })
    build.onEnd((result) => {
      result.errors.forEach((error) =>
        console.error(
          `> ${error.location.file}:${error.location.line}:${error.location.column}: error: ${error.text}`
        )
      )
      firstBuildFinished.add(type)
      if (firstBuildFinished.size === 2) {
        // esbuild problem matcher extension is listening for this log, once this is logged, it will open the Extension Host
        // So we have to assure only printing this when both extension and webview have been built
        status(`build finished in ${Date.now() - buildStartTime} ms.`)
      } else {
        status(`${type} build finished in ${Date.now() - buildStartTime} ms.`)
      }
    })
  }
})
const resultHandler = async (result) => {
  result.metafile &&
    console.log(
      await esbuild.analyzeMetafile(result.metafile, {
        verbose: true
      })
    )
}

const outdir = './dist'

// clean old built files
fse.rmdirSync(outdir, { recursive: true })

/** @type {import('esbuild').BuildOptions} */
const commonOptions = {
  bundle: true,
  sourcemap: !isProduction,
  watch: isWatch,
  loader: {
    '.js': 'jsx',
    '.png': 'file',
    '.jpg': 'file',
    '.svg': 'file'
  },
  minify: isProduction
  // metafile: true,
}

// build extension (node app)
esbuild
  .build({
    ...commonOptions,
    outdir,
    entryPoints: isTest ? globbySync('test/**/*.ts') : ['src/extension.ts'],
    external: isTest ? ['vscode', 'mocha', 'istanbul'] : ['vscode'],
    format: 'cjs',
    platform: 'node',
    plugins: [watchPlugin('extension'), inlineImportPlugin()]
  })
  .then(resultHandler)
  .catch(() => {
    process.exit(1)
  })
// copy picgo's clipboard scripts
fse.copy('node_modules/picgo/dist/src/utils/clipboard', `${outdir}/clipboard`, {
  overwrite: true
})

// build webview (web app)
esbuild
  .build({
    ...commonOptions,
    outdir: `${outdir}/webview`,
    entryPoints: globbySync('src/webview/pages/*.tsx'),
    target: ['chrome58'],
    plugins: [lessLoader(), watchPlugin('webview')]
    // publicPath: 'https://www.example.com/v1',
  })
  .then(resultHandler)
  .catch(() => {
    process.exit(1)
  })
