const { Client } = require('pg')
const {config} = require('./config.js')

// pool ********************************

/* const config = {
  user: 'postgres',
  host: 'localhost',
  database: 'escuela',
  password: 'clave_basedato',
  port: 5432
} */
const client = new Client(config)

client.connect(err => {
  if (err) {
    console.log(err, 'error de conexion con basedato')
  }
})


async function nuevoEstudiante(nombre, rut, curso, nivel) {


  await client.query(`insert into estudiantes(nombre, rut, curso, nivel) values ('${nombre}', '${rut}', '${curso}', ${nivel}) returning *`) // returning * = retorna lo q acaba de crear

  // console.log(resp.rows) // rows contenido
  console.log(`El estudiante ${nombre} se ha agregado con éxito`)

  client.end()
}

async function mostrarEstudiantes() {
  const resp = await client.query(`select * from estudiantes order by nombre`) // consultar a basedato
  
  if (resp.rows == '') {
    console.log('nada en basedato')
  } else console.log('Registro actual', resp.rows) // rows[0]) // solo el primero
  client.end() // cerrar conexion
}

async function editarEstudiante(nombre, rut, curso, nivel) {
  const resp = await client.query(`update estudiantes set nombre='${nombre}', rut='${rut}', curso='${curso}', nivel=${nivel} where rut='${rut}' returning *`)
  // console.log(resp.rows)
  if (resp.rows == '') {
    console.log(`Estudiante ${nombre} no existe en basedato`)
  } else console.log(`Estudiante ${nombre} editado con éxito`)
  
  client.end()
}

async function rutEstudiante(rut) {
  const resp = await client.query(`select * from estudiantes where rut='${rut}'`)
  
  if (resp.rows == '') {
    console.log(`Rut ${rut} no existe en basedato`)
  } else console.log(resp.rows)

  client.end()
}

async function eliminarEstudiante(rut) {
  const resp = await client.query(`delete from estudiantes where rut='${rut}' returning *`)

  if (resp.rows == '') {
    console.log(`Rut ${rut} no existe en basedato`)
  } else console.log(`Registro de estudiante  con rut ${rut} eliminado`)
  
  client.end()
}

// Acciones 
//mostrarEstudiantes()
const accion = process.argv[2] // argv = array q contiene todas las posiciones q se pasan en terminal

if (accion == 'consulta') {
  mostrarEstudiantes()
}
else if (accion == 'crear') {

  const nombre = process.argv[3]
  const rut = process.argv[4]
  const curso = process.argv[5]
  const nivel = process.argv[6]
  nuevoEstudiante(nombre, rut, curso, nivel)
}
else if (accion == 'editar') {

  const nombre = process.argv[3]
  const rut = process.argv[4]
  const curso = process.argv[5]
  const nivel = process.argv[6]
  editarEstudiante(nombre, rut, curso, nivel)
}
else if (accion == 'rut') {
  const rut = process.argv[3]
  if(rut == undefined || rut == '') {
    console.log('Rut no ingresado')
    return
  }
  rutEstudiante(rut)
}
else if (accion == 'eliminar') {
  const rut = process.argv[3]
  eliminarEstudiante(rut)
}
else {
  console.log(`Acción ${accion} no implementada`)
}

// node index.js

// \d estudiantes
// select * from estudiantes

// node index.js crear 'Brian May' '12.345.678-9' guitarra 7
// node index.js consulta
  // actualizar
// node index.js editar 'Brian May' '12.345.678-9' guitarra 10
// node index.js rut '12.345.678-9'
// node index.js eliminar '12.345.678-9'
