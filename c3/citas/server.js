const express = require('express')
const { nuevaCita, mostrarCitas } = require('./db.js')

const port = 3000
const app = express()

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.post('/citas', async (req, res) => {
  await nuevaCita(req.body.nombre, req.body.quote)
  res.redirect('/')

})

app.get('/citas', async (req, res) => {

  try {
    const citas = await mostrarCitas()
    // res.status(200).json({ citas })
    // res.status(200).json( citas )
    res.json(citas)
  } catch (error) {
    console.log(error)
    //return res.status(400).redirect('/')
  }
})

app.use((req, res) => {
  // res.statusCode = 404
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

// nodemon server
