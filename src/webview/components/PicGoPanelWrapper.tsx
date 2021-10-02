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

const drawerWidth: number = 240

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

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
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
    <Box sx={{ display: 'flex' }}>
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
              width: 32
            }}
          />
          <Typography
            sx={{
              ...(!open && { display: 'none' })
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
        {drawerList}
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
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          {children}
        </Container>
        <Paper
          sx={{
            bottom: 0,
            position: 'sticky'
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
