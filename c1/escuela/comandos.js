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
    console.log(err);
  }
})


async function nuevoEstudiante(nombre, rut, curso, nivel) {


  const resp = await client.query(`insert into estudiantes(nombre, rut, curso, nivel) values ('${nombre}', '${rut}', '${curso}', ${nivel}) returning *`)

  console.log(resp.rows);

  client.end()
}

async function mostrarEstudiantes() {
  const resp = await client.query(`select * from estudiantes order by nombre`);
  console.log(resp.rows);
  client.end();
}

// Acciones 
//mostrarEstudiantes()
const accion = process.argv[2]

if (accion == 'mostrar') {
  mostrarEstudiantes()
}
else if (accion == 'crear') {

  const nombre = process.argv[3]
  const rut = process.argv[4]
  const curso = process.argv[5]
  const nivel = process.argv[6]
  nuevoEstudiante(nombre, rut, curso, nivel)
}
else {
  console.log(`Acción ${accion} no implementada`);
}

// node comandos.js

// \d estudiantes
// select * from estudiantes

// node comandos.js mostrar
// node comandos.js crear 'Brian May', '12.345.678-9', guitarra, 7

