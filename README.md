# Quake Log Parser

Este projeto analisa o arquivo `games.log` do servidor Quake 3 Arena e expõe uma API RESTful que retorna um relatório para cada jogo.

## Funcionalidades

- Analisa um arquivo de log gerado pelo servidor Quake 3 Arena.
- Agrupa eventos por jogo (usando `InitGame:` para iniciar e `ShutdownGame:` para terminar um jogo).
- Agrega estatísticas do jogo incluindo:
  - Kills totais (inclui todas as mortes, até mesmo as causadas por `<world>`)
  - Jogadores (lista de jogadores, excluindo `<world>`)
  - Contagem de kills por jogador (quando `<world>` mata um jogador, esse jogador perde um kill)
- Exposição de um endpoint da API REST para consultar os relatórios dos jogos.

## Requisitos

- Node.js instalado (v14 ou posterior)
- npm

## Configuração e Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/LucasRafa13/quake-log-parser.git
   cd quake-log-parser
   ```
2. Instale as dependências:
   ```bash
    npm install
   ```
3. Inicie o servidor:
   ```bash
   npm start
   ```
4. Acesse a API em `http://localhost:3000/games`

## Endpoints

### GET /games

Retorna um array de objetos com os relatórios de cada jogo.

#### Exemplo de resposta

```json
[
  {
    "game": 1,
    "total_kills": 0,
    "players": [],
    "kills": {}
  },
  {
    "game": 2,
    "total_kills": 4,
    "players": ["Isgalamido", "Mocinha"],
    "kills": {
      "Isgalamido": 1,
      "Mocinha": 0
    }
  }
]
```

### GET /refresh

Atualiza o relatório dos jogos.

## Testes

Para executar os testes, utilize o comando:

```bash
npm test
```
