// panelUsuario.js 
//funcionalidad del usuario importante ⤵

// Comprobar si el usuario está autenticado usando el token de autenticación almacenado en las cookies
const authToken = (document.cookie.replace(/(?:(?:^|.*;\s*)authToken\s*=\s*([^;]*).*$)|^.*$/, '$1')).trim();

if (!authToken) {
  // Si no se encuentra el token de autenticación, el usuario no está autenticado
  alert('Debes iniciar sesión para guardar estacionamientos.');
} else {
  // Si el usuario está autenticado, continuar con el código
  console.log('Usuario autenticado como:', authToken);

  // Objeto para representar al usuario actual (obtenido mediante el token de autenticación)
  let usuarioActual = null;

  // Obtener el formulario para crear estacionamientos
  const crearEstacionamientoForm = document.getElementById('crearEstacionamientoForm');

  // Evento para el formulario de creación de estacionamientos
  crearEstacionamientoForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evitar que el formulario se envíe

    // Obtener los valores ingresados por el usuario
    const nombreEstacionamiento = document.getElementById('nombreEstacionamiento').value;
    const tamañoEstacionamiento = parseInt(document.getElementById('tamañoEstacionamiento').value);

    // Crear un objeto para representar el estacionamiento
    const estacionamiento = {
      nombreEstacionamiento: nombreEstacionamiento,
      tamañoEstacionamiento: tamañoEstacionamiento,
    };

    try {
      // Realizar una solicitud POST al servidor para guardar el estacionamiento
      console.log('Enviando solicitud POST a /guardarEstacionamiento:', estacionamiento);
      const response = await fetch('/guardarEstacionamiento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(estacionamiento),
      });

      const data = await response.json();

      if (data.success) {
        // Actualizar la lista de estacionamientos en la página
        mostrarEstacionamientos();
        agregarOpcionAlSelect(nombreEstacionamiento);
        console.log('Formulario de estacionamiento enviado');
      } else {
        alert('Error al guardar el estacionamiento.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
    
    // Evento para el formulario de agregar elementos al array
    const arrayForm = document.getElementById('arrayForm');
    arrayForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Evitar que el formulario se envíe
    
      // Obtener los valores ingresados por el usuario
      const patente = document.getElementById('patente').value;
      const dueño = document.getElementById('dueño').value;
      const telefono = document.getElementById('telefono').value;
      const posicion = parseInt(document.getElementById('posicion').value);
    
      // Obtener el nombre del estacionamiento seleccionado
      const selectedOption = document.getElementById('Estacionamientos').options[document.getElementById('Estacionamientos').selectedIndex];
      const nombreEstacionamientoSeleccionado = selectedOption.value;
    
      // Comprobar si ya existe un array para este estacionamiento en el almacenamiento local
      const almacenamientoLocalKey = `estacionamiento_${nombreEstacionamientoSeleccionado}`;
      let nuevoArrayEstacionamiento;
    
      if (localStorage.getItem(almacenamientoLocalKey)) {
        // Si existe, cargar el array desde el almacenamiento local
        nuevoArrayEstacionamiento = JSON.parse(localStorage.getItem(almacenamientoLocalKey));
        console.log(`Array cargado desde el almacenamiento local para "${nombreEstacionamientoSeleccionado}" (Tamaño: ${nuevoArrayEstacionamiento.length}):`, nuevoArrayEstacionamiento);
    
        // Verificar si la posición ingresada es válida
        if (posicion >= 0 && posicion < nuevoArrayEstacionamiento.length) {
          // Agregar el elemento en la posición especificada
          nuevoArrayEstacionamiento[posicion] = {
            patente: patente,
            dueño: dueño,
            telefono: telefono,
          };
    
          // Actualizar el almacenamiento local con el nuevo estado del array
          localStorage.setItem(almacenamientoLocalKey, JSON.stringify(nuevoArrayEstacionamiento));
    
          // Mostrar los elementos actualizados del array
          mostrarElementosDelArray(nombreEstacionamientoSeleccionado);
          console.log(`Elemento agregado en la posición ${posicion}`);
        } else {
          // Mostrar un mensaje de error si la posición ingresada no es válida
          console.error('Posición no válida. Debe estar entre 0 y el tamaño del estacionamiento.');
        }
      } else {
        // Mostrar un mensaje de error si no se encuentra el array para el estacionamiento en el almacenamiento local
        console.error(`No se encontró el array para el estacionamiento "${nombreEstacionamientoSeleccionado}" en el almacenamiento local.`);
      }
    });


    function mostrarElementosDelArray(nombreEstacionamiento) {
      // Obtener el elemento <div> donde se mostrarán los elementos del array
      const elementosArrayDiv = document.getElementById('elementosArray');
    
      // Obtener el array del almacenamiento local
      const almacenamientoLocalKey = `estacionamiento_${nombreEstacionamiento}`;
      const arrayEstacionamiento = JSON.parse(localStorage.getItem(almacenamientoLocalKey));
    
      // Limpiar la lista anterior
      elementosArrayDiv.innerHTML = '';
    
      // Iterar a través del array y agregar elementos como <div>
      for (let i = 0; i < arrayEstacionamiento.length; i++) {
        const elemento = arrayEstacionamiento[i];
        const elementoDiv = document.createElement('div');
        
        // Crear un <p> para mostrar "Elemento ${i}"
        const elementoTitulo = document.createElement('p');
        elementoTitulo.textContent = `Espacio ${i}`;
        elementoTitulo.style.fontWeight = 'bold'; // Aplicar negrita al texto
        
        // Crear un <p> para mostrar la patente
        const elementoP1 = document.createElement('p');
        elementoP1.textContent = `Patente: ${elemento ? elemento.patente : 'N/A'}`;
        
        // Crear <p> para mostrar el dueño y el teléfono
        const elementoP2 = document.createElement('p');
        elementoP2.textContent = `Dueño: ${elemento ? elemento.dueño : 'N/A'}`;
        
        const elementoP3 = document.createElement('p');
        elementoP3.textContent = `Teléfono: ${elemento ? elemento.telefono : 'N/A'}`;
        
        // Añadir los <p> al <div>
        elementoDiv.appendChild(elementoTitulo);
        elementoDiv.appendChild(elementoP1);
        elementoDiv.appendChild(elementoP2);
        elementoDiv.appendChild(elementoP3);
        
        // Aplicar estilos al div según las condiciones
        if (elemento && elemento.patente !== 'N/A' && elemento.dueño !== 'N/A' && elemento.telefono !== 'N/A') {
          elementoDiv.style.backgroundColor = 'rgb(245, 134, 125)';
        } else {
          elementoDiv.style.backgroundColor = 'rgba(194, 255, 114, 0.836)';
        }

        // Añadir el <div> al contenedor principal
        elementosArray.appendChild(elementoDiv);
      }
    }
    


    // Función para mostrar estacionamientos
    function mostrarEstacionamientos() {
    // Obtener el elemento HTML donde se mostrarán los estacionamientos
    const listaEstacionamientos = document.getElementById('listaEstacionamientos');

    // Limpiar la lista anterior
    listaEstacionamientos.innerHTML = '';

    // Crear un elemento de lista para mostrar el estacionamiento
    const itemEstacionamiento = document.createElement('div'); // Cambiado a div

    // Crear un formulario para seleccionar el estacionamiento
    const formularioEstacionamiento = document.createElement('form');
    formularioEstacionamiento.action = '#';

    const labelEstacionamiento = document.createElement('label');
    labelEstacionamiento.textContent = '';

    const selectEstacionamiento = document.createElement('select');
    selectEstacionamiento.name = 'Estacionamientos';
    selectEstacionamiento.id = 'Estacionamientos';

    // Iterar a través de los estacionamientos del usuario actual y crear opciones para el select
    for (const estacionamiento of usuarioActual.estacionamientos) {
      const optionEstacionamiento = document.createElement('option');
      optionEstacionamiento.value = estacionamiento.nombre;
      optionEstacionamiento.textContent = estacionamiento.nombre;
      selectEstacionamiento.appendChild(optionEstacionamiento);
    }

    const inputSubmit = document.createElement('input');
    inputSubmit.type = 'submit';
    inputSubmit.value = 'Seleccionar Estacionamiento';

    // Evento para seleccionar un estacionamiento
    inputSubmit.addEventListener('click', (e) => {
      e.preventDefault();
      const selectedOption = selectEstacionamiento.options[selectEstacionamiento.selectedIndex];
      const nombreEstacionamientoSeleccionado = selectedOption.value;
      const tamañoEstacionamientoSeleccionado = usuarioActual.estacionamientos.find(estacionamiento => estacionamiento.nombre === nombreEstacionamientoSeleccionado).tamaño;

      // Comprobar si ya existe un array para este estacionamiento en el almacenamiento local
      const almacenamientoLocalKey = `estacionamiento_${nombreEstacionamientoSeleccionado}`;
      let nuevoArrayEstacionamiento;

      if (localStorage.getItem(almacenamientoLocalKey)) {
        // Si existe, cargar el array desde el almacenamiento local
        nuevoArrayEstacionamiento = JSON.parse(localStorage.getItem(almacenamientoLocalKey));
        console.log(`Array cargado desde el almacenamiento local para "${nombreEstacionamientoSeleccionado}" (Tamaño: ${tamañoEstacionamientoSeleccionado}):`, nuevoArrayEstacionamiento);
      } else {
        // Si no existe, crear un nuevo array
        nuevoArrayEstacionamiento = new Array(tamañoEstacionamientoSeleccionado);
        console.log(`Nuevo array de estacionamiento creado para "${nombreEstacionamientoSeleccionado}" (Tamaño: ${tamañoEstacionamientoSeleccionado}):`, nuevoArrayEstacionamiento);

        // Guardar el nuevo array en el almacenamiento local
        localStorage.setItem(almacenamientoLocalKey, JSON.stringify(nuevoArrayEstacionamiento));
      }

      const elementosArray = document.getElementById('elementosArray');
      elementosArray.innerHTML = ''; // Limpiar elementos anteriores
      
      for (let i = 0; i < nuevoArrayEstacionamiento.length; i++) {
        const elemento = nuevoArrayEstacionamiento[i];
        const elementoDiv = document.createElement('div');
        
        // Crear un <p> para mostrar "Elemento ${i}"
        const elementoTitulo = document.createElement('p');
        elementoTitulo.textContent = `Espacio ${i}`;
        elementoTitulo.style.fontWeight = 'bold'; // Aplicar negrita al texto
        
        // Crear un <p> para mostrar la patente
        const elementoP1 = document.createElement('p');
        elementoP1.textContent = `Patente: ${elemento ? elemento.patente : 'N/A'}`;
        
        // Crear <p> para mostrar el dueño y el teléfono
        const elementoP2 = document.createElement('p');
        elementoP2.textContent = `Dueño: ${elemento ? elemento.dueño : 'N/A'}`;
        
        const elementoP3 = document.createElement('p');
        elementoP3.textContent = `Teléfono: ${elemento ? elemento.telefono : 'N/A'}`;
        
        // Añadir los <p> al <div>
        elementoDiv.appendChild(elementoTitulo);
        elementoDiv.appendChild(elementoP1);
        elementoDiv.appendChild(elementoP2);
        elementoDiv.appendChild(elementoP3);
        
        // Añadir el <div> al contenedor principal
        elementosArray.appendChild(elementoDiv);
      }
      
    });

    // Agregar todos los elementos al formulario
    formularioEstacionamiento.appendChild(labelEstacionamiento);
    formularioEstacionamiento.appendChild(selectEstacionamiento);
    formularioEstacionamiento.appendChild(inputSubmit);

    // Agregar el formulario al elemento de lista
    itemEstacionamiento.appendChild(formularioEstacionamiento);

    // Agregar el elemento de lista a la lista de estacionamientos
    listaEstacionamientos.appendChild(itemEstacionamiento);

    console.log('Estacionamientos mostrados en la página');
    }

    // Función para agregar una nueva opción al elemento select
    function agregarOpcionAlSelect(nombre) {
    const selectEstacionamientos = document.getElementById('Estacionamientos');

    // Crear una nueva opción
    const nuevaOpcion = document.createElement('option');
    nuevaOpcion.value = nombre;
    nuevaOpcion.textContent = nombre;

    // Agregar la nueva opción al final del select
    selectEstacionamientos.appendChild(nuevaOpcion);
    }

    async function obtenerYMostrarEstacionamientos() {
    // Comprobar si el usuario está autenticado
    if (!authToken) {
      return;
    }

    try {
      // Realizar una solicitud al servidor para obtener los estacionamientos del usuario
      const response = await fetch(`/mostrarEstacionamientos/${authToken}`);
      const data = await response.json();
  
      if (data.success) {
        usuarioActual = data.usuario;
        // Mueve la llamada a mostrarEstacionamientos al final de la función
      } else {
        alert('Error al obtener los estacionamientos del usuario.');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      // Agregar un mensaje a la consola al final de la función
      console.log('Obtención y muestra de estacionamientos completada');
      // Llama a mostrarEstacionamientos aquí para asegurarte de que usuarioActual esté definido
      mostrarEstacionamientos();
    }
    }

    // Llamar a la función para obtener y mostrar los estacionamientos al cargar la página
    obtenerYMostrarEstacionamientos();

    // Obtener el formulario para vaciar un espacio en el array seleccionado
    const vaciarEspacioForm = document.getElementById('vaciarEspacioForm');

    // Evento para el formulario de vaciar un espacio en el array
    vaciarEspacioForm.addEventListener('submit', (e) => {
      e.preventDefault();
    
      // Obtener la posición ingresada por el usuario
      const posicionVacia = parseInt(document.getElementById('posicionVacia').value);
    
      // Obtener el nombre del estacionamiento seleccionado
      const selectedOption = document.getElementById('Estacionamientos').options[document.getElementById('Estacionamientos').selectedIndex];
      const nombreEstacionamientoSeleccionado = selectedOption.value;
    
      // Comprobar si ya existe un array para este estacionamiento en el almacenamiento local
      const almacenamientoLocalKey = `estacionamiento_${nombreEstacionamientoSeleccionado}`;
      let nuevoArrayEstacionamiento;
    
      if (localStorage.getItem(almacenamientoLocalKey)) {
        // Si existe, cargar el array desde el almacenamiento local
        nuevoArrayEstacionamiento = JSON.parse(localStorage.getItem(almacenamientoLocalKey));
        console.log(`Estacionamiento cargado desde el almacenamiento local para "${nombreEstacionamientoSeleccionado}" (Tamaño: ${nuevoArrayEstacionamiento.length}):`, nuevoArrayEstacionamiento);
    
        // Verificar si la posición ingresada es válida
        if (posicionVacia >= 0 && posicionVacia < nuevoArrayEstacionamiento.length) {
          // Vaciar el espacio en la posición especificada
          nuevoArrayEstacionamiento[posicionVacia] = null;
          console.log(`Espacio desocupado en la posición ${posicionVacia}`);
    
          // Actualizar el almacenamiento local con el nuevo estado del array
          localStorage.setItem(almacenamientoLocalKey, JSON.stringify(nuevoArrayEstacionamiento));
    
          // Llamar a la función para mostrar elementos del array y actualizar la lista en el HTML
          mostrarElementosDelArray(nombreEstacionamientoSeleccionado);
        } else {
          // Mostrar un mensaje de error si la posición ingresada no es válida
          console.error('Posición no válida. Debe estar entre 0 y el tamaño del estacionamiento.');
        }
      } else {
        // Mostrar un mensaje de error si no se encuentra el array en el almacenamiento local
        console.error(`No se encontró el array para el estacionamiento "${nombreEstacionamientoSeleccionado}" en el almacenamiento local.`);
      }
    });
}
