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
      main: '#EA601A', // Naranja primario
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#004B6C', // Azul secundario
      contrastText: '#ffffff',
    },
    error: {
      main: '#6D237D', // Morado como color de error/acento
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000', // Negro primario
      secondary: '#4D4D4D', // Gris secundario
    },
  },
  typography: {
    fontFamily: '"Ubuntu", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    h1: {
      fontWeight: 700, // Ubuntu Bold
      fontFamily: '"Ubuntu", sans-serif',
    },
    h2: {
      fontWeight: 700, // Ubuntu Bold
      fontFamily: '"Ubuntu", sans-serif',
    },
    h3: {
      fontWeight: 700, // Ubuntu Bold
      fontFamily: '"Ubuntu", sans-serif',
    },
    h4: {
      fontWeight: 700, // Ubuntu Bold
      fontFamily: '"Ubuntu", sans-serif',
    },
    h5: {
      fontWeight: 400, // Ubuntu Regular
      fontFamily: '"Ubuntu", sans-serif',
    },
    h6: {
      fontWeight: 400, // Ubuntu Regular
      fontFamily: '"Ubuntu", sans-serif',
    },
    body1: {
      fontWeight: 400, // Ubuntu Regular
      fontFamily: '"Ubuntu", sans-serif',
    },
    body2: {
      fontWeight: 300, // Ubuntu Light
      fontFamily: '"Ubuntu", sans-serif',
    },
    button: {
      fontWeight: 400, // Ubuntu Regular
      fontFamily: '"Ubuntu", sans-serif',
      textTransform: 'none',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#EA601A',
          color: '#ffffff',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          border: '1px solid #f0f0f0',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: 400,
          textTransform: 'none',
        },
        containedPrimary: {
          backgroundColor: '#EA601A',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#d55419',
          },
        },
        containedSecondary: {
          backgroundColor: '#004B6C',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#003a56',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"Ubuntu", sans-serif',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#004B6C',
          color: '#ffffff',
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontFamily: '"Ubuntu", sans-serif',
          fontWeight: 400,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#e0e0e0',
            },
            '&:hover fieldset': {
              borderColor: '#EA601A',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#EA601A',
            },
          },
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
