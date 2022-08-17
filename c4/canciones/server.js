const express = require('express')
const { nuevaCancion, mostrarCanciones, eliminarCancion, actualizarCancion } = require('./db.js')
const f = require('./functionsUtils')

const app = express()
const port = 3000

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))


app.post('/cancion', async (req, res) => {
  const form = await f.getForm(req)

  await nuevaCancion(form.cancion, form.artista, form.tono)
  res.redirect('/')
})

app.get('/canciones', async (req, res) => {

  try {
    const canciones = await mostrarCanciones()
    res.json(canciones)

  } catch (error) {
    console.log(error)
  }
})

app.delete('/:cancionId', async (req, res) => {
  const id = req.query.id

  if (id) {
    try {

      await eliminarCancion(id)
      res.end()


    } catch (error) {
      console.log(error)
      return res.redirect('/')
    }
  }
})

app.put('/cancion', async (req, res) => {
  const form = await f.getForm(req)

  try {
    await actualizarCancion(form.id, form.cancion, form.artista, form.tono)
    res.end()


  } catch (error) {
    console.log(error)
    return res.redirect('/')
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
  console.log(`http://localhost:${port}`)
})

// nodemon server
