const { Pool } = require('pg')
const { config } = require('./config.js')

// pool ********************************

/* const config = {
  user: 'postgres',
  host: 'localhost',
  database: 'escuela',
  password: 'clave_basedato',
  port: 5432
} */

const pool = new Pool(config)

async function nuevoEstudiante(nombre, rut, curso, nivel) {
  const client = await pool.connect()

  try {
    // await client.query(`insert into estudiantes(nombre, rut, curso, nivel) values ('${nombre}', '${rut}', '${curso}', ${nivel}) returning *`) // returning * = retorna lo q acaba de crear
    /* const resp = await client.query(`insert into estudiantes (nombre, rut, curso, nivel) values ($1, $2, $3, $4) returning *`,
      [nombre, rut, curso, nivel]) */ // un string y un array

    const resp = await client.query({
      text: `insert into estudiantes (nombre, rut, curso, nivel) values ($1, $2, $3, $4) returning *`,
      values: [nombre, rut, curso, nivel],
      name: 'nuevo-estudiante-como-arrays'
    })

    console.log(resp.rows)

    console.log(`El estudiante ${nombre} se ha agregado con éxito`)

  } catch (error) {

    console.log(error)
    // console.log('tabla no existe')
  }


  client.release()
  pool.end()
}

/* async function mostrarEstudiantes() {
  const client = await pool.connect()

  try {

    const resp = await client.query(`select * from estudiantes order by nombre`)

    if (resp.rows == '') {
      console.log('nada en basedato')
    } else console.log('Registro actual', resp.rows)

  } catch (error) {

    console.log(error)
  }

  client.release()
  pool.end()
} */

async function mostrarEstudiantes() {
  // 1. Solicito un 'cliente' al pool de conexiones
  const client = await pool.connect()

  try {

    // 2. Ejecuto la consulta SQL (me traigo un array de arrays) ***************************
    const respuesta = await client.query({
      text: 'select * from estudiantes order by nombre',
      rowMode: 'array',
      name: 'estudiantes-como-arrays'
    })
    console.log(respuesta.rows);

  } catch (error) {

    console.log(error)
  }
  // 3. Devuelvo el cliente al pool
  client.release()
  pool.end()
}

async function editarEstudiante(nombre, rut, curso, nivel) {
  const client = await pool.connect()

  try {

    // const resp = await client.query(`update estudiantes set nombre='${nombre}', rut='${rut}', curso='${curso}', nivel=${nivel} where rut='${rut}' returning *`)
    /* const resp = await client.query({
      text: `update estudiantes set nombre=$1, rut=$2, curso=$3, nivel=$4 where rut=$2 returning *`,
      values: [nombre, rut, curso, nivel],
      name: 'editar-estudiantes-como-arrays'
    }) */
    const resp = await client.query(`update estudiantes set nombre=$1, rut=$2, curso=$3, nivel=$4 where rut=$2 returning *`,
      [nombre, rut, curso, nivel]) // un string y un array

    if (resp.rows == '') {
      console.log(`Estudiante ${nombre} no existe en basedato`)
    } else console.log(`Estudiante ${nombre} editado con éxito`)

  } catch (error) {

    console.log(error)
  }

  client.release()
  pool.end()
}

async function rutEstudiante(rut) {
  const client = await pool.connect()

  try {

    // const resp = await client.query(`select * from estudiantes where rut='${rut}'`)
    const resp = await client.query(`select * from estudiantes where rut=$1`,
      [rut]) // un string y un array

    if (resp.rows == '') {
      console.log(`Rut ${rut} no existe en basedato`)
    } else console.log(resp.rows)

  } catch (error) {

    console.log(error)
  }

  client.release()
  pool.end()
}

async function eliminarEstudiante(rut) {
  const client = await pool.connect()

  try {

    // const resp = await client.query(`delete from estudiantes where rut='${rut}' returning *`)
    const resp = await client.query({
      text: `delete from estudiantes where rut=$1 returning *`,
      values: [rut],
      name: 'eliminar-estudiante'
    })

    if (resp.rows == '') {
      console.log(`Rut ${rut} no existe en basedato`)
    } else console.log(`Registro de estudiante  con rut ${rut} eliminado`)

    // console.log('fuera if')
  } catch (error) {

    console.log(error)
  }

  client.release()
  pool.end()
}

async function aprobarEstudiante(rut) {
  const client = await pool.connect()

  try {

    // const resp = await client.query(`select * from estudiantes where rut='${rut}'`)
    const resp = await client.query(`select * from estudiantes where rut=$1`,
      [rut]) // un string y un array

    // await client.query(`update estudiantes set nivel=${resp.rows[0].nivel + 1} where rut='${rut}' returning *`)
    await client.query(`update estudiantes set nivel=${resp.rows[0].nivel + 1} where rut=$1`,
      [rut]) // un string y un array

    if (resp.rows == '') {
      console.log(`Rut ${rut} no existe en basedato`)
    } else console.log(`Estudiante  con rut ${rut} aprobado`)

  } catch (error) {

    console.log(error)
  }

  client.release()
  pool.end()
}

// Acciones 
//mostrarEstudiantes()
const accion = process.argv[2] // argv = array q contiene todas las posiciones q se pasan en terminal

// Consultar los estudiantes registrados
if (accion == 'consulta') {
  mostrarEstudiantes()
}
// Agregar un nuevo estudiante
else if (accion == 'crear') {

  if (process.argv.length != 7) {
    console.log('faltan datos')
    return
  }

  const nombre = process.argv[3]
  const rut = process.argv[4].trim() // .trim() para q no agregue con espacio
  const curso = process.argv[5]
  const nivel = process.argv[6]
  nuevoEstudiante(nombre, rut, curso, nivel)
}
// Modificar estudiante
else if (accion == 'editar') {

  if (process.argv.length != 7) {
    console.log('faltan datos')
    return
  }

  const nombre = process.argv[3]
  const rut = process.argv[4].trim()
  const curso = process.argv[5]
  const nivel = process.argv[6]
  editarEstudiante(nombre, rut, curso, nivel)
}
// Consultar estudiante por rut
else if (accion == 'rut') {
  const rut = process.argv[3].trim()

  if (rut == undefined || rut == '' || rut.length != 12) {
    console.log('Rut no ingresado o erróneo')
    return
  }
  rutEstudiante(rut)
}
// Eliminar estudiante por rut
else if (accion == 'eliminar') {
  const rut = process.argv[3].trim()

  if (rut == undefined || rut == '' || rut.length != 12) {
    console.log('Rut no ingresado o erróneo')
    return
  }
  eliminarEstudiante(rut)
}
// Subir nivel a estudiante
else if (accion == 'aprobar') {
  const rut = process.argv[3]

  if (rut == undefined || rut == '' || rut.length != 12) {
    console.log('Rut no ingresado o erróneo')
    return
  }
  aprobarEstudiante(rut)
}
else {
  console.log(`Acción ${accion} no implementada`)
}

// node index.js

// \d estudiantes
// select * from estudiantes

// node index.js consulta
// node index.js crear 'Brian May' '12.345.678-9' guitarra 7
// node index.js crear 'Paul May' '14.345.678-9' bateria 2

  // actualizar
// node index.js editar 'Brian May' '12.345.678-9' guitarra 10
// node index.js rut '12.345.678-9'
// node index.js eliminar '12.345.678-9'
// node index aprobar '12.345.678-9'

/*
Matias Bensan — hoy a las 11:51
BONUS Always Music:
- Crear funcionalidad para actualizar en 1 el nivel de un estudiante:
node comandos.js aprobar 15.345.767-0
*/