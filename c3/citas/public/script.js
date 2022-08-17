const lista_citas = document.querySelector('#lista-citas')

let citas

const deleteCita = async (id) => {
  console.log('delete ', id)

  await fetch("http://localhost:3000/quotes?id=" + id, {
    method: "DELETE",
  })
  traerCitas()
}

function dibujarCitas(citas) {
  // 1. Vamos armando el HTML interno de la lista, de a poco
  let html = ''
  for (let cita of citas) {
    html += `
    <li class="list-group-item">"${cita.cita}"<br> </li>
    <li class="texto-azul">-${cita.nombre} at ${cita.hr} ${cita.dia}
      <i class="fas fa-trash-alt del" onclick="deleteCita('${cita.id}')" ></i>
      <i class="btn fas fa-edit edit text-primary" data-bs-toggle="modal" data-bs-target="#modalEditar" onclick="editCita(${cita.id})"></i>           
    </li>
    `    
  }  

  // 2. Fijar el HTML interno de la lista
  lista_citas.innerHTML = html;
}

// estas 3 variables son los campos input del formulario de edición
const editar_nombre = document.querySelector('#editar_nombre')
const editar_cita = document.querySelector('#editar_cita')
const editar_id = document.querySelector('#editar_id')

function editCita(id) {
  const cita = citas.find(ci => ci.id == id)
  
  editar_nombre.value = cita.nombre
  editar_cita.value = cita.cita
  editar_id.value = cita.id
}

async function traerCitas() {
  // 1. Me traigo el array de citas, desde la API de server.js
  /* let citas = await fetch('/quotes')
  citas = await citas.json() */
  const resp = await fetch('/quotes')
  citas = await resp.json()

  // 2. Armo el texto del HTML que debe tener la lista de citas
  dibujarCitas(citas)
}
traerCitas()