# 🎮 Pucará Esports - CRUD Demo

Una página web simple para demostrar el funcionamiento del sistema CRUD de equipos y jugadores de Pucará Esports.

## 🚀 Cómo usar la demo

### 1. Iniciar el servidor

```bash
cd "d:\Pucara\crud-players-pucara"
npm run dev
```

### 2. Acceder a la demo

- **URL principal**: http://localhost:3333/
- **URL directa**: http://localhost:3333/index.html
- **URL demo**: http://localhost:3333/demo

### 3. Funcionalidades disponibles

#### 📋 Gestión de Equipos

- **Crear equipos**: Añade nuevos equipos con nombre, descripción y logros
- **Ver equipos**: Lista todos los equipos existentes
- **Eliminar equipos**: Borra equipos (y libera a sus jugadores)
- **Información detallada**: Ve la cantidad de jugadores por equipo

#### 👥 Gestión de Jugadores

- **Crear jugadores**: Añade nuevos jugadores con nombre, biografía, foto y estadísticas
- **Ver jugadores**: Lista todos los jugadores con su información
- **Asignar equipo**: Asigna jugadores a equipos existentes
- **Eliminar jugadores**: Borra jugadores del sistema
- **Filtrar jugadores**: Ve solo agentes libres o todos los jugadores

### 4. Estructura de datos

#### Equipos

```json
{
  "name": "Team Demo",
  "description": "Descripción del equipo",
  "achievements": {
    "Torneo 2024": "Campeón",
    "Liga Regional": "2do Lugar"
  }
}
```

#### Jugadores

```json
{
  "name": "NombreJugador",
  "team_id": "uuid-del-equipo-opcional",
  "bio": "Biografía del jugador",
  "photo_url": "https://example.com/photo.jpg",
  "stats": {
    "KDA": "5.2",
    "Role": "Mid",
    "Champion": "Yasuo"
  }
}
```

### 5. API Endpoints

La demo consume estos endpoints de la API REST:

#### Equipos

- `GET /api/v1/teams` - Listar equipos
- `POST /api/v1/teams` - Crear equipo
- `GET /api/v1/teams/:team_id` - Ver equipo específico
- `PATCH /api/v1/teams/:team_id` - Actualizar equipo
- `DELETE /api/v1/teams/:team_id` - Eliminar equipo

#### Jugadores

- `GET /api/v1/players` - Listar jugadores
- `POST /api/v1/players` - Crear jugador
- `GET /api/v1/players/:player_id` - Ver jugador específico
- `PATCH /api/v1/players/:player_id` - Actualizar jugador
- `DELETE /api/v1/players/:player_id` - Eliminar jugador
- `PATCH /api/v1/players/:player_id/assign-team` - Asignar equipo

### 6. Características de la UI

- **Diseño responsive** con Bootstrap 5
- **Interfaz de pestañas** para navegación fácil
- **Modales** para creación de equipos y jugadores
- **Notificaciones** de éxito y error
- **Validación** en tiempo real
- **Actualización automática** de listas tras operaciones

### 7. Tecnologías utilizadas

- **Backend**: AdonisJS 6
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Estilos**: Bootstrap 5
- **Iconos**: Bootstrap Icons
- **Base de datos**: MySQL (configurado con XAMPP)

### 8. Notas importantes

- La página requiere que el servidor AdonisJS esté ejecutándose
- Los datos se almacenan en la base de datos MySQL
- Los campos JSON (logros, estadísticas) son opcionales
- La validación está implementada tanto en frontend como backend
- Todas las operaciones son persistentes en la base de datos

¡Disfruta explorando el sistema CRUD de Pucará Esports! 🎮
