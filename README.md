Herramienta web para usuarios en el dia a dia:

Utilidad:
	Esta herramienta se hizo con el objetivo de en una sola pagina, englobar temas o actividades que nosotros temenos importantes durante el dia a dia, cosas como la busqueda de clima, la anotacion o recordatorios importantes, y la 	recopilacion de momentos en el album.

 Como funciona:
	El programa esta dirigido a una red de usuarios que se registren o se logeen primero a la web con un usuario y contrasenia, de esto se le apareceran una pagina principal donde encontraran tres opciones posibles, un bloc de notas en donde podran editar, crear y eliminar las notas; un album de fotos para guardar y un notificador de clima dependiendo de tu region, todos estos datos (a excepcion del clima que se va actualizando) se guardaran independientemente de si el usuario abandona la sesion o no.

	Considere este Proyecto y lo elegi porque fue uno de los primeros en los que pude aplicar con éxito tecnologías diferentes como ejercicios que considero que me costaron mas, se uso MongoDB para la gestión de datos NoSQL, Cloudinary para el almacenamiento y gestión de imágenes, y EJS para la renderización dinámica de contenido, Cloudinary facilitó la integración del almacenamiento de imágenes en la nube, asegurando que las imágenes pudieran ser fácilmente gestionadas y accedidas por solo URL. La utilización de 	multiples herramientas de parte de javascript como es el caso de EJS que me permitió la generacion dinamica de el contenido que tenia almacenado de las notas como de las imagenes desde la base de datos y ademas de node.js que se 	encarga de la conectividad con esta ultima.

Problemas principals y soluciones encontrados:

	En el desarrollo de la herramienta web fue la gestión de la creación y eliminación de notas, en particular, la correcta sincronización y respuesta de los botones asociados. Inicialmente, tuve problemas con la interacción de los 	botones de creación y eliminación de notas. Los problemas se manifestaron en la falta de respuesta al intentar actualizar o eliminar notas, así como en la necesidad de realizar cambios de manera eficiente sin afectar la 	experiencia del usuario.
	Para manejar la creación, actualización y eliminación de notas, se usaron funciones en JavaScript que hacen peticiones al servidor con fetch. Esto permitio enviar datos al servidor y obtener respuestas sin tener que recargar la 	página, lo que hizo que los cambios se reflejaran de manera rápida y sin interrupciones.

	Tambien llegue a ver que las notas no se guardaban ni se actualizaban correctamente, entre prueba y prueba vi que a la hora de crear una Nueva nota en blanco, ahora si me daba la posibilidad de guardar como borrar todas las demas. 	Entonces la solución mas sencilla aunque talvez no la mas ordenada que tuve fue que implemente una nota occulta al cargar la página. Esta nota oculta funcionaba ahora si para que las notas hicieran sus actualizaciones. Aunque no 	era una solución ideal, permitió mantener la funcionalidad deseada sin afectar la interfaz del usuario realmente.

	En la eliminacion de notas que al ver que no se borraban de la base de datos, encontre que en versiones actuales en las que trabaja mongodb no tenia funciones como las de remove(), entonces busque de que tipo servian ahora y asi 	fue como implmente el uso de findbyIdAndDelete(), que me permitia que por medio del id de la nota que se guardo en ese momento, la buscara y la borrara.
	



Posibles mejoras:
	-De entre las mejoras que le veo a este Proyecto creo que estaria bien una implementacion de emojis dentro de las notas, para crear mas variedad al texto, Tambien considero que estaria bien poder cambiar el estilo de texto de cada 	nota como en word asi como subrayados o textos en negritas como solemos utilizer.
	-En el apartado de album considero que es la parte que mas se puede explotar, ya que es una version primitiva de lo que nosotros temenos en nuestras galerias, empezaria talvez en crear una seleccion entre varios tipos de albumes y 	una distribucion mas interesante y mas estilizable entre imagenes como seria el caso de Pinterest.
	-En el apartado de clima siento que tampoco se puede ir mucho ahi, pero si me hubiera gustado implementar una seccion de noticias, de compras relacionadas o cercanas a mi ubicacion (al ya tenerla almacenada actualmente), como una 	especie de web scrappers, teniendolo todo en uno.



Librerias necesarias: 
	Express - Para crear el servidor y gestionar rutas.
	Mongoose - interactuar con MongoDB y gestionar esquemas de datos.
	dotenv carga variables de entorno desde un archivo .env.

	bcryptjs - encripta contraseñas y comparar hashes.

	multer - maneja la carga de archivos (subida de imágenes).
	multer-storage-cloudinary - almacen de imágenes directamente en Cloudinary desde multer.

	cloudinary - gestion y configurar Cloudinary en tu aplicación.

	express-session - sesiones de user
	ejs - renderización de vistas en el servidor usando plantillas EJS.

Para su ejecucion se necesita de una cuenta en cloudify y un cluster en mongodb para la utilizacion de la base de datos.

 
