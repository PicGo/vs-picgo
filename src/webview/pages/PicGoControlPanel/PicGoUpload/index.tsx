import React from 'react'
import { Route } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { Paper, Typography } from '@mui/material'
import { showMessage, uploadFiles } from '../../../utils/channel'

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

  return (
    <Route exact path="/">
      <Paper
        {...rootProps}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          borderWidth: 2,
          borderRadius: 2,
          borderStyle: 'dashed',
          outline: 'none',
          transition: 'border .24s ease-in-out',
          '&:hover': {
            backgroundColor: 'action.hover'
          },
          height: 240,
          cursor: 'pointer',
          ...(isDragActive ? activeStyle : {}),
          ...(isDragAccept ? acceptStyle : {}),
          ...(isDragReject ? rejectStyle : {})
        }}>
        <input {...getInputProps()} />
        <Typography variant="body1">
          Drag and drop some files here to upload, or click to select files
        </Typography>
      </Paper>
    </Route>
  )
}
