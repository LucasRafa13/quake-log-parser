const { parseGamesLog } = require('../src/parser')
const fs = require('fs')
const path = require('path')

describe('parseGamesLog', () => {
  it('should parse a log with a single game correctly', () => {
    const logContent = `
      0:00 InitGame:
      0:25 Kill: 1022 2 22: <world> killed Isgalamido by MOD_TRIGGER_HURT
      1:00 ShutdownGame:
    `
    const result = parseGamesLog(logContent)
    expect(result).toEqual({
      game_1: {
        total_kills: 1,
        players: ['Isgalamido'],
        kills: { Isgalamido: 0 },
        deaths: [{ time: '0:25', killer: '<world>', victim: 'Isgalamido' }],
      },
    })
  })

  it('should parse a log with multiple games correctly', () => {
    const logContent = `
      0:00 InitGame:
      0:25 Kill: 1022 2 22: <world> killed Isgalamido by MOD_TRIGGER_HURT
      1:00 ShutdownGame:
      1:30 InitGame:
      1:45 Kill: 2 3 7: Isgalamido killed Dono by MOD_ROCKET
      2:00 ShutdownGame:
    `
    const result = parseGamesLog(logContent)
    expect(result).toEqual({
      game_1: {
        total_kills: 1,
        players: ['Isgalamido'],
        kills: { Isgalamido: 0 },
        deaths: [{ time: '0:25', killer: '<world>', victim: 'Isgalamido' }],
      },
      game_2: {
        total_kills: 1,
        players: ['Isgalamido', 'Dono'],
        kills: { Isgalamido: 1, Dono: 0 },
        deaths: [{ time: '1:45', killer: 'Isgalamido', victim: 'Dono' }],
      },
    })
  })

  it('should handle logs without ShutdownGame correctly', () => {
    const logContent = `
      0:00 InitGame:
      0:25 Kill: 1022 2 22: <world> killed Isgalamido by MOD_TRIGGER_HURT
    `
    const result = parseGamesLog(logContent)
    expect(result).toEqual({
      game_1: {
        total_kills: 1,
        players: ['Isgalamido'],
        kills: { Isgalamido: 0 },
        deaths: [{ time: '0:25', killer: '<world>', victim: 'Isgalamido' }],
      },
    })
  })

  it('should handle logs with multiple kills correctly', () => {
    const logContent = `
      0:00 InitGame:
      0:25 Kill: 1022 2 22: <world> killed Isgalamido by MOD_TRIGGER_HURT
      0:45 Kill: 2 3 7: Isgalamido killed Dono by MOD_ROCKET
      1:00 ShutdownGame:
    `
    const result = parseGamesLog(logContent)
    expect(result).toEqual({
      game_1: {
        total_kills: 2,
        players: ['Isgalamido', 'Dono'],
        kills: { Isgalamido: 1, Dono: 0 },
        deaths: [
          { time: '0:25', killer: '<world>', victim: 'Isgalamido' },
          { time: '0:45', killer: 'Isgalamido', victim: 'Dono' },
        ],
      },
    })
  })

  it('should handle logs with no kills correctly', () => {
    const logContent = `
      0:00 InitGame:
      1:00 ShutdownGame:
    `
    const result = parseGamesLog(logContent)
    expect(result).toEqual({})
  })

  it('should handle logs with multiple players correctly', () => {
    const logContent = `
      0:00 InitGame:
      0:25 Kill: 2 3 7: Isgalamido killed Dono by MOD_ROCKET
      0:45 Kill: 3 4 7: Dono killed Mocinha by MOD_ROCKET
      1:00 ShutdownGame:
    `
    const result = parseGamesLog(logContent)
    expect(result).toEqual({
      game_1: {
        total_kills: 2,
        players: ['Isgalamido', 'Dono', 'Mocinha'],
        kills: { Isgalamido: 1, Dono: 1, Mocinha: 0 },
        deaths: [
          { time: '0:25', killer: 'Isgalamido', victim: 'Dono' },
          { time: '0:45', killer: 'Dono', victim: 'Mocinha' },
        ],
      },
    })
  })
})
