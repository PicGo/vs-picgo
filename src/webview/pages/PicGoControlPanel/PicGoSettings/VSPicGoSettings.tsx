import React from 'react'
import { useRouteMatch } from 'react-router'
import {
  Grid,
  Paper,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton
} from '@mui/material'
import * as MuiIconsMaterial from '@mui/icons-material'
import { useAsync } from 'react-use'
import { useDispatch, useState } from '../hooks'
import {
  getPicGoSettings,
  revealFileInOS,
  setConfig
} from '../../../utils/channel'

/**
 * This page contains all the settings in the IPicgoSettings.settings.vsPicgo, and application wide configuration such current uploader in the `picBed.uploader` field
 */
export const VSPicGoSettings: React.FC = () => {
  const match = useRouteMatch('/settings/vs-picgo')
  if (!match) return null

  const dispatch = useDispatch('settings')
  useAsync(async () => {
    dispatch.setPicGoSettings(await getPicGoSettings())
  }, [])

  const { picgoSettings } = useState('settings')

  return (
    <Grid
      item
      lg={9}
      md={8}
      sx={{
        textAlign: 'center'
      }}
      xs={12}>
      <Paper
        sx={{
          p: 2
        }}>
        {/* Log file settings */}
        <FormControl fullWidth sx={{ my: 1 }} variant="outlined">
          <InputLabel htmlFor="log-file-path">Log file path</InputLabel>
          <OutlinedInput
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={() => {
                    const logPath = picgoSettings?.settings.logPath
                    if (!logPath) return
                    revealFileInOS(logPath)
                  }}
                  title="Reveal log file in system file explorer">
                  <MuiIconsMaterial.FolderOpen />
                </IconButton>
              </InputAdornment>
            }
            fullWidth
            id="log-file-path"
            label="Log file path"
            onChange={async (e) => {
              await setConfig('settings.logPath', e.target.value)
              dispatch.setPicGoSettings(await getPicGoSettings())
            }}
            value={picgoSettings?.settings.logPath ?? 'N/A'}
          />
        </FormControl>
      </Paper>
    </Grid>
  )
}
