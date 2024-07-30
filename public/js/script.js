const contenedorNotas = document.querySelector(".contenedorNotas");///contenedor de notas que utilizamos en el index para la creacion dinamica de estos
const crearbtn = document.querySelector(".crearbtn");//btn de crear nuevas notas desde el index
const noteCountDisplay = document.querySelector(".note-count");//contador de notas actualmente
    let noteCount = 0;
    let activeElement;

//Para guardar o actualizar una nota
    async function guardarNota(titulo, contenido, id = null) {
    if (!titulo || !contenido) {
        alert('Faltan campos necesarios.'); //si no hay titulo o contenido, muestra un alert
        return;
    }

    const method = id ? 'PUT' : 'POST';//hay ID, hacemos PUT, si no, POST
    const url = id ? `/notes/${id}` : '/notes'; // URL para actualizar o crear
    const body = JSON.stringify({ title: titulo, content: contenido }); //convertimos los datos a JSON

    try {
        const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: body,
        });

        if (!response.ok) throw new Error('Error al guardar la nota.');//si algo va mal, lanza un error

        if (!id) { //en caso de que no hay ID, significa que estamos creando una nota nueva
            const newNote = await response.json(); //convertimos la respuesta a json
            const noteBox = document.querySelector(`[data-note-id="${newNote._id}"]`);
            noteBox.dataset.noteId = newNote._id; //actualizamos el ID de la nota que manejamos actualemten en el dom
        } else {
            //alert('Nota actualizada correctamente.'); 
        }
    } catch (error) {
       // console.error('Error:', error); //Si hay un error, lo mostramos en la consola, esto utilizado en busqueda de errores
        //alert('Error al guardar la nota.'); //Y un alert al usuario
    }
}

//función para borrar una nota
async function borrarNota(id) {
    try {
        const response = await fetch(`/notes/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Error al borrar la nota.'); //si algo falla, lanzamos un error

        document.querySelector(`[data-note-id="${id}"]`).remove(); //eliminamos la nota del DOM
        noteCount--; 
        actualizarContador(); 
        alert('Nota borrada correctamente.'); 
    } catch (error) {
        console.error('Error:', error); 
        alert('Error al borrar la nota.'); 
    }
}

//eventos de iconos de guardar y borrar la nota de la base de datos
function activarEventosNotas() {
    const notas = document.querySelectorAll(".inputbox"); //seleccion de todas notas
    notas.forEach(nt => {
        const noteId = nt.dataset.noteId; //id de nota
        const saveIcon = nt.querySelector('.guardar'); //
        const deleteIcon = nt.querySelector('.borrar'); 

        if (saveIcon) {
            saveIcon.onclick = function () { //
                const titulo = nt.querySelector('.titulo').innerText.trim(); //obtenemos el ttulo
                const contenido = nt.querySelector('.contenido').innerText.trim(); //   y el contenido
                if (titulo && contenido) {
                    guardarNota(titulo, contenido, noteId); //guardamos o actualizamos la nota
                } else {
                    alert('El título y el contenido no pueden estar vacíos.'); //si faltan datos, mostramos un alert
                }
            };
        }

        if (deleteIcon) {
            deleteIcon.onclick = function () { //pulsando en el icono de borrar
                if (noteId) {
                    borrarNota(noteId); //lo borramos del server
                } else {
                    nt.remove(); //si no hay ID, eliminamos la nota del dom
                    noteCount--;
                    actualizarContador(); //
                }
            };
        }
    });
}

//funcion para actualizar el contador de notas
function actualizarContador() {
    noteCountDisplay.textContent = `Número de notas: ${noteCount}`; //actualizamos el contador en el dom
}

//función para crear una nota oculta, solucion a no respuesta de los botones.
function crearNotaOculta() {
    let inputbox = document.createElement("div");
    inputbox.style.display = 'none'; //ocultamos la nota inicialmente
    inputbox.className = "inputbox";
    inputbox.dataset.noteId = ''; 

    let titulo = document.createElement("div");
    titulo.className = "titulo";
    titulo.setAttribute("contenteditable", "true");

    let contenido = document.createElement("div");
    contenido.className = "contenido";
    contenido.setAttribute("contenteditable", "true");

    let fecha = document.createElement("p");
    fecha.className = "fecha";
    fecha.setAttribute("contenteditable", "false");

    let saveIcon = document.createElement("img");
    saveIcon.className = "guardar";
    saveIcon.src = "/public/images/guardar.png";

    inputbox.appendChild(titulo);
    inputbox.appendChild(contenido);
    inputbox.appendChild(fecha);
    inputbox.appendChild(saveIcon);

    contenedorNotas.appendChild(inputbox); // aniadimos la nota oculta al contenedor
    activarEventosNotas(); //activamos los eventos para la nueva nota
}

//para obtener las notas desde el servidor
async function obtenerNotas() {
    try {
        const response = await fetch('/notes'); // Hacemos una petición para obtener las notas
        const notes = await response.json(); // Convertimos la respuesta a JSON
        notes.forEach(note => {
            mostrarNotaEnDOM(note); // Mostramos cada nota en el DOM
        });
    } catch (error) {
        console.error('Error al obtener las notas:', error); // Mostramos el error en la consola
    }
}

//funcion para mostrar una nota en el DOM
function mostrarNotaEnDOM(note) {
    let inputbox = document.createElement("div");
    let img = document.createElement("img");
    let saveIcon = document.createElement("img");
    let fecha = document.createElement("p");
    let titulo = document.createElement("div");
    let contenido = document.createElement("div");

    titulo.className = "titulo";
    titulo.setAttribute("contenteditable", "true");
    titulo.innerText = note.title; // titulo de la nota

    contenido.className = "contenido";
    contenido.setAttribute("contenteditable", "true");
    contenido.innerText = note.content; //contenido de la nota

    fecha.className = "fecha";
    fecha.setAttribute("contenteditable", "false");
    fecha.innerText = `Creada el: ${new Date(note.createdAt).toLocaleString()}`; //fecha de creación de l a nota

    inputbox.className = "inputbox";
    inputbox.dataset.noteId = note._id; //id de nota

    img.className = "borrar";
    img.src = "/public/images/borrar.png";

    saveIcon.className = "guardar";
    saveIcon.src = "/public/images/guardar.png";

    inputbox.appendChild(titulo);
    inputbox.appendChild(contenido);
    inputbox.appendChild(fecha);
    inputbox.appendChild(img);
    inputbox.appendChild(saveIcon);

    contenedorNotas.appendChild(inputbox); //nota al contenedor
    noteCount++; 
    actualizarContador(); 
    activarEventosNotas(); // Activamos eventos en la nueva nota
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    obtenerNotas(); // Obtener notas existentes desde el servidor
    crearNotaOculta(); // Crear nota oculta para manejar actualizaciones

    noteCount = document.querySelectorAll('.inputbox').length; // Contamos las notas existentes
    actualizarContador(); // Actualizamos el contador

    crearbtn.addEventListener("click", () => {
        let inputbox = document.createElement("div");
        let img = document.createElement("img");
        let saveIcon = document.createElement("img");
        let fecha = document.createElement("p");
        let titulo = document.createElement("div");
        let contenido = document.createElement("div");

        titulo.className = "titulo";
        titulo.setAttribute("contenteditable", "true");
        contenido.className = "contenido";
        contenido.setAttribute("contenteditable", "true");
        fecha.className = "fecha";
        fecha.setAttribute("contenteditable", "false");
        inputbox.className = "inputbox";
        inputbox.dataset.noteId = ''; 
        img.className = "borrar";
        img.src = "/public/images/borrar.png";
        saveIcon.className = "guardar";
        saveIcon.src = "/public/images/guardar.png";

        const now = new Date();
        const localDateTime = now.toLocaleString();
        fecha.textContent = `Creada el: ${localDateTime}`; //se obtiene la fecha actual
        titulo.textContent = `Nota no.${noteCount + 1}`; // 

        inputbox.appendChild(titulo);
        inputbox.appendChild(contenido);
        inputbox.appendChild(fecha);
        inputbox.appendChild(img);
        inputbox.appendChild(saveIcon);
        contenedorNotas.appendChild(inputbox); //aniadimos la nueva nota al contenedor
        noteCount++;
        actualizarContador();
        activarEventosNotas(); 

        guardarNota(titulo.innerText.trim(), contenido.innerText.trim()); // Guardamos la nueva nota
    });

    document.addEventListener("focusin", (event) => {
        if (event.target.classList.contains('contenido') || event.target.classList.contains('titulo')) {
            activeElement = event.target; //el elemento se pone activo al enfocarse
        }
    });
});

