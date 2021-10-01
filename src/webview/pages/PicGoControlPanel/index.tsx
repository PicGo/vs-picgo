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
  Grid,
  Paper
} from '@mui/material'
import * as MuiIconsMaterial from '@mui/icons-material'
import logo from '../../../images/squareLogo.png'

import { Copyright } from '../../components/Copyright'

import 'index.less'

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

export const PicGoControlPanel = () => {
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
          overflow: 'auto'
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
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {/* TODO: Replace this grid with router view */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography align="center" variant="body2">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Amet
                magnam quibusdam ipsam aliquid quisquam fuga, autem
                necessitatibus quos a nam eaque ducimus consequatur voluptate ea
                consectetur laborum asperiores doloremque cum perferendis
                dolorem libero. Numquam ab ipsum laudantium? Enim dignissimos
                labore sint consectetur alias ipsum aut nisi voluptas non
                asperiores, veniam quidem similique consequatur voluptates eaque
                illum? Dolorem dignissimos aperiam quas quasi, non ratione
                ducimus, sint facere cumque aspernatur excepturi hic totam
                beatae tempora saepe similique vel esse. Doloremque deleniti
                voluptatem unde ratione repellat iste temporibus explicabo
                veniam at veritatis quasi, alias quae dicta asperiores quis
                officiis impedit, sed, cupiditate dolorum voluptatum blanditiis
                libero architecto? Fuga, magni quas? Dicta, autem. Molestias
                beatae quos ea nisi. Doloremque distinctio a iure quibusdam
                magni. Dicta sed voluptatem expedita recusandae blanditiis
                tempore vero commodi ab magnam corporis sint quasi quia nesciunt
                laudantium nemo porro fugit, repellat dolor illo suscipit
                voluptas odit reiciendis tempora. Nisi maiores odit sapiente
                totam numquam assumenda, minus nam modi temporibus voluptate,
                aliquid laborum reiciendis dignissimos consectetur, autem
                minima. Deserunt illo ex nobis, harum, dolores nostrum aut
                tenetur eveniet eos dolorum nihil aliquam perferendis iure
                provident adipisci. Sit officiis nobis obcaecati blanditiis nisi
                qui quod reiciendis, enim alias quia, at veritatis velit
                pariatur ipsum sapiente optio adipisci ad autem quisquam est
                delectus inventore molestias earum? Dolores, delectus
                necessitatibus expedita, iusto modi quaerat consequuntur et
                nihil est quos nisi. Laboriosam quaerat veritatis perspiciatis
                nihil modi culpa, eligendi numquam? Nihil nemo numquam mollitia
                aspernatur, alias dolores unde laudantium itaque officiis beatae
                ipsa quis labore, sit adipisci placeat illum vel, error ea! Eum
                laborum excepturi est sed, non vitae qui recusandae officiis
                minus. Dolorum iusto sit blanditiis molestias placeat doloremque
                similique delectus maiores modi nam quae, ex nesciunt ut amet
                excepturi necessitatibus ratione quia non vero natus repellendus
                illum? Ex non dolor sapiente, similique illum impedit? Aliquam
                facilis consequuntur maiores, officiis nobis aperiam omnis
                ducimus commodi architecto nam eum rem, natus assumenda. Velit
                officiis quis magni quae at, nulla repellendus culpa sequi fuga
                necessitatibus iste repellat. Dolor earum voluptatem, accusamus
                possimus eveniet nemo aliquid dolorem voluptate a aperiam
                maiores iste atque molestias, id rem hic ipsam itaque sint neque
                obcaecati sequi illum debitis? Aut, enim. Animi quasi unde
                repellat numquam quos, exercitationem excepturi eligendi
                consequatur officiis adipisci. Minus asperiores natus unde
                ratione commodi a culpa minima accusamus doloribus, laboriosam
                vitae itaque quis quo illum cumque facere! Doloribus vero quo
                consequatur reprehenderit, ullam veritatis cupiditate quae aut
                cum! Dicta voluptas magni deleniti maiores libero cumque? Libero
                perspiciatis voluptatibus odit reiciendis sint officiis aliquam
                expedita accusamus quas. Praesentium, hic eos, magnam est et
                debitis vel sit fugiat iusto veniam facere sequi vitae, quia ut
                architecto eum odit. Pariatur veniam maiores veritatis velit
                omnis unde vel porro facere magni, cupiditate harum laboriosam
                laudantium ipsa, animi dolore incidunt impedit nemo perferendis
                itaque eum asperiores ipsum tempora necessitatibus accusamus. Id
                voluptate corrupti velit nisi earum nemo aperiam illo amet,
                perferendis pariatur doloribus, libero facilis laudantium error
                consectetur officia veritatis? Magnam pariatur, dolor ratione
                velit eaque eum corporis nobis nesciunt molestiae saepe veniam
                nemo ut adipisci voluptas repudiandae voluptatibus harum itaque
                labore. Praesentium odit provident, molestiae quis dignissimos
                at non pariatur ipsa. Error consequuntur quo cumque alias,
                expedita accusantium perferendis suscipit non et. Praesentium
                nisi officiis aspernatur tenetur, neque vitae rerum incidunt
                explicabo et nam? Rem est aspernatur minima consequatur
                voluptate corporis temporibus quidem natus unde ipsa nostrum
                voluptas doloremque cumque alias tempora voluptatem, error
                mollitia aut quos. Iure officiis sunt deleniti eum incidunt,
                aliquam quia? Ducimus velit maiores dolores ea molestias animi
                quo facere consequuntur ipsum vel. Eius architecto sequi ipsam
                veritatis, iste fugit corporis, id laborum mollitia laudantium
                voluptatum incidunt vero dolores atque nisi labore eos
                voluptates sit eveniet perferendis? Repellendus quisquam non
                illum, quibusdam commodi harum minus vel reprehenderit fuga at
                cupiditate facilis numquam. Amet facilis deleniti, facere fugit
                veritatis optio quasi officiis incidunt corrupti ab nemo,
                blanditiis suscipit illum harum sunt beatae numquam id, saepe
                voluptate! Inventore numquam eveniet aut, sed culpa hic eius
                vero illum sit animi accusamus deserunt velit, quod iure nisi
                amet nulla, cumque sint consequatur optio? Porro ipsam assumenda
                aperiam sint blanditiis corporis dolore dicta magni iusto non
                quod explicabo est vero architecto, iste molestiae. Aliquid
                adipisci, beatae ea esse vel dolores, nesciunt a aut ratione
                quam ducimus quod. Consequuntur dignissimos, dolor repellat,
                quia dolorum accusamus voluptas dolores itaque obcaecati
                voluptates, quae explicabo quibusdam ratione inventore
                perferendis a eveniet sit expedita porro quis earum officiis.
                Laborum, eius, maiores dolores ut accusamus perspiciatis, nulla
                asperiores natus recusandae in explicabo blanditiis dolorem
                ducimus voluptas nam? Temporibus provident eum aspernatur velit
                fuga nihil nesciunt explicabo. Doloremque expedita possimus et
                eum sed magnam, dolore ipsum maiores qui voluptatibus iusto! Ex
                quisquam tenetur harum unde obcaecati, voluptatem quibusdam
                fugit ducimus quo, sint vel minima iste suscipit quia
                repudiandae non quos inventore fugiat. Consequatur
                necessitatibus voluptatibus eum rerum tempore harum, in,
                nesciunt aperiam ratione dolorum sint fugiat, enim
                exercitationem officiis? Quasi odio nemo, amet similique quia
                illo corrupti ab quis quam fugit ratione perspiciatis dolore,
                tempora quisquam quaerat in adipisci. Sit obcaecati suscipit
                officiis quas nihil numquam tempore ipsa, similique aspernatur
                debitis! Blanditiis adipisci, recusandae saepe ad modi
                necessitatibus accusamus dicta perspiciatis! Ex dolorem amet,
                enim veritatis deserunt eligendi delectus perspiciatis
                reprehenderit atque beatae. Fuga cupiditate neque illo. Cum
                iusto magnam facere quaerat inventore repellendus ad voluptatem
                in. Et alias facilis corrupti, quaerat dicta ratione excepturi
                voluptates, libero quidem itaque, illum iste odio rem fugiat eum
                pariatur distinctio error ad accusantium voluptatum architecto
                delectus quos. Voluptatum quisquam dolor quam consectetur in
                modi. Quos amet ea esse hic eum doloribus cumque libero ipsum
                pariatur sed. Dolorum omnis blanditiis totam, nesciunt minima
                reiciendis repellat alias quibusdam porro distinctio
                necessitatibus eaque adipisci ipsa eius voluptate! Temporibus in
                doloribus illum quidem, tenetur aliquam minus voluptatibus! Et,
                saepe nihil. Obcaecati debitis excepturi animi iure quasi, fuga
                qui exercitationem aut nulla blanditiis vel libero rem dolore
                officia odio ut tempore, voluptatum ipsam autem itaque eaque
                omnis eum at cumque! Rerum, soluta esse fugit unde minima
                assumenda perferendis enim voluptatem consectetur impedit
                voluptas facere, praesentium eos.
              </Typography>
            </Grid>
          </Grid>
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
