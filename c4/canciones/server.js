const express = require('express')
const { nuevaCancion, mostrarCanciones, eliminarCancion } = require('./db.js')
const f = require('./functionsUtils')

const app = express()
const port = 3000

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))


app.post('/cancion', async (req, res) => { // ok
  console.log('app.post /cancion')
  const form = await f.getForm(req)

  await nuevaCancion(form.cancion, form.artista, form.tono)
  console.log(form.cancion, form.artista, form.tono)
  res.redirect('/')
})

app.get('/canciones', async (req, res) => {
  // res.json([]) // array vacio por mientras
  
  console.log('app.get /canciones') // ok
  
  try {
    const canciones = await mostrarCanciones()
    // res.status(200).json({ canciones })
    // res.status(200).json( canciones )
    res.json(canciones)

  } catch (error) {
    console.log(error)
    //return res.status(400).redirect('/')
  }
})

app.delete('/:cancionId', async (req, res) => {
  console.log('delete')
  const id = req.query.id
  
  console.log('delete ', id) // ok
  
  if (id) {
    try {
      //const canciones = await mostrarCanciones()
    //res.json(canciones)

      await eliminarCancion(id);
      // res.status(200).redirect('/') // eliminado
      res.redirect('/') // eliminado


    } catch (error) {
      console.log(error);
      return res.redirect('/') // 400 error
    }
  }
})

/* app.put('/cancion', async (req, res) => {
  console.log('put')
  const form = await f.getForm(req)
  console.log('put form ', form)
  const id = req.query.id
  
  console.log('put id ', id) // ok
  
  if (id) {
    try {
      //const canciones = await mostrarCanciones()
    //res.json(canciones)

      //await eliminarCancion(id);

      // res.status(200).redirect('/') // eliminado
      res.redirect('/') // eliminado


    } catch (error) {
      console.log(error);
      return res.redirect('/') // 400 error
    }
  }
}) */

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

app.listen(port, function() {
  console.log(`http://localhost:${port}`)
})

// nodemon server
