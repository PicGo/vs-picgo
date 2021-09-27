import { Link, Typography } from '@mui/material'
import React from 'react'

export function Copyright(props: any) {
  return (
    <Typography
      align="center"
      color="text.secondary"
      variant="body2"
      {...props}>
      {'Copyright © '}
      <Link color="inherit" href="http://github.com/PicGo">
        PicGo Group
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}
