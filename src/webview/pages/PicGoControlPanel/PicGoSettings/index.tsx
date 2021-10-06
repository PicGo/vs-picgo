import { Grid, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { Route } from 'react-router-dom'
import { useAsync } from 'react-use'
import type { IUploaderConfig } from '../../../../vscode/PicgoAPI'
import { PicGoPluginConfigForm } from '../../../components/PicGoPluginConfigForm'
import { getAllUploaderConfigs, setConfig } from '../../../utils/channel'

export const PicGoSettings: React.FC = () => {
  /**
   * Only update `allUploaderConfigs` on mounted and new uploader installed, it is the initial state (its default config is read from the data.json file).
   */
  const [allUploaderConfigs, setAllUploaderConfigs] = useState<
    IUploaderConfig[]
  >([])
  /**
   * Current config is synced with user input and will write to data.json config file immediately
   */
  const [currentUploaderConfigs, setCurrentUploaderConfigs] = useState<
    Record<string, Record<string, any>>
  >({})

  useAsync(async () => {
    setAllUploaderConfigs(await getAllUploaderConfigs())
  }, [])
  /**
   * Once we go new `allUploaderConfigs`, we will start with a new editing state, i.e., we recalculate `currentConfig`
   */
  useEffect(() => {
    const configFromAllUploaderConfigs: typeof currentUploaderConfigs = {}
    allUploaderConfigs.forEach(({ configList, uploaderID }) => {
      configFromAllUploaderConfigs[uploaderID] ??= {}
      configList?.forEach((config) => {
        configFromAllUploaderConfigs[uploaderID][config.name] = config.default
      })
    })
    setCurrentUploaderConfigs(configFromAllUploaderConfigs)
  }, [allUploaderConfigs])

  return (
    <Route exact path="/settings">
      <Typography component="h2" gutterBottom variant="h6">
        Uploader Settings
      </Typography>
      <Grid container spacing={3}>
        {/* All uploaders (settings stored at picBed) */}
        {allUploaderConfigs.map(({ uploaderName, configList, uploaderID }) => {
          return (
            <PicGoPluginConfigForm
              currentPluginConfig={currentUploaderConfigs[uploaderID]}
              key={uploaderName}
              onConfigChange={(configName: string, value) => {
                setConfig(`picBed.${uploaderID}.${configName}`, value)
                currentUploaderConfigs[uploaderID][configName] = value
                setCurrentUploaderConfigs({
                  ...currentUploaderConfigs
                })
              }}
              pluginConfigList={configList}
              pluginName={uploaderName}
            />
          )
        })}
        <Typography component="h2" gutterBottom variant="h6">
          Plugin Settings
        </Typography>
        {/* All Plugins */}
      </Grid>
    </Route>
  )
}
