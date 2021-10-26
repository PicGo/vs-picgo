import React from 'react'
import { useDropzone } from 'react-dropzone'
import {
  Paper,
  Typography,
  Grid,
  MenuList,
  MenuItem,
  ListItemText,
  Divider,
  Box
} from '@mui/material'
import {
  showMessage,
  uploadFiles,
  executeCommand
} from '../../../utils/channel'
import * as MuiIconsMaterial from '@mui/icons-material'
import { contributes, getNLSText } from '../../../../utils/meta'

export const PicGoUpload = () => {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    async onDropAccepted(files) {
      try {
        const outputs = await uploadFiles(files.map((file) => file.path))
        showMessage({
          type: 'info',
          message: `successfully uploaded ${outputs.length} files`
        })
      } catch (err) {
        showMessage({
          type: 'error',
          message: `upload failed: ${String(err)}`
        })
      }
    }
  })
  const rootProps = getRootProps()

  const activeStyle = {
    borderColor: 'primary.main',
    backgroundColor: 'action.hover'
  }

  const acceptStyle = {
    borderColor: 'info.main'
  }

  const rejectStyle = {
    borderColor: 'error.main'
  }

  const uploadCommands = contributes.commands.filter((cmd) =>
    cmd.command.startsWith('picgo.uploadImage')
  )
  const height = 300

  return (
    <Grid container spacing={3}>
      <Grid item lg={8} md={8} xs={12}>
        <Paper
          {...rootProps}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 4,
            borderWidth: 2,
            borderRadius: 2,
            borderStyle: 'dashed',
            outline: 'none',
            transition: 'border .24s ease-in-out',
            '&:hover': {
              backgroundColor: 'action.hover'
            },
            height,
            cursor: 'pointer',
            ...(isDragActive ? activeStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {})
          }}>
          <input {...getInputProps()} />
          <MuiIconsMaterial.Upload
            sx={{
              fontSize: 100
            }}
          />
          <Typography sx={{ textAlign: 'center' }} variant="body1">
            <Box component="span" sx={{ display: 'inline-block' }}>
              Drag and drop some files here to upload,
            </Box>{' '}
            <Box component="span" sx={{ display: 'inline-block' }}>
              or click to select files
            </Box>
          </Typography>
        </Paper>
      </Grid>

      <Grid item lg={4} md={4} xs={12}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height
          }}>
          <Typography component="h2" gutterBottom variant="h6">
            Quick Upload
          </Typography>
          <Grid
            alignItems="center"
            container
            direction="row"
            justifyContent="center"
            sx={{
              flex: 1
            }}>
            <MenuList
              sx={{
                flex: 1
              }}>
              <Divider sx={{ my: 1 }} />
              {uploadCommands.map((cmd) => (
                <Box key={cmd.command}>
                  <MenuItem onClick={() => executeCommand(cmd.command)}>
                    <ListItemText>
                      {getNLSText(cmd.title.slice(1, -1) as any)}
                    </ListItemText>
                    {contributes.keybindings
                      .find((k) => k.command === cmd.command)
                      ?.key.replace('ctrl', '⌘')
                      .replace('alt', '⌥')
                      .split('+')
                      .map((key) => (
                        <Typography
                          color="text.secondary"
                          component="kbd"
                          key={key}
                          sx={{
                            m: 0.25,
                            width: 20,
                            textAlign: 'center'
                          }}
                          variant="body2">
                          {key}
                        </Typography>
                      ))}
                  </MenuItem>
                  <Divider />
                </Box>
              ))}
            </MenuList>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  )
}
