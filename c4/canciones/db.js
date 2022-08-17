const { Pool } = require('pg')
const { config } = require('./config.js')

/* const config = {
  user: 'postgres',
  host: 'localhost',
  database: 'canciones',
  password: 'clave_basedato',
  port: 5432
} */

const pool = new Pool(config)

async function nuevaCancion(cancion, artista, tono) {
  const client = await pool.connect()

  try {

    const resp = await client.query({
      text: `insert into canciones (cancion, artista, tono) values ($1, $2, $3) returning *`,
      values: [cancion, artista, tono],
      name: 'nueva-cancion'
    })

    console.log(`Canción ${cancion} agregada con éxito`)

  } catch (error) {

    console.log(error)
    // console.log('tabla no existe')
  }

  client.release()
  //pool.end()
}

async function mostrarCanciones() {
  const client = await pool.connect()
  const resp = await client.query('select * from canciones') // order by id')
  client.release()
  return resp.rows
}

async function eliminarCancion(id) {
  const client = await pool.connect()

  console.log('eliminar cancion')
  await client.query({
    text: `delete from canciones where id=$1`,
    values: [id],
    name: 'eliminar-cancion'
  })
  client.release()
  // return resp.rows
}

module.exports = {
  nuevaCancion, mostrarCanciones, eliminarCancion
}