// index.js

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser'); // Agregar cookie-parser

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser()); // Usar cookie-parser

// Asegúrate de que el objeto de usuariosEstacionamientos esté fuera de las rutas
const usuariosEstacionamientos = {};

// Middleware de autenticación
app.use((req, res, next) => {
  const { authToken } = req.cookies; // Cambiar a req.cookies para obtener el token de autenticación desde las cookies

  if (authToken && usuariosEstacionamientos[authToken]) {
    // Si se proporciona un authToken válido, asigna el usuario actual a la solicitud
    req.usuarioActual = usuariosEstacionamientos[authToken];
  } else {
    // Si no se proporciona un authToken válido, asigna un usuario anónimo o realiza otra acción según tus necesidades
    req.usuarioActual = null;
  }

  console.log('Usuario asociado con authToken:', req.usuarioActual);
  next();
});

app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  res.sendFile(indexPath);
});

app.get('/index.js', (req, res) => {
  res.type('application/javascript');
  const indexPath = path.join(__dirname, 'index.js');
  res.sendFile(indexPath);
});

app.use(express.json());

app.post('/registrar', (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    res.status(400).json({ success: false, message: 'Datos de registro incorrectos' });
    return;
  }

  const nuevoUsuario = {
    username,
    password,
    email,
    estacionamientos: [], // Inicialmente, el usuario no tiene estacionamientos
  };

  usuariosEstacionamientos[username] = nuevoUsuario;

  res.json({ success: true });
});

app.post('/login', (req, res) => {
  const { loginUsername, loginPassword } = req.body;

  const usuarioValido = usuariosEstacionamientos[loginUsername];

  if (usuarioValido && usuarioValido.password === loginPassword) {
    // Generar un token de autenticación (esto puede hacerse de manera más segura)
    const authToken = Math.random().toString(36).substring(2, 15);
    // Establecer el authToken en las cookies del cliente
    res.cookie('authToken', authToken);
    console.log("el token generado es :", authToken);
    // Asociar el authToken con el usuario en el servidor
    usuariosEstacionamientos[authToken] = usuarioValido;
    res.redirect('/panelUsuario.html');
  } else {
    res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
  }
});

// En el servidor, recibir y validar los datos
app.post('/guardarEstacionamiento', (req, res) => {
  console.log('Solicitud POST recibida en /guardarEstacionamiento');
  console.log('Datos recibidos:', req.body);

  const { usuarioActual } = req;

  if (!usuarioActual) {
    console.log('Usuario no autenticado');
    res.status(401).json({ success: false, message: 'No se ha iniciado sesión' });
    return;
  }

  console.log('Usuario autenticado:', usuarioActual);

  const { nombreEstacionamiento, tamañoEstacionamiento } = req.body;

  if (!nombreEstacionamiento || isNaN(tamañoEstacionamiento) || parseInt(tamañoEstacionamiento) <= 0) {
    console.log('Datos de estacionamiento incorrectos');
    res.status(400).json({ success: false, message: 'Datos de estacionamiento incorrectos' });
    return;
  }

  console.log("Datos de estacionamiento correctos");

  const nuevoEstacionamiento = {
    nombre: nombreEstacionamiento,
    tamaño: parseInt(tamañoEstacionamiento),
  };

  // Agregar el estacionamiento al usuario
  usuarioActual.estacionamientos.push(nuevoEstacionamiento);

  // Agregar un mensaje a la consola del servidor
  console.log(`Se ha agregado un estacionamiento para el usuario: ${usuarioActual.username}, Nombre: ${nuevoEstacionamiento.nombre}, Tamaño: ${nuevoEstacionamiento.tamaño}`);

  res.json({ success: true, message: 'Estacionamiento guardado con éxito' });
});


app.get('/mostrarEstacionamientos/:username', (req, res) => {
  console.log("cargando estacionamiento y mostrando");
  const { username } = req.params;

  const usuario = usuariosEstacionamientos[username];

  if (usuario) {
    const estacionamientos = usuario.estacionamientos;
    res.json({ success: true, usuario, estacionamientos });
  } else {
    res.status(401).json({ success: false, message: 'Usuario no encontrado' });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});