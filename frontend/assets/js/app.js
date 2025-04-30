document.addEventListener('DOMContentLoaded', traerTodo);
const URLAPI = 'http://localhost:3000/aprendices';
let cuerpoTabla = document.querySelector("#cuerpoTabla");
let botonEditarModal = document.querySelector("#btnModalEditar");
let btnEdicionConfirmada = document.querySelector("#btnEdicionConfirmada");
let btnAgregar = document.getElementById('btnAgregar');
let btnActivar = document.querySelector('#activar');
let aprendizEditadoGlobal = null;

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.querySelector('.toggle-btn');
    sidebar.classList.toggle('collapsed');
    toggleBtn.classList.toggle('collapsed');
}

//#####################################   Editar Aprendiz #########################################
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

btnEdicionConfirmada.addEventListener("click", async() =>{
    let respuesta = await editarAprendiz();
    alertaEdicion(respuesta);
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

    let respuesta = 
    await fetch(`${URLAPI}/${datosAprendiz[0]}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(aprendiz)
    });

    if(respuesta.ok){
        return true;
    }
    else{
        return false;
    }
}

function alertaEdicion(respuesta) {
    if (respuesta){
        Swal.fire({
            title: "Datos Editados Con Exito",
            text: "Los datos del aprendiz se han actualizado satisfactoriamente",
            icon: "success"
          })
          .then(() =>{
            location.reload();
          });
    }
    else{
        Swal.fire({
            icon: "error",
            title: "Ha ocurrido un error",
            text: "No se pudo editar al aprendiz",
          });
    }
    
}

//#####################################     Fin Editar Aprendiz #########################################

//#####################################   Eliminar Aprendiz #########################################

async function eliminarAprendiz(boton) {
    let idAprendiz = boton.getAttribute('data-id');
    let respuesta = 
    await fetch(`${URLAPI}/${idAprendiz}`, {
        method: 'DELETE'
    });

    if(respuesta.ok){
        alertaEliminacion(true);
    }
    else{
        alertaEliminacion(false)
    }
}

function alertaEliminacion(respuesta) {
    if (respuesta){
        Swal.fire({
            title: "Aprendiz Eliminado Con Exito",
            text: "Se han eliminado los datos del aprendiz satisfactoriamente",
            icon: "success"
          })
          .then(() =>{
            location.reload();
          });
    }
    else{
        Swal.fire({
            icon: "error",
            title: "Ha ocurrido un error",
            text: "No se pudo eliminar al aprendiz",
          });
    }
    
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
// Agregar este código al final de app.js, sin modificar lo existente

document.addEventListener('DOMContentLoaded', function() {
    
    // Agregamos eventos para el cambio de vistas
    setupVistaCambio();
    
    setupFormularioAgregar();
  });
  
  function setupVistaCambio() {
    // Botón en sidebar para mostrar formulario
    const btnMostrarFormulario = document.getElementById('btnMostrarFormulario');
    if (btnMostrarFormulario) {
      btnMostrarFormulario.addEventListener('click', function() {
        mostrarVistaFormulario();
        
        // Si el sidebar está abierto, cerrarlo al cambiar vista
        const sidebar = document.getElementById('sidebar');
        if (!sidebar.classList.contains('collapsed')) {
          toggleSidebar();
        }
      });
    }
    
    // Botón "+" para mostrar formulario
    
    if (btnAgregar) {
      btnAgregar.addEventListener('click', function() {
        mostrarVistaFormulario();
        
        // Si el sidebar está abierto, cerrarlo al cambiar vista
        const sidebar = document.getElementById('sidebar');
        if (!sidebar.classList.contains('collapsed')) {
          toggleSidebar();

        }
      });
    }
    
    // Botón para volver a la tabla
    const btnVolverATabla = document.getElementById('btnVolverATabla');
    if (btnVolverATabla) {
      btnVolverATabla.addEventListener('click', function() {
        mostrarVistaTabla();
      });
    }
  }
  
  function mostrarVistaFormulario() {
    document.getElementById('vistaTabla').style.display = 'none';
    document.getElementById('vistaFormulario').style.display = 'block';
    btnActivar.style.display = 'none';

  }
  
  function mostrarVistaTabla() {
    document.getElementById('vistaFormulario').style.display = 'none';
    document.getElementById('vistaTabla').style.display = 'block';
    btnActivar.style.display = 'block';
  }
  
  async function setupFormularioAgregar() {
    const formAgregarAprendiz = document.getElementById('formAgregarAprendiz');
    if (formAgregarAprendiz) {
      formAgregarAprendiz.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        let datos = await leerApi();

        let idAprendiz = `${datos.length + 1}`;
        let nombre = document.getElementById('nombreAgregar').value;
        let apellido = document.getElementById('apellidoAgregar').value;
        let correo = document.getElementById('correoAgregar').value;
        let matricula = document.getElementById('matriculaAgregar').value;
        
        if (nombre.trim() === '' || apellido.trim() === '' || correo.trim() === '') {
          Swal.fire({
            icon: "error",
            title: "Campos Incompletos",
            text: "Por favor complete todos los campos"
          });
          return;
        }
        
        const nuevoAprendiz = {
          id: idAprendiz,
          nombre: nombre,
          apellido: apellido,
          correo: correo,
          estadoMatricula: matricula === "Si" ? true : false
        };
        
        const respuesta = await agregarAprendiz(nuevoAprendiz);
        if (respuesta) {
          Swal.fire({
            title: "Aprendiz Agregado Con Éxito",
            text: "Los datos del aprendiz se han guardado satisfactoriamente",
            icon: "success"
          }).then(() => {
            location.reload();
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Ha ocurrido un error",
            text: "No se pudo agregar al aprendiz"
          });
        }
      });
    }
  }
  
  async function agregarAprendiz(aprendiz) {
    try {
      let respuesta = await fetch(URLAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(aprendiz)
      });
      
      return respuesta.ok;
    } catch (error) {
      console.error("Error al agregar aprendiz:", error);
      return false;
    }
  }