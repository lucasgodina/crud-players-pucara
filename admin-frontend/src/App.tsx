import React from 'react'
import { Admin, Resource } from 'react-admin'
import { createTheme } from '@mui/material/styles'
import {
  Groups as TeamsIcon,
  Person as PlayersIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material'

import { dataProvider } from './dataProvider'
import { Dashboard } from './Dashboard'
import { TeamList, TeamCreate, TeamEdit, TeamShow } from './teams'
import { PlayerList, PlayerCreate, PlayerEdit, PlayerShow } from './players'

// Tema personalizado para Pucará Esports
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h4: {
      fontWeight: 'bold',
    },
    h6: {
      fontWeight: 'bold',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
  },
})

function App() {
  return (
    <Admin
      dataProvider={dataProvider}
      theme={theme}
      title="Pucará Esports Admin"
      dashboard={Dashboard}
    >
      <Resource
        name="teams"
        list={TeamList}
        create={TeamCreate}
        edit={TeamEdit}
        show={TeamShow}
        icon={TeamsIcon}
        options={{ label: 'Equipos' }}
      />
      <Resource
        name="players"
        list={PlayerList}
        create={PlayerCreate}
        edit={PlayerEdit}
        show={PlayerShow}
        icon={PlayersIcon}
        options={{ label: 'Jugadores' }}
      />
    </Admin>
  )
}

export default App
