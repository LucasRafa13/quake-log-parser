const app = require('./api')

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`API Quake Log Parser está rodando em http://localhost:${PORT}`)
})
