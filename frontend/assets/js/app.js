document.addEventListener('DOMContentLoaded', leerApi);
const URLAPI = 'http://localhost:3000/aprendices';

async function leerApi(){
    let resultado = await fetch(URLAPI);
    let datos = await resultado.json();
    console.log(datos);
}