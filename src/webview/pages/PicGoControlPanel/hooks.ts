import {
  useDispatch as _useDispatch,
  useSelector as _useSelector,
  useStore as _useStore
} from 'react-redux'
import { RematchRootState, RematchStore } from '@rematch/core'
import type { FullModel, Dispatch, ModelKeys, RootState, Store } from './store'
import { IRootModel } from './models'
import { RematchSelect } from '@rematch/select'

/**
 * Encapsulate the hooks to make type stronger and code shorter to use in components
 */
export const useStore = () => {
  return _useStore() as RematchStore<IRootModel, FullModel>
}

export const useDispatch = <T extends ModelKeys>(modelKey: T) => {
  return _useDispatch<Dispatch>()[modelKey]
}

export const useState = <T extends ModelKeys>(modelKey: T) => {
  return _useSelector((state: RootState) => state[modelKey])
}

export const useSelector = <
  T extends ModelKeys,
  M extends keyof RematchSelect<
    IRootModel,
    FullModel,
    RematchRootState<IRootModel, FullModel>
  >[T]
>(
  modelKey: T,
  selector: M
  /* @ts-expect-error */
): ReturnType<Store['select'][T][M]> => {
  _useSelector(useStore().select.settings.uploaderTitleItems)
  return _useSelector(useStore().select[modelKey][selector] as any)
}
