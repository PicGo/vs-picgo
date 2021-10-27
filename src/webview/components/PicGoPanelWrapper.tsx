import * as React from 'react'
import { styled } from '@mui/material/styles'
import {
  Drawer as MuiDrawer,
  AppBar as MuiAppBar,
  AppBarProps as MuiAppBarProps,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Paper,
  Divider
} from '@mui/material'
import * as MuiIconsMaterial from '@mui/icons-material'
import logo from '../../images/squareLogo.png'
import { Copyright } from './Copyright'

interface IAppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})<IAppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}))

const drawerWidth: number = 240
const drawerScrollbarWidth = 8

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    // the scrollbar occupies no width but overlaying in the right padding of the drawer. To make the drawer looks nicer, we should apply the same left padding as the right padding, ref: the MUI docs page's left sidebar
    overflow: 'overlay',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9)
      }
    })
  },
  '& .MuiDrawer-paper::-webkit-scrollbar': {
    width: drawerScrollbarWidth
  }
}))

export interface IPicGoControlPanelWrapperProps {
  drawerList: React.ReactNode
}

export const PicGoControlPanelWrapper: React.FC<IPicGoControlPanelWrapperProps> = ({
  children,
  drawerList
}) => {
  const [open, setOpen] = React.useState(true)
  const toggleDrawer = () => {
    setOpen(!open)
  }

  return (
    <Box sx={{ display: 'flex', maxHeight: '100vh' }}>
      <Drawer open={open} variant="permanent">
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pr: 1,
            pl: 3
          }}>
          <Box
            component="img"
            src={logo}
            sx={{
              width: 32,
              borderRadius: 2
            }}
          />
          <Typography
            sx={{
              ...(!open && { display: 'none' }),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            variant="h6">
            vs-picgo
          </Typography>
          <IconButton
            onClick={toggleDrawer}
            sx={{
              ...(!open && { display: 'none' })
            }}>
            <MuiIconsMaterial.ChevronLeft />
          </IconButton>
        </Toolbar>
        <Divider />
        <Box
          sx={{
            px: `${drawerScrollbarWidth}px`
          }}>
          {drawerList}
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}>
        <AppBar open={open} position="sticky">
          <Toolbar
            sx={{
              pr: '24px' // keep right padding when drawer closed
            }}>
            <IconButton
              aria-label="open drawer"
              color="inherit"
              edge="start"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' })
              }}>
              <MuiIconsMaterial.Menu />
            </IconButton>
            <Typography
              color="inherit"
              component="h1"
              noWrap
              sx={{ flexGrow: 1 }}
              variant="h6">
              Control Panel
            </Typography>
            <IconButton
              aria-label="GitHub Repository"
              color="inherit"
              href="https://github.com/PicGo/vs-picgo">
              <MuiIconsMaterial.GitHub />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Container
          maxWidth="lg"
          sx={{
            mt: 4,
            mb: 4,
            flexGrow: 1
          }}>
          {children}
        </Container>
        <Paper
          sx={{
            bottom: 0,
            position: 'sticky',
            zIndex: 1000
          }}>
          <Copyright
            sx={{
              py: 2
            }}
          />
        </Paper>
      </Box>
    </Box>
  )
}
