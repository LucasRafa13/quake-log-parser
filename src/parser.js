function parseGamesLog(logContent) {
  const lines = logContent.split('\n')
  let games = {}
  let currentGame = null
  let gameCount = 0

  // Função auxiliar para inicializar um novo registro de jogo
  const initGame = () => ({
    total_kills: 0,
    players: new Set(), // usa set para evitar duplicatas
    kills: {},
    deaths: [],
  })

  for (let line of lines) {
    line = line.trim()
    if (!line) continue

    // Início de um jogo: geralmente indicado por "InitGame:" (case sensitive)
    if (line.includes('InitGame:')) {
      // se havia um jogo em andamento, finalize-o
      if (currentGame !== null) {
        if (currentGame.total_kills > 0 && currentGame.players.size > 0) {
          gameCount++
          // Converte players Set para Array
          currentGame.players = Array.from(currentGame.players)
          games[`game_${gameCount}`] = currentGame
        }
      }
      // inicia um novo jogo
      currentGame = initGame()
      continue
    }

    // Fim de um jogo: indicado por "ShutdownGame:"
    if (line.includes('ShutdownGame:')) {
      if (currentGame !== null) {
        if (currentGame.total_kills > 0 && currentGame.players.size > 0) {
          gameCount++
          // Finaliza o registro do jogo
          currentGame.players = Array.from(currentGame.players)
          games[`game_${gameCount}`] = currentGame
        }
        currentGame = null
      }
      continue
    }

    // Processa eventos de kill
    // Exemplo de linha: "21:42 Kill: 1022 2 22: <world> killed Isgalamido by MOD_TRIGGER_HURT"
    if (line.includes('Kill:')) {
      if (currentGame === null) {
        // se um evento de kill existir fora de um jogo, ignore-o
        continue
      }

      // Aumenta total_kills para cada evento de kill
      currentGame.total_kills++

      // Extrai horário, assassino e vítima.
      // Formato do evento de kill: <timestamp> Kill: <killerId> <victimId> <weaponCode>: <killer> killed <victim> by <weapon>
      const killRegex =
        /(\d+:\d+)\sKill:\s+\S+\s+\S+\s+\S+:\s+(.*?)\s+killed\s+(.*?)\s+by/
      const match = line.match(killRegex)
      if (!match) continue

      const time = match[1].trim()
      const killer = match[2].trim()
      const victim = match[3].trim()

      // Adiciona registro de morte ao jogo atual
      currentGame.deaths.push({ time, killer, victim })

      // Ignora a adição de <world> à lista de jogadores.
      if (killer !== '<world>') {
        currentGame.players.add(killer)
      }
      if (victim !== '<world>') {
        currentGame.players.add(victim)
      }

      // Inicializa contagens de kills se não existirem.
      if (killer !== '<world>') {
        if (!currentGame.kills[killer]) {
          currentGame.kills[killer] = 0
        }
      }
      if (victim !== '<world>') {
        if (!currentGame.kills[victim]) {
          currentGame.kills[victim] = 0
        }
      }

      // Lógica para kill:
      // Se o assassino for <world>, então decrementa a contagem de kills da vítima em 1.
      // Caso contrário, incrementa a contagem de kills do assassino.
      if (killer === '<world>') {
        // Certifica-se de que a vítima exista no dicionário e não permita kills negativas
        currentGame.kills[victim] = Math.max(
          (currentGame.kills[victim] || 0) - 1,
          0,
        )
      } else {
        currentGame.kills[killer] = currentGame.kills[killer] + 1
      }
    }
  }

  // Caso o arquivo de log não termine com um ShutdownGame:
  if (currentGame !== null) {
    if (currentGame.total_kills > 0 && currentGame.players.size > 0) {
      gameCount++
      currentGame.players = Array.from(currentGame.players)
      games[`game_${gameCount}`] = currentGame
    }
  }

  return games
}

module.exports = {
  parseGamesLog,
}
