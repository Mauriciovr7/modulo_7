const { Pool } = require('pg')
const { config } = require('./config.js')

/* const config = {
  user: 'postgres',
  host: 'localhost',
  database: 'citas',
  password: 'clave_basedato',
  port: 5432
} */

const pool = new Pool(config)

async function nuevaCita(nombre, cita) {
  const client = await pool.connect()

  try {

    const resp = await client.query({
      text: `insert into citas (nombre, cita) values ($1, $2) returning *`,
      values: [nombre, cita],
      name: 'nueva-cita'
    })

    console.log(resp.rows)

    console.log(`Cita de  ${nombre} agregada con éxito`)

  } catch (error) {

    console.log(error)
    // console.log('tabla no existe')
  }

  client.release()
  //pool.end()
}

async function mostrarCitas() {
  // 1. Solicito un 'cliente' al pool de conexiones
  const client = await pool.connect()
  const resp = await client.query('select * from citas')
  client.release()
  return resp.rows
}

module.exports = {
  nuevaCita, mostrarCitas
}