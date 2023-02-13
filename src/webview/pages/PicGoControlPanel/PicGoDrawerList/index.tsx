import {
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Collapse
} from '@mui/material'
import * as MuiIconsMaterial from '@mui/icons-material'
import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useSelector } from '../hooks'

/**
 * The menu list in the drawer.
 * This list will help redirect to the different route
 * to show different routes. The current activated route
 * will highlighted as selected item in the list.
 */
export const PicGoDrawerList = () => {
  const history = useHistory()
  const { pathname } = useLocation()

  const uploaderTitleItems = useSelector('settings', 'uploaderTitleItems')

  const [uploaderListOpened, setUploaderListOpened] = React.useState(false)

  return (
    <List>
      <ListItemButton
        onClick={() => history.push('/')}
        selected={pathname === '/'}
        sx={{
          borderRadius: 4,
          my: 0.5
        }}>
        <ListItemIcon>
          <MuiIconsMaterial.Upload />
        </ListItemIcon>
        <ListItemText primary="Upload" />
      </ListItemButton>

      <ListItemButton
        onClick={() => history.push('/gallery')}
        selected={pathname === '/gallery'}
        sx={{
          borderRadius: 4,
          my: 0.5
        }}>
        <ListItemIcon>
          <MuiIconsMaterial.Image />
        </ListItemIcon>
        <ListItemText primary="Gallery" />
      </ListItemButton>

      {/* Nest settings of uploaders as nested list item: https://mui.com/components/lists/#nested-list */}
      <ListItemButton
        onClick={() => setUploaderListOpened(!uploaderListOpened)}
        sx={{
          borderRadius: 4,
          my: 0.5
        }}>
        <ListItemIcon>
          <MuiIconsMaterial.Cloud />
        </ListItemIcon>
        <ListItemText primary="Uploaders" />
        {uploaderListOpened ? (
          <MuiIconsMaterial.ExpandLess />
        ) : (
          <MuiIconsMaterial.ExpandMore />
        )}
      </ListItemButton>
      <Collapse in={uploaderListOpened} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {uploaderTitleItems.map((titleItem) => (
            <ListItemButton
              key={titleItem.id}
              onClick={() => history.push(`/settings/uploader/${titleItem.id}`)}
              selected={pathname === `/settings/uploader/${titleItem.id}`}
              sx={{
                borderRadius: 4,
                textAlign: 'center',
                my: 0.5
              }}>
              <ListItemText primary={titleItem.title} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>

      <ListItemButton
        onClick={() => history.push('/settings/vs-picgo')}
        selected={pathname === '/settings/vs-picgo'}
        sx={{
          borderRadius: 4,
          my: 0.5
        }}>
        <ListItemIcon>
          <MuiIconsMaterial.Settings />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </ListItemButton>
    </List>
  )
}
