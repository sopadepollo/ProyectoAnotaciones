const apiKey = '8246de43cb8c38fa2474a6a842f97973'; 

//array con los meses del año, pa que se vea bonito el nombre del mes
const f = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

//esto pide la ubicación actual al navegador, si la consigue llama a success, si no da error
navigator.geolocation.getCurrentPosition(success, error);

function success(position) {
    const latitude = position.coords.latitude; //Sacamos la latitud
    const longitude = position.coords.longitude; //y la longitud
    obtenerClima(latitude, longitude); //llamamos a obtenerClima con lat y lon
}

function error() {
    console.error("No se pudo obtener la ubicación."); //si falla mostramos esto en consola
}

function obtenerClima(lat, lon) {
    //URL de la API del clima con lat y lon y la apiKey que nos dieron
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`;
    fetch(url) //Hacemos el fetch a la URL
        .then(response => response.json()) //convertimos la respuesta a JSON
        .then(data => {
            mostrarClima(data); //pasamos los datos a la funcion mostrarClima
        })
        .catch(error => {
            console.error("Error al obtener el clima:", error); //
        });
}

function mostrarClima(data) {
    const descripcion = data.weather[0].description; //descripción del clima
    const temperatura = data.main.temp; //temperatura actual
    const lugar = data.name; // Nombre de la ciudad
    const now = new Date(); //fecha y hora actual
    const dia = now.getDate(); // Sacamos el dia del mes
    const mes = f[now.getMonth()]; //sacamos el mes, usando nuestro array f
    const anio = now.getFullYear(); //obtengo el anio

    //actualizar dom con datos sacados del clima
    document.getElementById('dia').textContent = `${dia}`; 
    document.getElementById('mes').textContent = `${mes}`;
    document.getElementById('anio').textContent = `${anio}`;
    document.getElementById('lugar').textContent = `Ciudad: ${lugar}`;
    document.getElementById('descripcion').textContent = `Clima: ${descripcion}`;
    document.getElementById('temperatura').textContent = `Temperatura: ${temperatura}°C`;
}
