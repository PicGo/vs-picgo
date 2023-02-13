import * as React from 'react'
import { PicGoControlPanelWrapper } from '../../components/PicGoPanelWrapper'
import { Provider } from 'react-redux'
import { store } from './store'
import { PicGoDrawerList } from './PicGoDrawerList'
import { PicGoUpload } from './PicGoUpload'
import { PicGoGallery } from './PicGoGallery'
import { PicGoSettings } from './PicGoSettings'
import { Route } from 'react-router-dom'
import { getAllUploaderConfigs } from '../../utils/channel'
import { useDispatch } from './hooks'
import { useAsync } from 'react-use'
export const PicGoControlPanelInner = () => {
  const dispatch = useDispatch('settings')

  useAsync(async () => {
    dispatch.setAllUploaderConfigs(await getAllUploaderConfigs())
  }, [])

  return (
    <PicGoControlPanelWrapper drawerList={<PicGoDrawerList />}>
      <Route exact path="/">
        <PicGoUpload />
      </Route>
      <Route exact path="/gallery">
        <PicGoGallery />
      </Route>
      <Route exact path={`/settings/uploader/:uploaderID`}>
        <PicGoSettings />
      </Route>
      <Route exact path={`/settings/vs-picgo`}>
        <PicGoSettings />
      </Route>
      <Route exact path={`/settings/plugin/:pluginID`}>
        <PicGoSettings />
      </Route>
    </PicGoControlPanelWrapper>
  )
}

export const PicGoControlPanel = () => (
  <Provider store={store}>
    <PicGoControlPanelInner />
  </Provider>
)
