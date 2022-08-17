const express = require('express')
const { nuevaCita, mostrarCitas, deleteCita, editarCita } = require('./db.js')
const port = 3000
const app = express()
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.post('/quotes', async (req, res) => {
  try {    
    await nuevaCita(req.body.nombre, req.body.quote)
    res.redirect('/')
  } catch (error) {
    console.log(error)
  }
})
app.get('/quotes', async (req, res) => {
  try {
    const citas = await mostrarCitas()
    res.json(citas)
  } catch (error) {
    console.log(error)
  }
})
app.delete('/quotes', async (req, res) => {
  console.log('delete /quotes')
  const id = req.query.id
  if (id) {
    try {
      const citas = await deleteCita(id)
      res.json(citas)
    } catch (error) {
      console.log(error)
    }
  }  
})

app.post('/quotes/edit', async (req, res) => {
  console.log(req.body);
  await editarCita(req.body.id, req.body.nombre, req.body.cita)
  res.redirect('/')
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
