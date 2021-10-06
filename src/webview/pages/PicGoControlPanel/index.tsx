import * as React from 'react'
import { PicGoControlPanelWrapper } from '../../components/PicGoPanelWrapper'
import { Provider } from 'react-redux'
import { store } from './store'
import { PicGoDrawerList } from './PicGoDrawerList'
import { PicGoUpload } from './PicGoUpload'
import { PicGoGallery } from './PicGoGallery'
import { PicGoSettings } from './PicGoSettings'

export const PicGoControlPanel = () => {
  return (
    <Provider store={store}>
      <PicGoControlPanelWrapper drawerList={<PicGoDrawerList />}>
        <PicGoUpload />
        <PicGoGallery />
        <PicGoSettings />
      </PicGoControlPanelWrapper>
    </Provider>
  )
}
