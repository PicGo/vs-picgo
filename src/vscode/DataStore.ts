import { DBStore } from '@picgo/store'
import { getAppDataPath } from 'appdata-path'
import path from 'path'
import fs from 'fs-extra'

export class DataStore {
  static dataStore: DataStore = new DataStore()

  readonly db: DBStore
  private constructor() {
    this.db = new DBStore(this.galleryStorePath, 'gallery')
  }

  /**
   * Default paths:
   * - the `userDataPath` is consistent with electron: https://www.electronjs.org/docs/api/app#appgetpathname
   * - the uploaded images data: `userDataPath/picgo/picgo.db`, eg. `~/Library/Application Support/picgo/picgo.db` in macOS
   * - the configuration path: `userDataPath/picgo/data.json`, eg. `~/Library/Application Support/picgo/data.json` in macOS
   */
  get appDataPath() {
    const appDataPath = getAppDataPath('picgo')
    fs.ensureDirSync(appDataPath)
    return appDataPath
  }

  get galleryStorePath() {
    return path.join(this.appDataPath, 'picgo.db')
  }

  /**
   * picgo.log will be automatically calculated according to configPath by picgo, so we do not need to handle log file path here
   */
  get configPath() {
    return path.join(this.appDataPath, 'data.json')
  }
}
