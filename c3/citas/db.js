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
  const resp = await client.query("select id, nombre, cita, to_char(fecha, 'Mon dd, yyyy') as dia, to_char(hora, 'HH24:MI') as hr from citas order by fecha") // (hora, 'HH:MI am')
  client.release()
  return resp.rows
}
const deleteCita = async (id) => {
  console.log('db deleteCita ', id)
  const client = await pool.connect()
  const resp = await client.query(
  {text: `delete from citas where id=$1`,
    values: [id]}
  )
  client.release()
  return resp.rows
}

async function editarCita (id, nombre, cita) {
  // 1. Solicito un 'cliente' al pool de conexiones
  const client = await pool.connect()

  // 2. Ejecuto la consulta (consulta parametrizada con un Objeto)
  await client.query({
    text: `update citas set nombre=$1, cita=$2 where id=$3`,
    values: [nombre, cita, id] 
  })

  // 3. Devuelvo el client al pool
  client.release()
}

module.exports = {
  nuevaCita, mostrarCitas, deleteCita, editarCita
}