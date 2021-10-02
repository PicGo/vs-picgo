import { init, RematchDispatch, RematchRootState } from '@rematch/core'
import loading, { ExtraModelsFromLoading } from '@rematch/loading'
import updated, { ExtraModelsFromUpdated } from '@rematch/updated'
import immerPlugin from '@rematch/immer'
import selectPlugin from '@rematch/select'
import { models, IRootModel } from './models'

type FullModel = ExtraModelsFromLoading<IRootModel> &
  ExtraModelsFromUpdated<IRootModel>
export const store = init<IRootModel, FullModel>({
  models,
  plugins: [updated(), loading(), immerPlugin(), selectPlugin()]
})

export type Store = typeof store
export type Dispatch = RematchDispatch<IRootModel>
export type RootState = RematchRootState<IRootModel, FullModel>
