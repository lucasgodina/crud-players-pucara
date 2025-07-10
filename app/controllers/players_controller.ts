import type { HttpContext } from '@adonisjs/core/http'
import Player from '#models/player'
import Team from '#models/team'
import { v4 as uuidv4 } from 'uuid'

export default class PlayersController {
  /**
   * GET /api/v1/players
   * Display a list of all players with optional filters
   */
  async index({ request, response }: HttpContext) {
    try {
      const teamId = request.input('teamId')
      const isFreeAgent = request.input('isFreeAgent')

      let query = Player.query().preload('team')

      // Filter by free agents (no team)
      if (isFreeAgent === true || isFreeAgent === 'true') {
        query = query.whereNull('team_id')
      }
      // Filter by team ID (only if not filtering free agents)
      else if (teamId) {
        query = query.where('team_id', teamId)
      }

      const players = await query
      return response.ok(players)
    } catch (error) {
      return response.internalServerError({
        message: 'Error al obtener los jugadores',
        code: 'INTERNAL_ERROR',
      })
    }
  }

  /**
   * POST /api/v1/players
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['name', 'team_id', 'bio', 'stats', 'photo_url'])

      // Validate required fields
      if (!data.name) {
        return response.badRequest({
          message: 'El campo name es obligatorio',
          code: 'VALIDATION_ERROR',
        })
      }

      // Validate team exists if team_id is provided
      if (data.team_id) {
        const team = await Team.findBy('team_id', data.team_id)
        if (!team) {
          return response.notFound({
            message: `El equipo con ID '${data.team_id}' no existe. El jugador se creará como libre`,
            code: 'TEAM_NOT_FOUND',
          })
        }
      }

      // Create player with UUID
      const player = new Player()
      player.playerId = uuidv4()
      player.name = data.name
      player.teamId = data.team_id || null
      player.bio = data.bio || null
      player.stats = data.stats || null
      player.photoUrl = data.photo_url || null

      await player.save()

      // Load team relation if exists
      await player.load('team')

      return response.created(player)
    } catch (error) {
      return response.internalServerError({
        message: 'Error al crear el jugador',
        code: 'INTERNAL_ERROR',
      })
    }
  }

  /**
   * GET /api/v1/players/:player_id
   * Show individual player
   */
  async show({ params, response }: HttpContext) {
    try {
      const player = await Player.query()
        .where('player_id', params.player_id)
        .preload('team')
        .first()

      if (!player) {
        return response.notFound({
          message: `El jugador con ID '${params.player_id}' no fue encontrado`,
          code: 'NOT_FOUND',
        })
      }

      return response.ok(player)
    } catch (error) {
      return response.internalServerError({
        message: 'Error al obtener el jugador',
        code: 'INTERNAL_ERROR',
      })
    }
  }

  /**
   * PATCH /api/v1/players/:player_id
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const player = await Player.findBy('player_id', params.player_id)

      if (!player) {
        return response.notFound({
          message: `El jugador con ID '${params.player_id}' no fue encontrado`,
          code: 'NOT_FOUND',
        })
      }

      const data = request.only(['name', 'team_id', 'bio', 'stats', 'photo_url'])

      // Validate team exists if team_id is provided (and not null)
      if (data.team_id !== undefined && data.team_id !== null) {
        const team = await Team.findBy('team_id', data.team_id)
        if (!team) {
          return response.notFound({
            message: `El equipo con ID '${data.team_id}' no existe`,
            code: 'TEAM_NOT_FOUND',
          })
        }
      }

      // Update only provided fields
      if (data.name !== undefined) player.name = data.name
      if (data.team_id !== undefined) player.teamId = data.team_id
      if (data.bio !== undefined) player.bio = data.bio
      if (data.stats !== undefined) player.stats = data.stats
      if (data.photo_url !== undefined) player.photoUrl = data.photo_url

      await player.save()

      // Load team relation
      await player.load('team')

      return response.ok(player)
    } catch (error) {
      return response.internalServerError({
        message: 'Error al actualizar el jugador',
        code: 'INTERNAL_ERROR',
      })
    }
  }

  /**
   * DELETE /api/v1/players/:player_id
   * Delete player
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const player = await Player.findBy('player_id', params.player_id)

      if (!player) {
        return response.notFound({
          message: `El jugador con ID '${params.player_id}' no fue encontrado`,
          code: 'NOT_FOUND',
        })
      }

      await player.delete()

      return response.ok({
        message: `El jugador '${player.name}' ha sido eliminado exitosamente`,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error al eliminar el jugador',
        code: 'INTERNAL_ERROR',
      })
    }
  }

  /**
   * PATCH /api/v1/players/:player_id/assign-team
   * Assign or reassign player to a team
   */
  async assignTeam({ params, request, response }: HttpContext) {
    try {
      const player = await Player.findBy('player_id', params.player_id)

      if (!player) {
        return response.notFound({
          message: `El jugador con ID '${params.player_id}' no fue encontrado`,
          code: 'NOT_FOUND',
        })
      }

      const { team_id } = request.only(['team_id'])

      // Validate team exists if team_id is not null
      if (team_id !== null) {
        const team = await Team.findBy('team_id', team_id)
        if (!team) {
          return response.notFound({
            message: `El equipo con ID '${team_id}' no existe`,
            code: 'TEAM_NOT_FOUND',
          })
        }
      }

      // Update player's team
      player.teamId = team_id
      await player.save()

      // Load team relation
      await player.load('team')

      const action = team_id ? 'asignado al equipo' : 'liberado del equipo'

      return response.ok({
        ...player.toJSON(),
        message: `El jugador '${player.name}' ha sido ${action} exitosamente`,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error al asignar el jugador al equipo',
        code: 'INTERNAL_ERROR',
      })
    }
  }
}
