const express = require('express')
const fs = require('fs')
const path = require('path')
const { parseGamesLog } = require('./parser')

const app = express()
const PORT = process.env.PORT || 3000

// Caminho para o arquivo games.log; ajuste conforme necessário.
const LOG_FILE_PATH = path.join(__dirname, '../logs', 'games.log')

let gamesReport = {}

// Carrega e analisa o arquivo de log.
function loadLogReport() {
  try {
    const fileContent = fs.readFileSync(LOG_FILE_PATH, 'utf8')
    gamesReport = parseGamesLog(fileContent)
  } catch (err) {
    console.error('Erro ao ler ou analisar o arquivo games.log:', err)
    gamesReport = {}
  }
}

// Carrega o relatório na inicialização do servidor.
loadLogReport()

// Fornece um endpoint RESTful para consultar relatórios de jogos.
app.get('/games', (req, res) => {
  if (Object.keys(gamesReport).length === 0) {
    return res
      .status(500)
      .json({ message: 'Erro ao ler ou analisar o arquivo games.log' })
  }
  res.json(gamesReport)
})

// Exponha um endpoint de atualização para recarregar o arquivo de log (opcional)
// Útil quando o arquivo de log é atualizado.
app.get('/refresh', (req, res) => {
  loadLogReport()
  if (Object.keys(gamesReport).length === 0) {
    return res
      .status(500)
      .json({ message: 'Erro ao ler ou analisar o arquivo games.log' })
  }
  res.json({ message: 'Arquivo de log recarregado', games: gamesReport })
})

module.exports = app
