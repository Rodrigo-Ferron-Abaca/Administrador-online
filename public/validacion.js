function enviarRegistroAlServidor() {
  var formulario = document.getElementsByName("Estacionamiento")[0];
  var username = formulario.username.value.trim();
  var password = formulario.password.value;
  var email = formulario.email.value.trim();

  // Crea un objeto para representar los datos 
  var usuariosR = {
    username: username,
    password: password,
    email: email,
  };

  // Realiza una solicitud POST al servidor para enviar el objeto JSON
  fetch('/registrar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(usuariosR), // convierte usuariosR a objeto JSON y lo envía
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert('Registro exitoso. Los datos se han guardado correctamente.');
      } else {
        alert('Error al registrar los datos.');
      }
    })
    .catch((error) => {
      console.error('Error al enviar el registro al servidor:', error);
    });

  // Restablece el formulario
  formulario.reset();
}

var formulario = document.getElementsByName("Estacionamiento")[0];
formulario.addEventListener("submit", function (e) {
  e.preventDefault(); // Previene el envío automático del formulario
  enviarRegistroAlServidor();
});
