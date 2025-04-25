document.addEventListener('DOMContentLoaded', traerTodo);
const URLAPI = 'http://localhost:3000/aprendices';
let cuerpoTabla = document.querySelector("#cuerpoTabla");
let botonEditarModal = document.querySelector("#btnModalEditar");

botonEditarModal.addEventListener("click", () =>{
    let nombre = document.querySelector("#nombre").value;
    let apellido = document.querySelector("#apellido").value;
    let correo= document.querySelector("#correo").value;

    console.log(nombre.trim().length === 0);
    if(nombre.trim().length === 0 || apellido.trim().length || correo.trim().length === 0){
        Swal.fire({
            icon: "error",
            title: "Campos Incompletos",
            text: "Por favor complete todos los campos a editar"
          });
    }
    else{
        editarAprendiz();
    }
});

async function leerApi() {
    let resultado = await fetch(URLAPI);
    let datos = await resultado.json();
    return datos;
}

async function buscarAprendiz(idAprendiz) {
    let aprendiz = await leerApi();
    let aprendizEncontrado;

    aprendiz.forEach(datosAprendiz =>{
        if(datosAprendiz.id === idAprendiz){
            aprendizEncontrado = datosAprendiz;
        }
    })
    
    return aprendizEncontrado;
}

async function mostrarAprendiz(boton){
    let idAprendiz = boton.getAttribute('data-id');
    let aprendiz = await buscarAprendiz(idAprendiz);
    let selecMatricula = document.querySelector("#matricula");

    document.querySelector("#nombre").value = aprendiz.nombre
    document.querySelector("#apellido").value = aprendiz.apellido;
    document.querySelector("#correo").value = aprendiz.correo;

    selecMatricula.value = aprendiz.estadoMatricula ? "Si" : "No";

    botonEditarModal.setAttribute("data-id", idAprendiz);
}

async function editarAprendiz(){
    let idAprendiz = botonEditarModal.getAttribute('data-id');
    let nombreNuevo = document.querySelector("#nombre").value;
    let apellidoNuevo = document.querySelector("#apellido").value;
    let correoNuevo = document.querySelector("#correo").value;
    let matriculaNueva = document.querySelector("#matricula").value;
    let datosOriginales = await buscarAprendiz(idAprendiz);
    let matriculaOriginal = datosOriginales.estadoMatricula ? "Si" : "No";

    if(nombreNuevo !== datosOriginales.nombre){
        
    }
    if(apellidoNuevo !== datosOriginales.apellido){
        
    }
    if(correoNuevo !== datosOriginales.correo){
        
    }
    if(matriculaNueva !== matriculaOriginal){
        
    }
}

function eliminarAprendiz(boton){
    
}
async function traerTodo(){
    let datos = await leerApi();

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
        estado.textContent = aprendiz.estadoMatricula ? "Matriculado" : "No Matriculado";

        botonEliminar.textContent = "Eliminar";
        botonEditar.textContent = "Editar";

        //estilos de botones
        botonEliminar.classList.add("btn", "btn-danger", "rounded-pill");
        botonEditar.classList.add("btn", "btn-warning", "rounded-pill");

        //funcion de apretar boton
        botonEditar.addEventListener("click", () => {mostrarAprendiz(botonEditar)});
        botonEditar.setAttribute("data-id", aprendiz.id);
        botonEditar.setAttribute("data-bs-target", "#modalEditar");
        botonEditar.setAttribute("data-bs-toggle", "modal");

        botonEliminar.addEventListener("click", () => {eliminarAprendiz(botonEliminar)});
        botonEliminar.setAttribute("data-id", aprendiz.id);

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

