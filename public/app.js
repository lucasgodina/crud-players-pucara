// API Base URL
const API_BASE = '/api/v1'

// Global variables
let teams = []
let players = []

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  loadTeams()
  loadPlayers()

  // Load teams for player creation dropdown
  loadTeamsForDropdown()
})

// Utility functions
function showAlert(message, type = 'success') {
  const alertContainer = document.getElementById('alertContainer')
  const alert = document.createElement('div')
  alert.className = `alert alert-${type} alert-dismissible fade show`
  alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `
  alertContainer.appendChild(alert)

  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    if (alert.parentNode) {
      alert.remove()
    }
  }, 5000)
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Teams functions
async function loadTeams() {
  try {
    const response = await fetch(`${API_BASE}/teams`)
    const data = await response.json()

    if (data.success || Array.isArray(data)) {
      teams = data.data || data
      renderTeams()
    } else {
      showAlert('Error al cargar equipos: ' + (data.message || 'Error desconocido'), 'danger')
    }
  } catch (error) {
    showAlert('Error de conexión al cargar equipos', 'danger')
    console.error('Error loading teams:', error)
  }
}

function renderTeams() {
  const container = document.getElementById('teamsContainer')

  if (teams.length === 0) {
    container.innerHTML = `
            <div class="col-12">
                <div class="text-center py-5">
                    <i class="bi bi-people display-4 text-muted"></i>
                    <h5 class="mt-3 text-muted">No hay equipos registrados</h5>
                    <p class="text-muted">Crea tu primer equipo para comenzar</p>
                </div>
            </div>
        `
    return
  }

  container.innerHTML = teams
    .map(
      (team) => `
        <div class="col-md-6 col-lg-4 mb-3">
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">
                        <i class="bi bi-trophy text-warning"></i> ${team.name}
                    </h5>
                    <p class="card-text text-muted">
                        ${team.description || 'Sin descripción'}
                    </p>
                    ${
                      team.achievements
                        ? `
                        <div class="mb-2">
                            <small class="text-muted">Logros:</small>
                            <div class="mt-1">
                                ${Object.entries(team.achievements)
                                  .map(
                                    ([key, value]) =>
                                      `<span class="badge bg-success me-1">${key}: ${value}</span>`
                                  )
                                  .join('')}
                            </div>
                        </div>
                    `
                        : ''
                    }
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">
                            <i class="bi bi-calendar"></i> ${formatDate(team.createdAt)}
                        </small>
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-primary" onclick="viewTeam('${team.teamId}')">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn btn-outline-danger" onclick="deleteTeam('${team.teamId}', '${team.name}')">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
    )
    .join('')
}

async function viewTeam(teamId) {
  try {
    const response = await fetch(`${API_BASE}/teams/${teamId}`)
    const data = await response.json()

    if (data.success || data.teamId) {
      const team = data.data || data
      const playersHtml =
        team.players && team.players.length > 0
          ? team.players
              .map(
                (player) => `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        ${player.name}
                        <span class="badge bg-primary rounded-pill">${player.bio || 'Sin bio'}</span>
                    </li>
                `
              )
              .join('')
          : '<li class="list-group-item text-muted">No hay jugadores en este equipo</li>'

      showAlert(
        `
                <h5><i class="bi bi-trophy"></i> ${team.name}</h5>
                <p><strong>Descripción:</strong> ${team.description || 'Sin descripción'}</p>
                ${team.achievements ? `<p><strong>Logros:</strong> ${JSON.stringify(team.achievements, null, 2)}</p>` : ''}
                <p><strong>Jugadores:</strong></p>
                <ul class="list-group">
                    ${playersHtml}
                </ul>
            `,
        'info'
      )
    }
  } catch (error) {
    showAlert('Error al cargar los detalles del equipo', 'danger')
  }
}

async function deleteTeam(teamId, teamName) {
  if (!confirm(`¿Estás seguro de que quieres eliminar el equipo "${teamName}"?`)) {
    return
  }

  try {
    const response = await fetch(`${API_BASE}/teams/${teamId}`, {
      method: 'DELETE',
    })

    const data = await response.json()

    if (response.ok) {
      showAlert(data.message || `Equipo "${teamName}" eliminado exitosamente`)
      loadTeams()
      loadPlayers() // Reload players as they might be affected
      loadTeamsForDropdown()
    } else {
      showAlert(data.message || 'Error al eliminar el equipo', 'danger')
    }
  } catch (error) {
    showAlert('Error de conexión al eliminar el equipo', 'danger')
  }
}

function showCreateTeamModal() {
  document.getElementById('teamForm').reset()
  new bootstrap.Modal(document.getElementById('createTeamModal')).show()
}

async function createTeam() {
  const name = document.getElementById('teamName').value.trim()
  const description = document.getElementById('teamDescription').value.trim()
  const achievementsText = document.getElementById('teamAchievements').value.trim()

  if (!name) {
    showAlert('El nombre del equipo es obligatorio', 'danger')
    return
  }

  let achievements = null
  if (achievementsText) {
    try {
      achievements = JSON.parse(achievementsText)
    } catch (error) {
      showAlert('El formato de logros debe ser JSON válido', 'danger')
      return
    }
  }

  try {
    const response = await fetch(`${API_BASE}/teams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description: description || null,
        achievements,
      }),
    })

    const data = await response.json()

    if (response.ok) {
      showAlert(data.message || `Equipo "${name}" creado exitosamente`)
      bootstrap.Modal.getInstance(document.getElementById('createTeamModal')).hide()
      loadTeams()
      loadTeamsForDropdown()
    } else {
      showAlert(data.message || 'Error al crear el equipo', 'danger')
    }
  } catch (error) {
    showAlert('Error de conexión al crear el equipo', 'danger')
  }
}

// Players functions
async function loadPlayers(filter = 'all') {
  try {
    let url = `${API_BASE}/players`
    if (filter === 'free') {
      url += '?isFreeAgent=true'
    }

    const response = await fetch(url)
    const data = await response.json()

    if (data.success || Array.isArray(data)) {
      players = data.data || data
      renderPlayers()
    } else {
      showAlert('Error al cargar jugadores: ' + (data.message || 'Error desconocido'), 'danger')
    }
  } catch (error) {
    showAlert('Error de conexión al cargar jugadores', 'danger')
    console.error('Error loading players:', error)
  }
}

function renderPlayers() {
  const container = document.getElementById('playersContainer')

  if (players.length === 0) {
    container.innerHTML = `
            <div class="col-12">
                <div class="text-center py-5">
                    <i class="bi bi-person display-4 text-muted"></i>
                    <h5 class="mt-3 text-muted">No hay jugadores registrados</h5>
                    <p class="text-muted">Crea tu primer jugador para comenzar</p>
                </div>
            </div>
        `
    return
  }

  container.innerHTML = players
    .map(
      (player) => `
        <div class="col-md-6 col-lg-4 mb-3">
            <div class="card h-100 player-card">
                <div class="card-body">
                    <div class="d-flex align-items-center mb-3">
                        ${
                          player.photoUrl
                            ? `<img src="${player.photoUrl}" class="rounded-circle me-3" width="50" height="50" alt="${player.name}">`
                            : `<div class="bg-secondary rounded-circle me-3 d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                                <i class="bi bi-person text-white"></i>
                            </div>`
                        }
                        <div>
                            <h5 class="card-title mb-1">${player.name}</h5>
                            ${
                              player.teamId
                                ? `<span class="team-badge">${player.team ? player.team.name : 'Equipo'}</span>`
                                : `<span class="free-agent-badge">Agente Libre</span>`
                            }
                        </div>
                    </div>
                    <p class="card-text text-muted">
                        ${player.bio || 'Sin biografía'}
                    </p>
                    ${
                      player.stats
                        ? `
                        <div class="mb-2">
                            <small class="text-muted">Estadísticas:</small>
                            <div class="mt-1">
                                ${Object.entries(player.stats)
                                  .map(
                                    ([key, value]) =>
                                      `<small class="badge bg-info me-1">${key}: ${value}</small>`
                                  )
                                  .join('')}
                            </div>
                        </div>
                    `
                        : ''
                    }
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">
                            <i class="bi bi-calendar"></i> ${formatDate(player.createdAt)}
                        </small>
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-warning" onclick="reassignPlayer('${player.playerId}', '${player.name}')">
                                <i class="bi bi-arrow-repeat"></i>
                            </button>
                            <button class="btn btn-outline-danger" onclick="deletePlayer('${player.playerId}', '${player.name}')">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
    )
    .join('')
}

async function deletePlayer(playerId, playerName) {
  if (!confirm(`¿Estás seguro de que quieres eliminar al jugador "${playerName}"?`)) {
    return
  }

  try {
    const response = await fetch(`${API_BASE}/players/${playerId}`, {
      method: 'DELETE',
    })

    const data = await response.json()

    if (response.ok) {
      showAlert(data.message || `Jugador "${playerName}" eliminado exitosamente`)
      loadPlayers()
    } else {
      showAlert(data.message || 'Error al eliminar el jugador', 'danger')
    }
  } catch (error) {
    showAlert('Error de conexión al eliminar el jugador', 'danger')
  }
}

async function reassignPlayer(playerId, playerName) {
  const teamId = prompt(`Ingresa el ID del equipo para "${playerName}" (deja vacío para liberar):`)

  try {
    const response = await fetch(`${API_BASE}/players/${playerId}/assign-team`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        team_id: teamId || null,
      }),
    })

    const data = await response.json()

    if (response.ok) {
      showAlert(data.message || `Jugador "${playerName}" reasignado exitosamente`)
      loadPlayers()
    } else {
      showAlert(data.message || 'Error al reasignar el jugador', 'danger')
    }
  } catch (error) {
    showAlert('Error de conexión al reasignar el jugador', 'danger')
  }
}

function filterPlayers(filter) {
  loadPlayers(filter)
}

function showCreatePlayerModal() {
  document.getElementById('playerForm').reset()
  new bootstrap.Modal(document.getElementById('createPlayerModal')).show()
}

async function createPlayer() {
  const name = document.getElementById('playerName').value.trim()
  const teamId = document.getElementById('playerTeam').value
  const bio = document.getElementById('playerBio').value.trim()
  const photoUrl = document.getElementById('playerPhotoUrl').value.trim()
  const statsText = document.getElementById('playerStats').value.trim()

  if (!name) {
    showAlert('El nombre del jugador es obligatorio', 'danger')
    return
  }

  let stats = null
  if (statsText) {
    try {
      stats = JSON.parse(statsText)
    } catch (error) {
      showAlert('El formato de estadísticas debe ser JSON válido', 'danger')
      return
    }
  }

  try {
    const response = await fetch(`${API_BASE}/players`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        team_id: teamId || null,
        bio: bio || null,
        photo_url: photoUrl || null,
        stats,
      }),
    })

    const data = await response.json()

    if (response.ok) {
      showAlert(data.message || `Jugador "${name}" creado exitosamente`)
      bootstrap.Modal.getInstance(document.getElementById('createPlayerModal')).hide()
      loadPlayers()
    } else {
      showAlert(data.message || 'Error al crear el jugador', 'danger')
    }
  } catch (error) {
    showAlert('Error de conexión al crear el jugador', 'danger')
  }
}

async function loadTeamsForDropdown() {
  try {
    const response = await fetch(`${API_BASE}/teams`)
    const data = await response.json()

    if (data.success || Array.isArray(data)) {
      const teams = data.data || data
      const select = document.getElementById('playerTeam')

      // Clear existing options except the first one
      select.innerHTML = '<option value="">Sin equipo (Agente Libre)</option>'

      teams.forEach((team) => {
        const option = document.createElement('option')
        option.value = team.teamId
        option.textContent = team.name
        select.appendChild(option)
      })
    }
  } catch (error) {
    console.error('Error loading teams for dropdown:', error)
  }
}
