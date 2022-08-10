const { Client } = require('pg')
const {clave} = require('./clave.js')

const config = {
  user: 'postgres',
  host: 'localhost',
  database: 'escuela',
  password: clave,
  port: 5432
}
const client = new Client(config)

client.connect(err => {
  if (err) {
    console.log(err)
  }
})


async function nuevoEstudiante(nombre, rut, curso, nivel) {


  await client.query(`insert into estudiantes(nombre, rut, curso, nivel) values ('${nombre}', '${rut}', '${curso}', ${nivel}) returning *`)

  // console.log(resp.rows)
  console.log(`El estudiante ${nombre} se ha agregado con éxito`)

  client.end()
}

async function mostrarEstudiantes() {
  const resp = await client.query(`select * from estudiantes order by nombre`)
  console.log('Registro actual', resp.rows)
  client.end()
}

async function editarEstudiante(nombre, rut, curso, nivel) {
  const resp = await client.query(`update estudiantes set nombre='${nombre}', rut='${rut}', curso='${curso}', nivel=${nivel} where rut='${rut}' returning *`)
  console.log(resp.rows)
  console.log(`Estudiante ${nombre} editado con éxito`)
  client.end()
}

async function rutEstudiante(rut) {
  const resp = await client.query(`select * from estudiantes where rut='${rut}'`)
  console.log(resp.rows)
  client.end()
}

async function eliminarEstudiante(rut) {
  await client.query(`delete from estudiantes where rut='${rut}' returning *`)
  console.log(`Registro de estudiante  con rut ${rut} eliminado`)
  // console.log(resp.rows)
  client.end()
}

// Acciones 
//mostrarEstudiantes()
const accion = process.argv[2]

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
