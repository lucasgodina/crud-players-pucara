import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Player from './player.js'

export default class Team extends BaseModel {
  @column({ isPrimary: true })
  declare id: string // Assuming id is a UUID

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare achievements: Record<string, string> | null

  @hasMany(() => Player)
  declare players: HasMany<typeof Player>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
