document.addEventListener('DOMContentLoaded', traerTodo);
const URLAPI = 'http://localhost:3000/aprendices';
let cuerpoTabla = document.querySelector("#cuerpoTabla");
let botonEditarModal = document.querySelector("#btnModalEditar");
let btnEdicionConfirmada = document.querySelector("#btnEdicionConfirmada");
let aprendizEditadoGlobal = null;

botonEditarModal.addEventListener("click", () => {
    let nombre = document.querySelector("#nombre").value;
    let apellido = document.querySelector("#apellido").value;
    let correo = document.querySelector("#correo").value;

    if (nombre.trim().length === 0 || apellido.trim().length === 0 || correo.trim().length === 0) {
        Swal.fire({
            icon: "error",
            title: "Campos Incompletos",
            text: "Por favor complete todos los campos a editar"
        });
    }
    else {
        compararDatosDeAprendiz();
    }
});

btnEdicionConfirmada.addEventListener("click", () =>{
    editarAprendiz();
});

async function leerApi() {
    let resultado = await fetch(URLAPI);
    let datos = await resultado.json();
    return datos;
}

async function buscarAprendiz(idAprendiz) {
    let aprendiz = await leerApi();
    let aprendizEncontrado;

    aprendiz.forEach(datosAprendiz => {
        if (datosAprendiz.id === idAprendiz) {
            aprendizEncontrado = datosAprendiz;
        }
    })

    return aprendizEncontrado;
}

async function mostrarAprendiz(boton) {
    let idAprendiz = boton.getAttribute('data-id');
    let aprendiz = await buscarAprendiz(idAprendiz);
    let selecMatricula = document.querySelector("#matricula");

    document.querySelector("#nombre").value = aprendiz.nombre
    document.querySelector("#apellido").value = aprendiz.apellido;
    document.querySelector("#correo").value = aprendiz.correo;

    selecMatricula.value = aprendiz.estadoMatricula ? "Si" : "No";

    botonEditarModal.setAttribute("data-id", idAprendiz);
}

async function compararDatosDeAprendiz() {
    let idAprendiz = botonEditarModal.getAttribute('data-id');
    let nombreNuevo = document.querySelector("#nombre").value;
    let apellidoNuevo = document.querySelector("#apellido").value;
    let correoNuevo = document.querySelector("#correo").value;
    let matriculaNueva = document.querySelector("#matricula").value;
    let datosOriginales = await buscarAprendiz(idAprendiz);
    let matriculaOriginal = datosOriginales.estadoMatricula ? "Si" : "No";
    let tituloAprendiz = document.querySelector("#tituloAprendiz");
    let datosModificados = document.querySelector("#datosModificados");
    let aprendizEditado = [idAprendiz];

    tituloAprendiz.textContent = `¿Está seguro de editar al Aprendiz: ${datosOriginales.nombre}?`;

    datosModificados.innerHTML = "";

    if (nombreNuevo === datosOriginales.nombre && apellidoNuevo === datosOriginales.apellido &&
        correoNuevo === datosOriginales.correo && matriculaNueva === matriculaOriginal) {

        Swal.fire({
            title: "No has realizado ninguna modificación",
            text: "Los datos siguen siendo los originales regresa si quieres realizar un cambio",
            icon: "warning",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Regresar"
        });
    }
    else {
        const modalEditar = bootstrap.Modal.getInstance(document.getElementById("modalEditar"));
        if (modalEditar) {
            modalEditar.hide();
        }
        const modalConfirmar = new bootstrap.Modal(document.getElementById("confirmar"));
        modalConfirmar.show();

        if (nombreNuevo !== datosOriginales.nombre) {
            aprendizEditado.push(nombreNuevo);
            datosModificados.innerHTML += `<b>Nombre Anterior:</b> ${datosOriginales.nombre} <br>
                                          <b>Nombre Nuevo:</b> ${nombreNuevo} <hr>`;
        }
        else{
            aprendizEditado.push(datosOriginales.nombre)
        }
        if (apellidoNuevo !== datosOriginales.apellido) {
            aprendizEditado.push(apellidoNuevo);
            datosModificados.innerHTML += `<b>Apellido Anterior:</b> ${datosOriginales.apellido} <br>
                                          <b>Apellido Nuevo:</b> ${apellidoNuevo} <hr>`;
        }
        else{
            aprendizEditado.push(datosOriginales.apellido);
        }
        if (correoNuevo !== datosOriginales.correo) {
            aprendizEditado.push(correoNuevo);
            datosModificados.innerHTML += `<b>Correo Anterior:</b> ${datosOriginales.correo} <br>
                                          <b>Correo Nuevo:</b> ${correoNuevo} <hr>`;
        }
        else{
            aprendizEditado.push(datosOriginales.correo);
        }
        if (matriculaNueva !== matriculaOriginal) {
            let estadoMatricula = matriculaNueva === "Si" ? true : false;
            aprendizEditado.push(estadoMatricula);
            datosModificados.innerHTML += `<b>Matricula Anterior:</b> ${matriculaOriginal} <br>
                                          <b>Matricula Nuevo:</b> ${matriculaNueva} <hr>`;
        }
        else{
            let estadoMatricula = matriculaOriginal === "Si" ? true : false;
            aprendizEditado.push(estadoMatricula);
        }

        aprendizEditadoGlobal = aprendizEditado;
        return aprendizEditado;
    }
}

async function editarAprendiz(){
    let datosAprendiz = aprendizEditadoGlobal;
    let aprendiz = {
      id: datosAprendiz[0],
      nombre: datosAprendiz[1],
      apellido: datosAprendiz[2],
      correo: datosAprendiz[3],
      estadoMatricula: datosAprendiz[4]
    };

    fetch(`http://localhost:3000/aprendices/${datosAprendiz[0]}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(aprendiz)
    });

    Swal.fire({
        title: "Datos Editados Con Exito",
        text: "Los datos del aprendiz se han actualizado satisfactoriamente",
        icon: "success"
      });
}

function eliminarAprendiz(boton) {

}
async function traerTodo() {
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
        botonEditar.addEventListener("click", () => { mostrarAprendiz(botonEditar) });
        botonEditar.setAttribute("data-id", aprendiz.id);
        botonEditar.setAttribute("data-bs-target", "#modalEditar");
        botonEditar.setAttribute("data-bs-toggle", "modal");

        botonEliminar.addEventListener("click", () => { eliminarAprendiz(botonEliminar) });
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

