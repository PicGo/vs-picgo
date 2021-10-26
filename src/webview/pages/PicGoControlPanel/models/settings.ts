import { createModel } from '@rematch/core'
import type { IUploaderConfig } from '../../../../vscode/PicgoAPI'
import { IRootModel } from '../models'
import { setConfig } from '../../../utils/channel'
export interface IPicGoSettingState {
  /**
   * Only update `allUploaderConfigs` on mounted and new uploader installed, it is the initial state (its default config is read from the data.json file).
   */
  allUploaderConfigs: IUploaderConfig[]
  /**
   * Current config is synced with user input and will write to data.json config file immediately
   *
   * currentUploaderConfigs[uploaderID][config.name] = value
   */
  currentUploaderConfigs: Record<string, Record<string, any>>
}

export interface IUpdateCurrentUploaderConfigsPayload {
  uploaderID: string
  configName: string
  value: any
}

export const defaultCommonState: IPicGoSettingState = {
  allUploaderConfigs: [],
  currentUploaderConfigs: {}
}

export const settings = createModel<IRootModel>()({
  state: defaultCommonState,
  reducers: {
    /**
     * This reducer should be called on paged loaded so that we have the initial `currentUploaderConfigs` state for page to render correctly, such as the uploader list in the drawer and the whole settings page.
     */
    setAllUploaderConfigs(state, allUploaderConfigs: IUploaderConfig[]) {
      state.allUploaderConfigs = allUploaderConfigs
      /**
       * Once we go new `allUploaderConfigs`, we will start with a new editing state, i.e., we recalculate `currentUploaderConfigs`
       */
      state.currentUploaderConfigs = {}
      allUploaderConfigs.forEach(({ configList, uploaderID }) => {
        state.currentUploaderConfigs[uploaderID] ??= {}
        configList?.forEach((config) => {
          state.currentUploaderConfigs[uploaderID][config.name] = config.default
        })
      })
    },
    updateCurrentUploaderConfigs(
      state,
      { uploaderID, configName, value }: IUpdateCurrentUploaderConfigsPayload
    ) {
      setConfig(`picBed.${uploaderID}.${configName}`, value)
      state.currentUploaderConfigs[uploaderID][configName] = value
    }
  },
  selectors: (slice, createSelector, hasProps) => ({
    uploaderTitleItems() {
      return slice((settings) => {
        return settings.allUploaderConfigs.map((uploaderConfig) => {
          return {
            id: uploaderConfig.uploaderID,
            title: uploaderConfig.uploaderName
          }
        })
      })
    }
  })
})
