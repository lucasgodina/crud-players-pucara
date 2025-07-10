import React from 'react'
import {
  List,
  Datagrid,
  TextField,
  DateField,
  Create,
  SimpleForm,
  TextInput,
  Edit,
  Show,
  SimpleShowLayout,
  ReferenceField,
  ReferenceInput,
  SelectInput,
  FunctionField,
  DeleteButton,
  EditButton,
  ShowButton,
  CreateButton,
  TopToolbar,
  ExportButton,
  ImageField,
  UrlField,
} from 'react-admin'
import { Card, CardContent, Typography, Chip, Avatar } from '@mui/material'

// Componente personalizado para mostrar estadísticas
const StatsField = ({ record }: { record?: any }) => {
  if (!record?.stats) return <span>-</span>

  const stats = typeof record.stats === 'string' ? JSON.parse(record.stats) : record.stats

  return (
    <div>
      {Object.entries(stats).map(([key, value]: [string, any]) => (
        <Chip
          key={key}
          label={`${key}: ${value}`}
          size="small"
          style={{ margin: '2px' }}
          color="secondary"
          variant="outlined"
        />
      ))}
    </div>
  )
}

// Componente para mostrar foto del jugador
const PlayerAvatar = ({ record }: { record?: any }) => {
  if (!record?.photoUrl) {
    return (
      <Avatar sx={{ bgcolor: 'primary.main' }}>
        {record?.name?.charAt(0)?.toUpperCase() || '?'}
      </Avatar>
    )
  }

  return (
    <Avatar src={record.photoUrl} alt={record.name}>
      {record?.name?.charAt(0)?.toUpperCase() || '?'}
    </Avatar>
  )
}

// Componente para mostrar equipo o "Agente Libre"
const TeamDisplay = ({ record }: { record?: any }) => {
  if (!record?.teamId) {
    return <Chip label="Agente Libre" color="default" variant="outlined" size="small" />
  }

  return (
    <ReferenceField source="teamId" reference="teams" link="show">
      <TextField source="name" />
    </ReferenceField>
  )
}

// Lista de jugadores
export const PlayerList = () => (
  <List
    actions={
      <TopToolbar>
        <CreateButton />
        <ExportButton />
      </TopToolbar>
    }
  >
    <Datagrid>
      <FunctionField label="Foto" render={(record: any) => <PlayerAvatar record={record} />} />
      <TextField source="name" label="Nombre" />
      <FunctionField label="Equipo" render={(record: any) => <TeamDisplay record={record} />} />
      <TextField source="bio" label="Biografía" />
      <FunctionField
        label="Estadísticas"
        render={(record: any) => <StatsField record={record} />}
      />
      <DateField source="createdAt" label="Creado" showTime />
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
)

// Formulario de creación de jugadores
export const PlayerCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" label="Nombre del Jugador" required fullWidth />
      <ReferenceInput source="teamId" reference="teams" label="Equipo">
        <SelectInput optionText="name" optionValue="teamId" emptyText="Sin equipo (Agente Libre)" />
      </ReferenceInput>
      <TextInput source="bio" label="Biografía" multiline rows={3} fullWidth />
      <TextInput source="photoUrl" label="URL de Foto" type="url" fullWidth />
      <TextInput
        source="stats"
        label="Estadísticas (JSON)"
        helperText='Ejemplo: {"KDA": "5.2", "Role": "Mid", "Champion": "Yasuo"}'
        multiline
        rows={3}
        fullWidth
        parse={(value) => {
          if (!value) return null
          try {
            return JSON.parse(value)
          } catch {
            return value
          }
        }}
        format={(value) => {
          if (!value) return ''
          if (typeof value === 'string') return value
          return JSON.stringify(value, null, 2)
        }}
      />
    </SimpleForm>
  </Create>
)

// Formulario de edición de jugadores
export const PlayerEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" label="Nombre del Jugador" required fullWidth />
      <ReferenceInput source="teamId" reference="teams" label="Equipo">
        <SelectInput optionText="name" optionValue="teamId" emptyText="Sin equipo (Agente Libre)" />
      </ReferenceInput>
      <TextInput source="bio" label="Biografía" multiline rows={3} fullWidth />
      <TextInput source="photoUrl" label="URL de Foto" type="url" fullWidth />
      <TextInput
        source="stats"
        label="Estadísticas (JSON)"
        helperText='Ejemplo: {"KDA": "5.2", "Role": "Mid", "Champion": "Yasuo"}'
        multiline
        rows={3}
        fullWidth
        parse={(value) => {
          if (!value) return null
          try {
            return JSON.parse(value)
          } catch {
            return value
          }
        }}
        format={(value) => {
          if (!value) return ''
          if (typeof value === 'string') return value
          return JSON.stringify(value, null, 2)
        }}
      />
    </SimpleForm>
  </Edit>
)

// Vista detallada de jugadores
export const PlayerShow = () => (
  <Show>
    <SimpleShowLayout>
      <FunctionField label="Foto" render={(record: any) => <PlayerAvatar record={record} />} />
      <TextField source="name" label="Nombre" />
      <FunctionField label="Equipo" render={(record: any) => <TeamDisplay record={record} />} />
      <TextField source="bio" label="Biografía" />
      {/* <UrlField source="photoUrl" label="URL de Foto" /> */}
      <FunctionField
        label="Estadísticas"
        render={(record: any) => <StatsField record={record} />}
      />
      <DateField source="createdAt" label="Creado" showTime />
      <DateField source="updatedAt" label="Actualizado" showTime />
    </SimpleShowLayout>
  </Show>
)
