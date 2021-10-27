import { Models, createModel } from '@rematch/core'
import { settings } from './settings'

export interface ICommonState {
  count: number
}

export const defaultCommonState: ICommonState = {
  count: 10
}

export const common = createModel<IRootModel>()({
  state: defaultCommonState,
  reducers: {
    countUp(state) {
      state.count += 1
    },
    countDown(state) {
      state.count -= 1
    }
  }
})

export interface IRootModel extends Models<IRootModel> {
  common: typeof common
  settings: typeof settings
}

export const models: IRootModel = { common, settings }
