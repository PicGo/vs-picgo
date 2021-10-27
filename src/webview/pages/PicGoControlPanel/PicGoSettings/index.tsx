import { Grid } from '@mui/material'
import React from 'react'
import { PicGoPluginConfigForm } from './PicGoPluginConfigForm'
import { useState, useDispatch } from '../hooks'
import { useParams } from 'react-router-dom'

export interface IPicGoSettingsParams {
  uploaderID?: string
  pluginID?: string
}

export const PicGoSettings: React.FC = () => {
  const { allUploaderConfigs, currentUploaderConfigs } = useState('settings')
  const dispatch = useDispatch('settings')

  const params = useParams<IPicGoSettingsParams>()

  return (
    <Grid container justifyContent="center" spacing={3}>
      {/* If it is a uploader config page */}
      {params.uploaderID
        ? (() => {
            const config = allUploaderConfigs.find(
              (config) => config.uploaderID === params.uploaderID
            )
            if (!config) return null
            const { uploaderID, configList, uploaderName } = config

            return (
              <PicGoPluginConfigForm
                currentPluginConfig={currentUploaderConfigs[uploaderID]}
                key={uploaderID}
                // bind a ref here, we can use scrollIntoView to scroll to this setting in the sidebar
                onConfigChange={(configName: string, value) => {
                  dispatch.updateCurrentUploaderConfigs({
                    uploaderID,
                    configName,
                    value
                  })
                }}
                pluginConfigList={configList}
                pluginId={uploaderID}
                pluginName={`uploader: ${uploaderName}`}
              />
            )
          })()
        : null}
      {/* If it is a plugin config page */}
    </Grid>
  )
}
