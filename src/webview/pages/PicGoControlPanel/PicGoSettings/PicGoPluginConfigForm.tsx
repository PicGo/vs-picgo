import { IPluginConfig } from 'picgo'
import React from 'react'
import {
  Grid,
  Paper,
  TextField,
  Select,
  MenuItem,
  Typography,
  Box,
  Checkbox,
  FormControlLabel
} from '@mui/material'

export interface IPicGoPluginConfigFormProps {
  pluginId: string
  pluginName: string
  pluginConfigList?: IPluginConfig[]
  onConfigChange: <V = any>(configName: string, value: V) => void
  currentPluginConfig: Record<string, any>
}

export const PicGoPluginConfigForm: React.FC<IPicGoPluginConfigFormProps> = ({
  pluginConfigList,
  currentPluginConfig,
  onConfigChange,
  pluginName,
  pluginId
}) => {
  return (
    <Grid
      id={pluginId}
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
        {/* Handle different type of configurations:
            - input: use input component
            - list: use select component
            - ...
          */}
        <Typography component="h2" gutterBottom variant="h6">
          Settings of {pluginName}
        </Typography>
        {pluginConfigList?.map((config) => {
          switch (config.type) {
            case 'input':
            case 'password':
              return (
                <TextField
                  fullWidth
                  key={config.name}
                  label={config.alias ?? config.name}
                  onChange={(e) => {
                    onConfigChange(config.name, e.target.value)
                  }}
                  placeholder={config.message ?? config.name}
                  required={config.required}
                  sx={{
                    my: 1
                  }}
                  type={config.type}
                  value={currentPluginConfig[config.name] ?? ''}
                />
              )
            case 'confirm':
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={currentPluginConfig[config.name] ?? false}
                      key={config.name}
                      onChange={(e) => {
                        onConfigChange(config.name, e.target.value)
                      }}
                      required={config.required}
                    />
                  }
                  label={config.name}
                />
              )
            case 'list':
            case 'checkbox':
              return (
                <Select
                  fullWidth
                  key={config.name}
                  label={config.name}
                  onChange={(e) => {
                    onConfigChange(config.name, e.target.value)
                  }}
                  placeholder={config.message ?? config.name}
                  required={config.required}
                  sx={{
                    my: 1
                  }}
                  value={currentPluginConfig[config.name] ?? ''}>
                  {config?.choices?.map((choice: any) => {
                    const value = choice?.value ?? choice?.name ?? choice
                    return (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    )
                  })}
                </Select>
              )
            default:
              return (
                <Box
                  key={config.name}
                  sx={{
                    my: 1,
                    textAlign: 'left'
                  }}>
                  <Typography variant="body2">Unsupported config:</Typography>
                  <Typography component="pre" variant="body2">
                    {JSON.stringify(config, null, 2)}
                  </Typography>
                </Box>
              )
          }
        })}
      </Paper>
    </Grid>
  )
}
