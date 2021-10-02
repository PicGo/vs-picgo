import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon
} from '@mui/material'
import * as MuiIconsMaterial from '@mui/icons-material'
import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

/**
 * The menu list in the drawer.
 * This list will help redirect to the different route
 * to show different routes. The current activated route
 * will highlighted as selected item in the list.
 */
export const PicGoDrawerList = () => {
  const history = useHistory()
  const { pathname } = useLocation()

  return (
    <Box>
      <List>
        <ListItemButton
          onClick={() => history.push('/')}
          selected={pathname === '/'}>
          <ListItemIcon>
            <MuiIconsMaterial.Upload />
          </ListItemIcon>
          <ListItemText primary="Upload" />
        </ListItemButton>

        <ListItemButton
          onClick={() => history.push('/gallery')}
          selected={pathname === '/gallery'}>
          <ListItemIcon>
            <MuiIconsMaterial.Image />
          </ListItemIcon>
          <ListItemText primary="Gallery" />
        </ListItemButton>
      </List>
    </Box>
  )
}
