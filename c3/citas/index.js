const express = require('express')
const { Pool } = require('pg')
const { config } = require('./config')


/* const config = {
  user: 'postgres',
  host: 'localhost',
  database: 'citas',
  password: 'clave_basedato',
  port: 5432
} */

const port = 3000
const app = express()
const pool = new Pool(config)
app.use(express.static('public'))
app.use(express.urlencode())

app.post('/', (req, res) => {
  console.log(req.body)
  res.send('todo ok')
})

app.get('/', async (req, res) => {
  try {
    res.status(200).json({  })
  } catch (error) {
    console.log(error);
    return res.status(400).redirect('/')
  }
})

app.use((req, res) => {
  res.status(404).send(`
  <html>
    <h2>...ruta no existe</h2>
    <a href="/">
      <button>Volver</button>
    </a>
  </html>`)
})

app.listen(port, function () {
  console.log(`server running http://localhost:${port}/`)
})

// nodemon index
