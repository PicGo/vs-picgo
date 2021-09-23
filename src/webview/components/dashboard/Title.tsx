import * as React from 'react'
import Typography from '@mui/material/Typography'

interface ITitleProps {
  children?: React.ReactNode
}

export default function Title(props: ITitleProps) {
  return (
    <Typography color="primary" component="h2" gutterBottom variant="h6">
      {props.children}
    </Typography>
  )
}
