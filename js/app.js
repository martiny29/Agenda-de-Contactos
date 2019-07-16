const formularioContactos = document.querySelector('#contacto'),
      listadoContactos = document.querySelector('#listado-contactos tbody'),
      inputBuscador = document.querySelector('#buscar');


eventListeners();

function eventListeners() {
    //Cuando el formulario de crear o editar se ejecuta
    formularioContactos.addEventListener('submit', leerFormulario);

    //listener para eliminar el boton
    if(listadoContactos) {
        listadoContactos.addEventListener('click', eliminarContacto);
    }

    //buscador
    if(inputBuscador) {
        inputBuscador.addEventListener('input', buscarContactos);
    }

    numeroContactos();
};

function leerFormulario(e) {
    e.preventDefault();

    //Leer los datos de los inputs
    const nombre = document.querySelector('#nombre').value,
          empresa = document.querySelector('#empresa').value,
          telefono = document.querySelector('#telefono').value,
          accion = document.querySelector('#accion').value;

    if (nombre === '' || empresa === '' || telefono === '') {
        mostrarNotificacion('Todos los campos son obligatorios', 'error');
    } else {
        //Pasa la validación, crear llamado a Ajax
        const infoContacto = new FormData();
        infoContacto.append('nombre', nombre);
        infoContacto.append('empresa', empresa);
        infoContacto.append('telefono', telefono);
        infoContacto.append('accion', accion);        

        if (accion === 'crear') {
            //crearemos un nuevo contacto
            insertarBD(infoContacto);
        } else {
            //editamos un contacto
            //leer el id
            const idRegistro =  document.querySelector('#id').value;
            infoContacto.append('id', idRegistro);
            actualizarRegistro(infoContacto);
        };
    };
};

//Inserta en la base de datos via AJAX
function insertarBD(datos) {
    //llamar a Ajax

    //crear el objeto
    const xhr = new XMLHttpRequest();

    //abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);

    //pasar los datos
    xhr.onload = function () {
        if (this.status === 200) {
            //console.log(JSON.parse(xhr.responseText));
            
            //leemos la respuesta de PHP
            const respuesta = JSON.parse(xhr.responseText);
            
            //inserta un nuevo elemento a la tabla
            const nuevoContacto = document.createElement('tr');

            nuevoContacto.innerHTML = `
                <td>${respuesta.datos.nombre}</td>
                <td>${respuesta.datos.empresa}</td>
                <td>${respuesta.datos.telefono}</td>
            `;

            //crear contenedor para los botones
            const contenedorAcciones = document.createElement('td');

            //crear icono
            const iconoEditar = document.createElement('i');
            iconoEditar.classList.add('fas', 'fa-pen-square');

            //crea enlace para editar
            const btnEditar =  document.createElement('a');
            btnEditar.appendChild(iconoEditar);
            btnEditar.href = `editar.php?id=${respuesta.datos.id_insertado}`;
            btnEditar.classList.add('btn-editar', 'btn');

            //crear el icono de eliminar
            const iconoEliminar = document.createElement('i');
            iconoEliminar.classList.add('fas', 'fa-trash-alt');

            //crear boton eliminar
            const btnEliminar = document.createElement('button');
            iconoEliminar.classList.add('btn-borrar', 'btn');
            btnEliminar.setAttribute('data-id', respuesta.datos.id_insertado);
            btnEliminar.setAttribute('type', 'button');
            btnEliminar.appendChild(iconoEliminar);

             //agregarlos al padre
             contenedorAcciones.appendChild(btnEditar);
             contenedorAcciones.appendChild(btnEliminar);

             //agregandolo a nuevo contacto (tr)
             nuevoContacto.appendChild(contenedorAcciones);

             //agregando a #listado-contactos tbody
             listadoContactos.appendChild(nuevoContacto);

             //resetear el form
             document.querySelector('form').reset();

             //mostrar notificacion
             mostrarNotificacion('Contacto creado correctamente', 'exito');

             //actualizar el numero
             numeroContactos();
        };
    };

    //enviar los datos
    xhr.send(datos);
}

function actualizarRegistro(datos) {
    //crear el objeto
    const xhr = new XMLHttpRequest();

    //abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);

    //leer la respuesta
    xhr.onload = function() {
        if(this.status === 200) {
            const respuesta = JSON.parse(xhr.responseText);
            if(respuesta.respuesta === 'correcto') {
                //mostrar notificacion
                mostrarNotificacion('Contacto editado correctamente', 'exito');
            } else {
                //hubo un error
                mostrarNotificacion('Hubo un error', 'error');
            }
        }
        //despues de 3 segundos redireccionar 
        setTimeout(() => {
            window.location.href = 'index.php';
        }, 4000);
    }

    //enviar la peticion
    xhr.send(datos);
}

//eliminar el contacto
function eliminarContacto(e) {
    if (e.target.parentElement.classList.contains('btn-borrar')) {
        //tomar el ID
        const id = e.target.parentElement.getAttribute('data-id');
       
        //preguntar al usuario
        const respuesta = confirm('Estás seguro/a?');
        if (respuesta) {
            //llamado a AJAX
            //crear el objeto
            const xhr = new XMLHttpRequest();

            //abrir la conexion
            xhr.open('GET', `inc/modelos/modelo-contactos.php?id=${id}&accion=borrar`, true);

            //leer la respuesta
            xhr.onload = function() {
                if (this.status === 200) {
                    const resultado = JSON.parse(xhr.responseText);

                    if(resultado.respuesta == 'correcto'){
                        //eliminar el registro del dom
                        e.target.parentElement.parentElement.parentElement.remove();

                        //mostrar notificacion
                        mostrarNotificacion('Contacto eliminado', 'exito');

                        //actualizar el numero
                        numeroContactos();
                    } else {
                        //mostramos una notificacion
                        mostrarNotificacion('Hubo un error...', 'error');
                    };
                }
            }

            //enviar la peticion
            xhr.send();
        }
    }
}

//Notificación en pantalla
function mostrarNotificacion(mensaje, clase) {
    const notificacion = document.createElement('div');
    notificacion.classList.add(clase, 'notificacion', 'shadow');
    notificacion.textContent = mensaje;

    //formulario
    formularioContactos.insertBefore(notificacion, document.querySelector('form legend'));

    //Ocultar y mostrar la notificación
    setTimeout(() => {
        notificacion.classList.add('visible');
        
        setTimeout(() => {
            notificacion.classList.remove('visible');
            setTimeout(() => {
                notificacion.remove();
            }, 500);
        }, 3000);
    }, 100);
};

//Buscador de registros
function buscarContactos(e) {
    const expresion = new RegExp(e.target.value, "i"),
          registros = document.querySelectorAll('tbody tr');

          registros.forEach(registro => {
            registro.style.display = 'none';

            if(registro.childNodes[1].textContent.replace(/\s/g, " ").search(expresion) != -1) {
                registro.style.display = 'table-row';
            }
            numeroContactos();
          });
}

//muestra el numero de contactos
function numeroContactos() {
    const totalContactos = document.querySelectorAll('tbody tr'),
          contenedorNumero = document.querySelector('.total-contactos span');

    let total = 0;

    totalContactos.forEach(contacto => {
        if(contacto.style.display === '' || contacto.style.display === 'table-row'){
            total++;
        }
    });

    contenedorNumero.textContent = total;
}