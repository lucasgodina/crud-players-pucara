import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Team from './team.js'

export default class Player extends BaseModel {
  @column({ isPrimary: true })
  declare id: string // Assuming id is a UUID

  @column()
  declare name: string

  @column()
  declare bio: string | null

  @column()
  declare stats: Record<string, string> | null

  @column()
  declare photoUrl: string | null

  @column()
  declare teamId: string | null

  @belongsTo(() => Team)
  declare team: BelongsTo<typeof Team>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
