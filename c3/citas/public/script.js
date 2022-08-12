const lista_citas = document.querySelector('#lista-citas')

function dibujarCitas(citas) {
  // 1. Vamos armando el HTML interno de la lista, de a poco
  let html = ''
  for (let cita of citas) {
    html += `
    <li class="list-group-item">"${cita.cita}"<br> </li>
    <li class="texto-azul">-${cita.nombre} at ${cita.hora} ${cita.fecha}</li>
    `
  }
  // 2. Fijar el HTML interno de la lista
  lista_citas.innerHTML = html;
}

async function traerCitas() {
  // 1. Me traigo el array de lugares, desde la API de server.js
  let citas = await fetch('/citas')
  citas = await citas.json()

  // 2. Armo el texto del HTML que debe tener la lista de citas
  dibujarCitas(citas)
}
traerCitas()