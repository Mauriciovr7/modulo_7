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
  }

  client.release()
}

async function mostrarCanciones() {
  const client = await pool.connect()
  const resp = await client.query('select * from canciones')
  client.release()
  return resp.rows
}

async function eliminarCancion(id) {
  const client = await pool.connect()
  await client.query({
    text: `delete from canciones where id=$1`,
    values: [id],
    name: 'eliminar-cancion'
  })
  client.release()
}

const actualizarCancion = async ( id, cancion, artista, tono ) => {
  const client = await pool.connect()
  
  try {
    await client.query({
      text: `update canciones set cancion=$2, artista=$3, tono=$4 where id=$1`,
      values: [id, cancion, artista, tono],
      name: 'editar-cancion'
    })
    client.release()
  } catch (error) {
      console.log("Surgió un error al actualizar_cancion: " + error)
  }
}

module.exports = {
  nuevaCancion, mostrarCanciones, eliminarCancion, actualizarCancion
}