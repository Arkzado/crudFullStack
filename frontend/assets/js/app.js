document.addEventListener('DOMContentLoaded', leerApi);
const URLAPI = 'http://localhost:3000/aprendices';
let cuerpoTabla = document.querySelector("#cuerpoTabla");

async function leerApi(){
    let resultado = await fetch(URLAPI);
    let datos = await resultado.json();
    
    datos.forEach(aprendiz => {
        let trCuerpo = document.createElement("tr");
        let id = document.createElement("td");
        let nombre = document.createElement("td");
        let apellido = document.createElement("td");
        let correo = document.createElement("td");
        let estado = document.createElement("td");

        id.textContent = aprendiz.id;
        nombre.textContent = aprendiz.nombre;
        apellido.textContent = aprendiz.apellido;
        correo.textContent = aprendiz.correo;
        estado.textContent = aprendiz.estadoMatricula === true ? "Matriculado" : "No Matriculado";

        trCuerpo.appendChild(id);
        trCuerpo.appendChild(nombre);
        trCuerpo.appendChild(apellido);
        trCuerpo.appendChild(correo);
        trCuerpo.appendChild(estado);

        cuerpoTabla.appendChild(trCuerpo);
    });
}