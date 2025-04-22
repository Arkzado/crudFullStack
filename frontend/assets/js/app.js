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
        let tdBotonEliminar = document.createElement("td");
        let tdBotonEditar = document.createElement("td");

        let botonEliminar = document.createElement("button");
        let botonEditar = document.createElement("button");

        id.textContent = aprendiz.id;
        nombre.textContent = aprendiz.nombre;
        apellido.textContent = aprendiz.apellido;
        correo.textContent = aprendiz.correo;
        estado.textContent = aprendiz.estadoMatricula === true ? "Matriculado" : "No Matriculado";

        botonEliminar.textContent = "Eliminar";
        botonEditar.textContent = "Editar";

        //estilos de botones
        botonEliminar.classList.add("btn", "btn-danger");
        botonEditar.classList.add("btn", "btn-warning");

        //funcion de apretar boton
        botonEditar.setAttribute("onclick", "editarAprendiz()");
        botonEliminar.setAttribute("onclick", "eliminarAprendiz()");

        tdBotonEditar.appendChild(botonEditar);
        tdBotonEliminar.appendChild(botonEliminar);

        trCuerpo.appendChild(id);
        trCuerpo.appendChild(nombre);
        trCuerpo.appendChild(apellido);
        trCuerpo.appendChild(correo);
        trCuerpo.appendChild(estado);
        trCuerpo.appendChild(tdBotonEditar);
        trCuerpo.appendChild(tdBotonEliminar);

        cuerpoTabla.appendChild(trCuerpo);
    });
}

function editarAprendiz(){
    console.log("editar presionado");
}

function eliminarAprendiz(){
    console.log("eliminar presionado");
}