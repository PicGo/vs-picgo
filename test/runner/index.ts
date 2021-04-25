import * as fs from 'fs'
import glob from 'glob'
import * as path from 'path'
import Mocha from 'mocha'

import {
  COVERAGE_COLLECTOR_CONFIG_FILE_PATH,
  DEFAULT_COVERAGE_CONFIGURATION,
  ICoverageCollectorOptions,
  CoverageCollector
} from '../utils'

export async function run(): Promise<void> {
  // Create the mocha test
  const mocha = new Mocha({
    color: true,
    ui: 'bdd'
  })

  const testsRoot = path.resolve(__dirname, '../suite')

  // collect coverage

  let coverageCollectorOptions: ICoverageCollectorOptions = DEFAULT_COVERAGE_CONFIGURATION
  if (fs.existsSync(COVERAGE_COLLECTOR_CONFIG_FILE_PATH)) {
    coverageCollectorOptions = require(COVERAGE_COLLECTOR_CONFIG_FILE_PATH)
  }

  const coverageCollector = new CoverageCollector(
    path.dirname(COVERAGE_COLLECTOR_CONFIG_FILE_PATH),
    coverageCollectorOptions
  )

  return await new Promise((resolve, reject) => {
    coverageCollector.setup()
    glob('**/**test.js', { cwd: testsRoot }, (err, files) => {
      if (err) {
        return reject(err)
      }

      files.forEach(
        (file): Mocha => mocha.addFile(path.resolve(testsRoot, file))
      )

      try {
        mocha.run((failures) => {
          if (failures > 0) {
            reject(new Error(`${failures} tests failed.`))
          }
          coverageCollector.report()
          resolve()
        })
      } catch (err) {
        console.error(err)
        reject(err)
      }
    })
  })
}
