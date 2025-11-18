// === VARIABLES GLOBALES ===
let jugador1, jugador2, pelota
let goles1 = 0,
  goles2 = 0
let tiempoInicial
let pausado = false
const duracion = 90
let estado = "login" // Empezar en login
const particulas = []
let efectoGol = null
const puntajeMaximo = 100
let animacionTitulo = 0
let menuSeleccion = 0
let confirmacionSeleccion = 0
let imagenCampo

let usuario1 = null  // Datos del jugador 1 logueado
let usuario2 = null  // Datos del jugador 2 logueado
let faseLogin = 1    // 1 = login jugador 1, 2 = login jugador 2
let estadisticasData = null

let modoAuth = "login" // "login" o "register"

let jugadorEstadisticaSeleccionado = 1 // 1 o 2

let campoActivo = 0 // 0: usuario, 1: email (solo registro), 2: password, 3: confirmar password (solo registro)
let inputUsuario = ""
let inputEmail = ""
let inputPassword = ""
let inputConfirmPassword = ""
let mensajeAuth = ""
let mensajeAuthColor = [255, 255, 255]
let cursorVisible = true
let ultimoParpadeo = 0

const hechosHistoricos = [
  "El primer Mundial de Fútbol se jugó en Uruguay en 1930",
  "Pelé es el único jugador en ganar 3 Copas del Mundo (1958, 1962, 1970)",
  "El gol más rápido en un Mundial fue marcado a los 11 segundos por Hakan Şükür",
  "Diego Maradona marcó el 'Gol del Siglo' contra Inglaterra en 1986",
  "Lionel Messi ganó 8 Balones de Oro, más que cualquier otro jugador",
  "Brasil es el único país que ha participado en todos los Mundiales",
  "El partido con más goles fue Austria 7-5 Suiza en el Mundial de 1954",
  "Cristiano Ronaldo es el máximo goleador de selecciones con más de 130 goles",
  "La Copa del Mundo de 2014 tuvo 171 goles, récord del torneo",
  "Zinedine Zidane marcó un gol de cabeza en la final del Mundial 1998",
  "El Real Madrid ha ganado la Champions League 15 veces",
  "Lev Yashin es el único arquero que ha ganado el Balón de Oro (1963)",
  "El fútbol se jugó por primera vez en los Juegos Olímpicos en 1900",
  "La primera Copa América se disputó en Argentina en 1916",
  "Ronaldo Nazário marcó 15 goles en Copas del Mundo, récord hasta 2006",
]

// === CONSTANTES DE P5.JS Y TECLAS ===
const CENTER = "center"
const LEFT = "left"
const RIGHT = "right"
const TOP = "top"
const BOTTOM = "bottom"
const BOLD = "bold"
const NORMAL = "normal"

const UP_ARROW = 38
const DOWN_ARROW = 40
const LEFT_ARROW = 37
const RIGHT_ARROW = 39
const ESCAPE = 27
const TAB = 9
const ENTER = 13
const BACKSPACE = 8
const SPACE = 32

// === CONFIGURACIÓN INICIAL ===
function setup() {
  const canvas = createCanvas(800, 600)
  canvas.parent("gameContainer")
  imagenCampo = loadImage(
    "img/cancha1.jpeg",
  )
  inicializarJuego()
}

// === FUNCIÓN PRINCIPAL DE DIBUJO ===
function draw() {
  dibujarFondoDegradado()

  if (millis() - ultimoParpadeo > 500) {
    cursorVisible = !cursorVisible
    ultimoParpadeo = millis()
  }

  switch (estado) {
    case "login":
      mostrarPantallaLogin()
      break
    case "menu":
      mostrarMenu()
      break
    case "instrucciones":
      mostrarInstrucciones()
      break
    case "estadisticas":
      mostrarEstadisticas()
      break
    case "jugando":
      modoJuego()
      break
    case "pausa":
      modoPausa()
      break
    case "fin":
      mostrarPantallaFinal()
      break
    case "confirmacion":
      mostrarConfirmacionSalida()
      break
  }

  actualizarParticulas()
  animacionTitulo += 0.05
}

function mostrarPantallaLogin() {
  background(30)

  textAlign(CENTER, CENTER)
  fill(255, 215, 0)
  textSize(36)
  textStyle(BOLD)
  text("⚽ INICIO DE SESIÓN ⚽", 400, 60)

  // Indicador de fase
  fill(255)
  textSize(24)
  if (faseLogin === 1) {
    fill(255, 69, 0)
    text("🔴 JUGADOR ROJO", 400, 120)
  } else {
    fill(30, 144, 255)
    text("🔵 JUGADOR AZUL", 400, 120)
  }

  // Mostrar jugador 1 si ya está logueado
  if (usuario1 && faseLogin === 2) {
    fill(34, 197, 94)
    textSize(14)
    text(`✔ Jugador 1: ${usuario1.usuario}`, 400, 150)
  }

  // Campos de autenticación
  mostrarCamposAuth()

  // Mensaje de error/éxito
  if (mensajeAuth) {
    fill(mensajeAuthColor[0], mensajeAuthColor[1], mensajeAuthColor[2])
    textSize(14)
    textAlign(CENTER, CENTER)
    text(mensajeAuth, 400, 550)
  }
}

function mostrarCamposAuth() {
  let yPos = 200

  if (modoAuth === "login") {
    // Campo Usuario
    dibujarCampoInput("Usuario", inputUsuario, 250, yPos, campoActivo === 0)
    yPos += 70

    // Campo Contraseña
    dibujarCampoInput("Contraseña", "*".repeat(inputPassword.length), 250, yPos, campoActivo === 1)
    yPos += 80

    // Botón LOGIN
    fill(59, 130, 246)
    rect(250, yPos, 300, 50, 10)
    fill(255)
    textSize(20)
    textAlign(CENTER, CENTER)
    text("INICIAR SESIÓN", 400, yPos + 25)

    // Link para registro
    yPos += 70
    fill(200)
    textSize(14)
    text("¿No tienes cuenta? Presiona ESC para registrarte", 400, yPos)
  } else {
    // MODO REGISTRO
    fill(255)
    textSize(16)
    textAlign(CENTER, TOP)
    text("Crear Nueva Cuenta", 400, 180)

    yPos = 210

    // Usuario
    dibujarCampoInput("Usuario", inputUsuario, 250, yPos, campoActivo === 0)
    yPos += 60

    // Email
    dibujarCampoInput("Email", inputEmail, 250, yPos, campoActivo === 1)
    yPos += 60

    // Contraseña
    dibujarCampoInput("Contraseña", "*".repeat(inputPassword.length), 250, yPos, campoActivo === 2)
    yPos += 60

    // Confirmar Contraseña
    dibujarCampoInput("Confirmar", "*".repeat(inputConfirmPassword.length), 250, yPos, campoActivo === 3)
    yPos += 70

    // Botón REGISTRAR
    fill(34, 197, 94)
    rect(250, yPos, 300, 50, 10)
    fill(255)
    textSize(20)
    textAlign(CENTER, CENTER)
    text("REGISTRARSE", 400, yPos + 25)

    // Link para login
    yPos += 60
    fill(200)
    textSize(14)
    text("¿Ya tienes cuenta? Presiona ESC para iniciar sesión", 400, yPos)
  }
}

function dibujarCampoInput(label, valor, x, y, activo) {
  // Label
  fill(200)
  textAlign(LEFT, TOP)
  textSize(14)
  textStyle(BOLD)
  text(label, x, y - 20)

  // Input box
  if (activo) {
    stroke(255, 215, 0)
    strokeWeight(2)
  } else {
    stroke(100)
    strokeWeight(1)
  }
  fill(50)
  rect(x, y, 300, 40, 8)
  noStroke()

  // Texto del input
  fill(255)
  textAlign(LEFT, CENTER)
  textSize(16)
  textStyle(NORMAL)
  const textoMostrar = valor || ""
  text(textoMostrar, x + 12, y + 20)

  // Cursor parpadeante
  if (activo && cursorVisible) {
    const cursorX = x + 12 + textWidth(textoMostrar)
    stroke(255, 215, 0)
    strokeWeight(2)
    line(cursorX, y + 10, cursorX, y + 30)
    noStroke()
  }
}

/* ------------------------------------------
   FUNCIONES DE AUTH (LOGIN / REGISTER)
   ------------------------------------------ */

async function procesarLogin() {
  if (inputUsuario.trim() === "" || inputPassword.trim() === "") {
    mensajeAuth = "Por favor completa todos los campos"
    mensajeAuthColor = [239, 68, 68]
    return
  }

  try {
    const response = await fetch("model/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario: inputUsuario.trim(),
        password: inputPassword,
      }),
    })

    const data = await response.json()

    if (!data.success) {
      mensajeAuth = data.message || "Credenciales incorrectas"
      mensajeAuthColor = [239, 68, 68]
      return
    }

    // --- LOGIN EXITOSO ---
    if (faseLogin === 1) {
      usuario1 = data.user
      mensajeAuth = "✔ Jugador 1 confirmado. Ahora login Jugador 2..."
      mensajeAuthColor = [34, 197, 94]

      // Pasar a fase 2
      setTimeout(() => {
        faseLogin = 2
        limpiarCamposAuth()
        mensajeAuth = ""
      }, 1500)
      return
    }

    if (faseLogin === 2) {
      // EVITAR QUE AMBOS USEN LA MISMA CUENTA
      if (data.user.id === usuario1.id) {
        mensajeAuth = "⚠ Ese usuario ya es el Jugador 1. Usa otra cuenta."
        mensajeAuthColor = [239, 68, 68]
        return
      }

      usuario2 = data.user
      mensajeAuth = "✔ Jugador 2 confirmado. ¡A jugar!"
      mensajeAuthColor = [34, 197, 94]

      // COMPLETADO LOS 2 LOGINS
      setTimeout(() => {
        estado = "menu"
        limpiarCamposAuth()
        mensajeAuth = ""
      }, 1500)
      return
    }

  } catch (error) {
    console.error(error)
    mensajeAuth = "Error de conexión con el servidor"
    mensajeAuthColor = [239, 68, 68]
  }
}

async function procesarRegistro() {
  if (inputUsuario.trim() === "" || inputEmail.trim() === "" || inputPassword === "" || inputConfirmPassword === "") {
    mensajeAuth = "Por favor completa todos los campos"
    mensajeAuthColor = [239, 68, 68]
    return
  }

  if (inputPassword !== inputConfirmPassword) {
    mensajeAuth = "Las contraseñas no coinciden"
    mensajeAuthColor = [239, 68, 68]
    return
  }

  try {
    const response = await fetch("model/registro.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario: inputUsuario.trim(),
        email: inputEmail.trim(),
        password: inputPassword,
      }),
    })

    const data = await response.json()

    if (data.success) {
      mensajeAuth = "¡Registro exitoso! Cambiando a login..."
      mensajeAuthColor = [16, 185, 129]
      setTimeout(() => {
        modoAuth = "login"
        limpiarCamposAuth()
        mensajeAuth = ""
      }, 1500)
    } else {
      mensajeAuth = data.message || "Error en el registro"
      mensajeAuthColor = [239, 68, 68]
    }
  } catch (error) {
    console.error(error)
    mensajeAuth = "Error de conexión con el servidor"
    mensajeAuthColor = [239, 68, 68]
  }
}

function limpiarCamposAuth() {
  inputUsuario = ""
  inputEmail = ""
  inputPassword = ""
  inputConfirmPassword = ""
  campoActivo = 0
}

/* ------------------------------------------
   CARGA DE ESTADÍSTICAS
   ------------------------------------------ */

async function cargarEstadisticas() {
  const usuarioSeleccionado = jugadorEstadisticaSeleccionado === 1 ? usuario1 : usuario2
  
  if (!usuarioSeleccionado) return

  try {
    const response = await fetch("model/stats.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usuario: usuarioSeleccionado.usuario }),
    })

    const data = await response.json()

    if (data.success) {
      estadisticasData = data.stats
    } else {
      estadisticasData = null
      console.warn("stats.php respondió sin éxito:", data)
    }
  } catch (error) {
    console.error("Error cargando estadísticas:", error)
    estadisticasData = null
  }
}

/* ------------------------------------------
   INICIALIZACIÓN Y MENÚ
   ------------------------------------------ */

function inicializarJuego() {
  jugador1 = new Jugador(150, [255, 69, 0], 65, 68, 87, 82, "ROJO")
  jugador2 = new Jugador(650, [30, 144, 255], LEFT_ARROW, RIGHT_ARROW, UP_ARROW, 76, "AZUL")
  pelota = new Pelota()
  goles1 = 0
  goles2 = 0
}

function mostrarMenu() {
  push()
  translate(400, 200)
  rotate(sin(animacionTitulo) * 0.02)

  fill(0, 0, 0, 100)
  textAlign(CENTER, CENTER)
  textSize(48)
  textStyle(BOLD)
  text("⚽ FÚTBOL 2D ⚽", 3, 3)

  fill(255, 215, 0)
  text("⚽ FÚTBOL 2D ⚽", 0, 0)
  pop()

  const opciones = ["🎮 JUGAR", "📊 ESTADÍSTICAS", "📋 INSTRUCCIONES", "🚪 CERRAR SESIÓN"]

  textAlign(CENTER, CENTER)
  textSize(24)

  for (let i = 0; i < opciones.length; i++) {
    if (i === menuSeleccion) {
      fill(255, 255, 0)
      rect(250, 280 + i * 50, 300, 40, 10)
      fill(0)
    } else {
      fill(255)
    }
    text(opciones[i], 400, 300 + i * 50)
  }

  fill(255)
  textSize(16)
  text(`🔴 ${usuario1 ? usuario1.usuario : "---"}  vs  🔵 ${usuario2 ? usuario2.usuario : "---"}`, 400, 500)

  fill(200)
  textSize(14)
  text("Usa ↑↓ para navegar, ESPACIO para seleccionar", 400, 550)
}

function mostrarInstrucciones() {
  fill(0, 0, 0, 150)
  rect(0, 0, 800, 600)

  fill(255)
  textAlign(CENTER, CENTER)
  textSize(32)
  textStyle(BOLD)
  text("📋 INSTRUCCIONES", 400, 60)

  textSize(16)
  textStyle(NORMAL)
  textAlign(LEFT, TOP)

  const instrucciones = [
    "🎯 OBJETIVO: Marca más goles que tu oponente",
    "",
    "🔴 JUGADOR ROJO: A/D mover, W saltar, R patear",
    "🔵 JUGADOR AZUL: ← → mover, ↑ saltar, L patear",
    "",
    "⚽ CONTROLES: P pausar, ESPACIO confirmar",
  ]

  let y = 120
  for (const linea of instrucciones) {
    fill(255)
    text(linea, 50, y)
    y += 25
  }

  fill(255, 69, 0)
  rect(300, 500, 200, 40, 10)
  fill(255)
  textAlign(CENTER, CENTER)
  textSize(18)
  text("VOLVER (ESC)", 400, 520)
}

function mostrarEstadisticas() {
  fill(0, 0, 0, 150)
  rect(0, 0, 800, 600)

  // Selector de jugador
  fill(255)
  textAlign(CENTER, CENTER)
  textSize(20)
  text("Selecciona Jugador:", 400, 50)

  // Botón Jugador 1
  if (jugadorEstadisticaSeleccionado === 1) {
    fill(255, 69, 0)
    stroke(255, 215, 0)
    strokeWeight(3)
  } else {
    fill(100)
    noStroke()
  }
  rect(200, 70, 150, 40, 10)
  
  fill(255)
  textSize(16)
  text(`🔴 ${usuario1 ? usuario1.usuario : "---"}`, 275, 90)

  // Botón Jugador 2
  if (jugadorEstadisticaSeleccionado === 2) {
    fill(30, 144, 255)
    stroke(255, 215, 0)
    strokeWeight(3)
  } else {
    fill(100)
    noStroke()
  }
  rect(450, 70, 150, 40, 10)
  
  fill(255)
  text(`🔵 ${usuario2 ? usuario2.usuario : "---"}`, 525, 90)
  
  noStroke()

  // Panel de estadísticas
  fill(255, 255, 255, 250)
  rect(150, 130, 500, 400, 16)

  const usuarioSeleccionado = jugadorEstadisticaSeleccionado === 1 ? usuario1 : usuario2

  fill(jugadorEstadisticaSeleccionado === 1 ? color(255, 69, 0) : color(30, 144, 255))
  rect(150, 130, 500, 60, 16)
  rect(150, 175, 500, 15)

  fill(255)
  textAlign(CENTER, CENTER)
  textSize(24)
  textStyle(BOLD)
  text(usuarioSeleccionado ? usuarioSeleccionado.usuario : "Sin datos", 400, 155)

  if (estadisticasData) {
    const stats = [
      { label: "Victorias", value: estadisticasData.victorias },
      { label: "Derrotas", value: estadisticasData.derrotas },
      { label: "Goles Favor", value: estadisticasData.goles_favor },
      { label: "Goles Contra", value: estadisticasData.goles_contra },
    ]

    let x = 180
    let y = 220
    for (let i = 0; i < stats.length; i++) {
      fill(243, 244, 246)
      rect(x, y, 210, 80, 12)

      fill(107, 114, 128)
      textSize(12)
      textStyle(BOLD)
      text(stats[i].label, x + 105, y + 25)

      fill(30, 58, 138)
      textSize(28)
      textStyle(BOLD)
      text(stats[i].value, x + 105, y + 55)

      x += 230
      if (i === 1) {
        x = 180
        y = 320
      }
    }

    const bottomStats = [
      { label: "Partidos Jugados", value: estadisticasData.partidos },
      { label: "Empates", value: estadisticasData.empates },
    ]

    x = 180
    y = 420
    for (let i = 0; i < bottomStats.length; i++) {
      fill(243, 244, 246)
      rect(x, y, 210, 80, 12)

      fill(107, 114, 128)
      textSize(12)
      textStyle(BOLD)
      text(bottomStats[i].label, x + 105, y + 25)

      fill(30, 58, 138)
      textSize(28)
      textStyle(BOLD)
      text(bottomStats[i].value, x + 105, y + 55)

      x += 230
    }
  } else {
    fill(107, 114, 128)
    textSize(16)
    text("Cargando estadísticas...", 400, 300)
  }

  fill(239, 68, 68)
  rect(300, 545, 200, 35, 10)
  fill(255)
  textSize(16)
  textStyle(BOLD)
  text("VOLVER (ESC)", 400, 562)
}

/* ------------------------------------------
   MODO JUEGO / PAUSA / FIN / CONFIRMACIÓN
   ------------------------------------------ */

function modoJuego() {
  mostrarCancha()

  if (!pausado) {
    jugador1.actualizar()
    jugador2.actualizar()
    jugador1.colisionConJugador(jugador2)
    pelota.actualizar()
    pelota.rebotarConJugador(jugador1)
    pelota.rebotarConJugador(jugador2)
    verificarGol()
    verificarFinJuego()
  }

  jugador1.mostrar()
  jugador2.mostrar()
  pelota.mostrar()

  mostrarMarcadorMejorado()
  mostrarTiempoMejorado()
  mostrarBotonSalir()

  if (efectoGol) {
    mostrarEfectoGol()
  }
}

function modoPausa() {
  fill(0, 0, 0, 150)
  rect(0, 0, 800, 600)

  fill(255)
  textAlign(CENTER, CENTER)
  textSize(32)
  textStyle(BOLD)
  text("PAUSA", 400, 300)

  textSize(14)
  fill(200)
  text("Presiona P para continuar", 400, 350)
  text("Presiona ESPACIO o ESC para salir", 400, 370)
}

function mostrarPantallaFinal() {
  fill(0, 0, 0, 150)
  rect(0, 0, 800, 600)

  fill(255)
  textAlign(CENTER, CENTER)
  textSize(32)
  textStyle(BOLD)
  text("FIN DEL JUEGO", 400, 200)

  textSize(24)
  if (goles1 > goles2) {
    fill(255, 69, 0)
    text(`GANÓ ${usuario1 ? usuario1.usuario : "JUGADOR ROJO"}`, 400, 250)
  } else if (goles2 > goles1) {
    fill(30, 144, 255)
    text(`GANÓ ${usuario2 ? usuario2.usuario : "JUGADOR AZUL"}`, 400, 250)
  } else {
    fill(255)
    text("EMPATE", 400, 250)
  }

  textSize(14)
  fill(200)
  text("Presiona ESPACIO para jugar de nuevo", 400, 300)
  text("Presiona ESC para volver al Menú", 400, 320)

  if ((usuario1 || usuario2) && !window.resultadoGuardado) {
    guardarResultadoPartido(goles1, goles2)
    window.resultadoGuardado = true
  }
}

function mostrarBotonSalir() {
  fill(255, 0, 0)
  rect(680, 20, 100, 30, 5)

  fill(255)
  textAlign(CENTER, CENTER)
  textSize(14)
  textStyle(BOLD)
  text("SALIR (ESC)", 730, 35)
}

function mostrarConfirmacionSalida() {
  mostrarCancha()
  jugador1.mostrar()
  jugador2.mostrar()
  pelota.mostrar()
  mostrarMarcadorMejorado()
  mostrarTiempoMejorado()
  mostrarBotonSalir()

  fill(0, 0, 0, 150)
  rect(0, 0, 800, 600)

  fill(255, 255, 255)
  rect(250, 200, 300, 200, 20)

  fill(0)
  textAlign(CENTER, CENTER)
  textSize(20)
  textStyle(BOLD)
  text("¿Estás seguro de", 400, 250)
  text("volver al Menú?", 400, 275)

  fill(255, 0, 0)
  rect(280, 320, 80, 40, 10)
  fill(255)
  textSize(16)
  text("SÍ", 320, 340)

  fill(0, 150, 0)
  rect(440, 320, 80, 40, 10)
  fill(255)
  text("NO", 480, 340)

  fill(100)
  textSize(12)
  text("Usa ← → para seleccionar, ESPACIO para confirmar", 400, 380)
}

/* ------------------------------------------
   CONTROLES (keyPressed / keyReleased)
   ------------------------------------------ */

function keyPressed(event) {
  if (estado === "login") {
    if (event && event.keyCode === TAB) {
      if (event.preventDefault) event.preventDefault()
      const maxCampos = modoAuth === "login" ? 2 : 4
      campoActivo = (campoActivo + 1) % maxCampos
    } else if (keyCode === ENTER) {
      if (modoAuth === "login") {
        procesarLogin()
      } else {
        procesarRegistro()
      }
    } else if (keyCode === ESCAPE) {
      modoAuth = modoAuth === "login" ? "register" : "login"
      limpiarCamposAuth()
      mensajeAuth = ""
    } else if (keyCode === BACKSPACE) {
      if (event && event.preventDefault) event.preventDefault()
      if (modoAuth === "login") {
        if (campoActivo === 0) inputUsuario = inputUsuario.slice(0, -1)
        else if (campoActivo === 1) inputPassword = inputPassword.slice(0, -1)
      } else {
        if (campoActivo === 0) inputUsuario = inputUsuario.slice(0, -1)
        else if (campoActivo === 1) inputEmail = inputEmail.slice(0, -1)
        else if (campoActivo === 2) inputPassword = inputPassword.slice(0, -1)
        else if (campoActivo === 3) inputConfirmPassword = inputConfirmPassword.slice(0, -1)
      }
    } else if (key && key.length === 1) {
      if (modoAuth === "login") {
        if (campoActivo === 0 && inputUsuario.length < 32) inputUsuario += key
        else if (campoActivo === 1 && inputPassword.length < 32) inputPassword += key
      } else {
        if (campoActivo === 0 && inputUsuario.length < 32) inputUsuario += key
        else if (campoActivo === 1 && inputEmail.length < 64) inputEmail += key
        else if (campoActivo === 2 && inputPassword.length < 32) inputPassword += key
        else if (campoActivo === 3 && inputConfirmPassword.length < 32) inputConfirmPassword += key
      }
    }
    return
  }

  switch (estado) {
    case "menu":
      if (keyCode === UP_ARROW) {
        menuSeleccion = (menuSeleccion - 1 + 4) % 4
      } else if (keyCode === DOWN_ARROW) {
        menuSeleccion = (menuSeleccion + 1) % 4
      } else if (keyCode === SPACE) {
        switch (menuSeleccion) {
          case 0:
            estado = "jugando"
            tiempoInicial = millis()
            inicializarJuego()
            window.resultadoGuardado = false
            break
          case 1:
            estado = "estadisticas"
            cargarEstadisticas()
            break
          case 2:
            estado = "instrucciones"
            break
          case 3:
            usuario1 = null
            usuario2 = null
            faseLogin = 1
            estado = "login"
            limpiarCamposAuth()
            break
        }
      }
      break

    case "instrucciones":
      if (keyCode === ESCAPE) {
        estado = "menu"
      }
      break

    case "estadisticas":
      if (keyCode === LEFT_ARROW) {
        jugadorEstadisticaSeleccionado = 1
        cargarEstadisticas()
      } else if (keyCode === RIGHT_ARROW) {
        jugadorEstadisticaSeleccionado = 2
        cargarEstadisticas()
      } else if (keyCode === ESCAPE) {
        estado = "menu"
      }
      break

    case "jugando":
      if (key === "p" || key === "P") {
        pausado = !pausado
        estado = pausado ? "pausa" : "jugando"
      } else if (keyCode === ESCAPE) {
        estado = "confirmacion"
        confirmacionSeleccion = 1
      } else if (!pausado) {
        jugador1.tecla(key, keyCode, true)
        jugador2.tecla(key, keyCode, true)
      }
      break

    case "pausa":
      if (key === "p" || key === "P") {
        pausado = false
        estado = "jugando"
      } else if (keyCode === ESCAPE) {
        estado = "confirmacion"
        confirmacionSeleccion = 1
      }
      break

    case "confirmacion":
      if (keyCode === LEFT_ARROW) {
        confirmacionSeleccion = 0
      } else if (keyCode === RIGHT_ARROW) {
        confirmacionSeleccion = 1
      } else if (keyCode === SPACE) {
        if (confirmacionSeleccion === 0) {
          estado = "menu"
          pausado = false
        } else {
          estado = "jugando"
        }
      } else if (keyCode === ESCAPE) {
        estado = "jugando"
      }
      break

    case "fin":
      if (keyCode === SPACE) {
        estado = "jugando"
        tiempoInicial = millis()
        inicializarJuego()
        window.resultadoGuardado = false
      } else if (keyCode === ESCAPE) {
        estado = "menu"
      }
      break
  }
}

function keyReleased() {
  if (estado === "login") return

  if (estado === "jugando" && !pausado) {
    jugador1.tecla(key, keyCode, false)
    jugador2.tecla(key, keyCode, false)
  }
}

/* ------------------------------------------
   MOUSE (clicks / move)
   ------------------------------------------ */

function mousePressed() {
  if (estado === "login") {
    const btnY = modoAuth === "login" ? 320 : 490
    if (mouseX >= 250 && mouseX <= 550 && mouseY >= btnY && mouseY <= btnY + 50) {
      if (modoAuth === "login") {
        procesarLogin()
      } else {
        procesarRegistro()
      }
    }
    const linkY = btnY + 90
    if (mouseX >= 200 && mouseX <= 600 && mouseY >= linkY - 10 && mouseY <= linkY + 10) {
      modoAuth = modoAuth === "login" ? "register" : "login"
      limpiarCamposAuth()
      mensajeAuth = ""
    }

    let yPos = 200
    if (mouseX >= 250 && mouseX <= 550 && mouseY >= yPos && mouseY <= yPos + 40) {
      campoActivo = 0
    }
    yPos += 70

    if (modoAuth === "register") {
      if (mouseX >= 250 && mouseX <= 550 && mouseY >= yPos && mouseY <= yPos + 40) {
        campoActivo = 1
      }
      yPos += 60
    }

    if (mouseX >= 250 && mouseX <= 550 && mouseY >= yPos && mouseY <= yPos + 40) {
      campoActivo = modoAuth === "login" ? 1 : 2
    }
    yPos += 70

    if (modoAuth === "register") {
      if (mouseX >= 250 && mouseX <= 550 && mouseY >= yPos && mouseY <= yPos + 40) {
        campoActivo = 3
      }
    }

    return
  }

  if (estado === "estadisticas") {
    if (mouseY >= 70 && mouseY <= 110) {
      if (mouseX >= 200 && mouseX <= 350) {
        jugadorEstadisticaSeleccionado = 1
        cargarEstadisticas()
      } else if (mouseX >= 450 && mouseX <= 600) {
        jugadorEstadisticaSeleccionado = 2
        cargarEstadisticas()
      }
    }
  }

  switch (estado) {
    case "jugando":
      if (mouseX >= 680 && mouseX <= 780 && mouseY >= 20 && mouseY <= 50) {
        estado = "confirmacion"
        confirmacionSeleccion = 1
      }
      break

    case "confirmacion":
      if (mouseX >= 280 && mouseX <= 360 && mouseY >= 320 && mouseY <= 360) {
        estado = "menu"
        pausado = false
      } else if (mouseX >= 440 && mouseX <= 520 && mouseY >= 320 && mouseY <= 360) {
        estado = "jugando"
      }
      break
  }
}

function mouseMoved() {
  let cursor = "default"

  if (estado === "jugando") {
    if (mouseX >= 680 && mouseX <= 780 && mouseY >= 20 && mouseY <= 50) {
      cursor = "pointer"
    }
  } else if (estado === "confirmacion") {
    if (
      (mouseX >= 280 && mouseX <= 360 && mouseY >= 320 && mouseY <= 360) ||
      (mouseX >= 440 && mouseX <= 520 && mouseY >= 320 && mouseY <= 360)
    ) {
      cursor = "pointer"
    }
  } else if (estado === "estadisticas") {
    if (mouseY >= 70 && mouseY <= 110) {
      if ((mouseX >= 200 && mouseX <= 350) || (mouseX >= 450 && mouseX <= 600)) {
        cursor = "pointer"
      }
    }
  } else if (estado === "login") {
    const btnY = modoAuth === "login" ? 320 : 490
    if (mouseX >= 250 && mouseX <= 550 && mouseY >= btnY && mouseY <= btnY + 50) {
      cursor = "pointer"
    }
    const linkY = btnY + 90
    if (mouseX >= 200 && mouseX <= 600 && mouseY >= linkY - 10 && mouseY <= linkY + 10) {
      cursor = "pointer"
    }

    let yPos = 200
    if (mouseX >= 250 && mouseX <= 550) {
      if (mouseY >= yPos && mouseY <= yPos + 40) cursor = "text"
      yPos += 70
      if (modoAuth === "register") {
        if (mouseY >= yPos && mouseY <= yPos + 40) cursor = "text"
        yPos += 60
      }
      if (mouseY >= yPos && mouseY <= yPos + 40) cursor = "text"
      yPos += 70
      if (modoAuth === "register") {
        if (mouseY >= yPos && mouseY <= yPos + 40) cursor = "text"
      }
    }
  }

  const container = document.getElementById("gameContainer")
  if (container) {
    container.style.cursor = cursor
  }
}


class Jugador {
  constructor(x, col, izq, der, salto, patear, nombre) {
    this.x = x
    this.y = 380
    this.vy = 0
    this.color = col
    this.nombre = nombre
    this.radioCabeza = 20
    this.altura = 70
    this.izquierda = false
    this.derecha = false
    this.saltando = false
    this.teclas = { izq, der, salto, patear }
    this.pateando = false
    this.tiempoPateo = 0
    this.velocidad = 3.01
    this.fuerzaSalto = 12
    this.animacion = 0
  }

  actualizar() {
    if (this.izquierda) this.x -= this.velocidad
    if (this.derecha) this.x += this.velocidad

    this.x = constrain(this.x, 50, 750)

    this.vy += 0.6
    this.y += this.vy

    if (this.y > 430) {
      this.y = 430
      this.vy = 0
      this.saltando = false
    }

    if (this.pateando && millis() - this.tiempoPateo > 200) {
      this.pateando = false
    }

    this.animacion += 0.1
  }

  colisionConJugador(otroJugador) {
    const distancia = dist(this.x, this.y, otroJugador.x, otroJugador.y)
    if (distancia < this.radioCabeza * 2) {
      const angulo = Math.atan2(this.y - otroJugador.y, this.x - otroJugador.x)
      const separacion = this.radioCabeza * 2 - distancia

      this.x += Math.cos(angulo) * separacion * 0.5
      this.y += Math.sin(angulo) * separacion * 0.5

      otroJugador.x -= Math.cos(angulo) * separacion * 0.5
      otroJugador.y -= Math.sin(angulo) * separacion * 0.5

      this.x = constrain(this.x, 50, 750)
      otroJugador.x = constrain(otroJugador.x, 50, 750)
      this.y = constrain(this.y, 50, 430)
      otroJugador.y = constrain(otroJugador.y, 50, 430)
    }
  }

  mostrar() {
  push()
  translate(this.x, this.y)

  // Sombra simple
  fill(0, 0, 0, 60)
  ellipse(0, this.altura + 10, this.radioCabeza * 2.5, 6)

  const colorBase = this.color
  const colorPiel = [245, 210, 180]
  
  // Cuello
  fill(colorPiel[0] - 30, colorPiel[1] - 30, colorPiel[2] - 30)
  rect(-3, 12, 6, 6)
  
  // Cabeza ovalada
  fill(colorPiel[0], colorPiel[1], colorPiel[2])
  ellipse(0, 0, this.radioCabeza * 1.8, this.radioCabeza * 2.2)

  // Cabello
  fill(60, 40, 30)
  arc(0, -4, this.radioCabeza * 2, this.radioCabeza * 1.8, PI, TWO_PI)
  
  // Orejas
  fill(colorPiel[0] - 20, colorPiel[1] - 20, colorPiel[2] - 20)
  ellipse(-this.radioCabeza + 1, 1, 5, 7)
  ellipse(this.radioCabeza - 1, 1, 5, 7)

  // Ojos
  fill(255)
  ellipse(-4, -1, 6, 7)
  ellipse(4, -1, 6, 7)
  
  fill(70, 130, 180)
  ellipse(-4, 0, 4, 4)
  ellipse(4, 0, 4, 4)
  
  fill(20, 20, 20)
  ellipse(-4, 0, 2, 2)
  ellipse(4, 0, 2, 2)

  // Cejas
  noFill()
  stroke(60, 40, 30)
  strokeWeight(1.5)
  arc(-4, -5, 5, 3, PI, TWO_PI)
  arc(4, -5, 5, 3, PI, TWO_PI)
  noStroke()

  // Nariz
  fill(colorPiel[0] - 30, colorPiel[1] - 30, colorPiel[2] - 30)
  ellipse(0, 3, 2, 4)

  // Boca
  noFill()
  stroke(180, 80, 80)
  strokeWeight(1.5)
  arc(0, 5, 6, 5, 0, PI)
  noStroke()

  // Camiseta
  fill(colorBase[0], colorBase[1], colorBase[2])
  rect(-11, 20, 22, 26, 3)

  // Cuello de camiseta
  fill(255, 255, 255)
  triangle(-3, 18, 3, 18, 0, 23)
  
  // Número
  fill(255)
  textAlign(CENTER, CENTER)
  textSize(16)
  textStyle(BOLD)
  text(this.nombre === "ROJO" ? "1" : "2", 0, 33)

  // Brazos simples
  fill(colorPiel[0] - 20, colorPiel[1] - 20, colorPiel[2] - 20)
  rect(-14, 24, 5, 18, 3)
  rect(9, 24, 5, 18, 3)
  
  // Manos
  fill(colorPiel[0], colorPiel[1], colorPiel[2])
  ellipse(-11.5, 43, 6, 7)
  ellipse(11.5, 43, 6, 7)

  // Pantalón
  fill(colorBase[0] * 0.5, colorBase[1] * 0.5, colorBase[2] * 0.5)
  rect(-10, 46, 20, 12, 2)

  // Piernas con animación de patear
  if (this.pateando) {
    const piernaPatada = this.nombre === "AZUL" ? -1 : 1
    
    // Pierna que patea (extendida)
    fill(colorPiel[0] - 30, colorPiel[1] - 30, colorPiel[2] - 30)
    
    push()
    translate(piernaPatada * 5, 58)
    rotate(piernaPatada * -0.6)
    rect(-3, 0, 6, 14, 2)
    
    // Media extendida
    fill(colorBase[0] * 0.9, colorBase[1] * 0.9, colorBase[2] * 0.9)
    rect(-2.5, 14, 5, 14, 2)
    
    // Bota
    fill(40, 40, 40)
    ellipse(0, 29, 8, 6)
    pop()
    
    // Pierna de apoyo (normal)
    fill(colorPiel[0] - 30, colorPiel[1] - 30, colorPiel[2] - 30)
    rect(-piernaPatada * 8, 58, 6, 14, 2)
    
    fill(colorBase[0] * 0.9, colorBase[1] * 0.9, colorBase[2] * 0.9)
    rect(-piernaPatada * 7.5, 72, 5, 14, 2)
    
    fill(40, 40, 40)
    ellipse(-piernaPatada * 5, 87, 8, 6)
    
  } else {
    // Piernas normales
    fill(colorPiel[0] - 30, colorPiel[1] - 30, colorPiel[2] - 30)
    rect(-8, 58, 6, 14, 2)
    rect(2, 58, 6, 14, 2)
    
    // Medias
    fill(colorBase[0] * 0.9, colorBase[1] * 0.9, colorBase[2] * 0.9)
    rect(-7.5, 72, 5, 14, 2)
    rect(2.5, 72, 5, 14, 2)
    
    // Botas
    fill(40, 40, 40)
    ellipse(-5, 87, 8, 6)
    ellipse(5, 87, 8, 6)
  }

  pop()

  // Nombre
  fill(0, 0, 0, 140)
  rect(this.x - 28, this.y - 34, 56, 16, 8)
  
  stroke(colorBase[0], colorBase[1], colorBase[2])
  strokeWeight(2)
  rect(this.x - 28, this.y - 34, 56, 16, 8)
  noStroke()
  
  fill(255)
  textAlign(CENTER, CENTER)
  textSize(10)
  textStyle(BOLD)
  text(this.nombre, this.x, this.y - 26)
}

  patear() {
    const pieX = this.pateando ? this.x + 20 : this.x
    const pieY = this.y + 48
    const d = dist(pieX, pieY, pelota.x, pelota.y)

    if (d < 40) {
      let fuerzaX, fuerzaY

      const distanciaPelota = d
      const estaSaltando = this.saltando || this.vy < 0

      if (this.nombre === "AZUL") {
        if (estaSaltando) {
          fuerzaX = -8
          fuerzaY = 0
        } else if (distanciaPelota < 20) {
          fuerzaX = -3
          fuerzaY = -15
        } else {
          fuerzaX = (pelota.x - this.x) * 0.4
          if (fuerzaX > 0) fuerzaX = -Math.abs(fuerzaX)
          fuerzaY = -10
        }
      } else {
        if (estaSaltando) {
          fuerzaX = 8
          fuerzaY = 0
        } else if (distanciaPelota < 20) {
          fuerzaX = 3
          fuerzaY = -15
        } else {
          fuerzaX = (pelota.x - this.x) * 0.4
          if (fuerzaX < 0) fuerzaX = Math.abs(fuerzaX)
          fuerzaY = -10
        }
      }

      pelota.vx += fuerzaX
      pelota.vy = fuerzaY

      crearParticulas(pieX, pieY, this.color, 8)
    }

    this.pateando = true
    this.tiempoPateo = millis()
  }

  tecla(k, kCode, presionada) {
    if (kCode === this.teclas.izq) this.izquierda = presionada
    if (kCode === this.teclas.der) this.derecha = presionada
    if (kCode === this.teclas.salto && !this.saltando && presionada) {
      this.vy = -this.fuerzaSalto
      this.saltando = true
    }
    if (kCode === this.teclas.patear && presionada) this.patear()
  }
}

class Pelota {
  constructor() {
    this.r = 12.75
    this.trail = []
    this.reset()
  }

  reset() {
    this.x = 400
    this.y = 430
    this.vx = Math.random() * 6 - 3
    this.vy = 0
    this.trail = []
    this.rotacion = 0
  }

  actualizar() {
    this.trail.push({ x: this.x, y: this.y })
    if (this.trail.length > 6) {
      this.trail.shift()
    }

    this.x += this.vx
    this.y += this.vy
    this.vy += 0.7
    this.rotacion += this.vx * 0.1

    if (this.y > 500 - this.r) {
      this.y = 500 - this.r
      this.vy *= -0.7
      crearParticulas(this.x, this.y + this.r, [139, 69, 19], 4)
    }

    if (this.x < this.r || this.x > 800 - this.r) {
      this.vx *= -0.8
      this.x = constrain(this.x, this.r, width - this.r)
    }

    this.vx *= 0.995
  }

  mostrar() {
    for (let i = 0; i < this.trail.length; i++) {
      const alpha = map(i, 0, this.trail.length - 1, 0, 80)
      fill(255, 255, 0, alpha)
      const size = map(i, 0, this.trail.length - 1, this.r * 0.5, this.r * 1.5)
      ellipse(this.trail[i].x, this.trail[i].y, size)
    }

    push()
    translate(this.x, this.y)
    rotate(this.rotacion)

    fill(0, 0, 0, 50)
    ellipse(2, 2, this.r * 2)

    fill(255, 255, 0)
    ellipse(0, 0, this.r * 2)

    fill(0)
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI) / 2.5
      const x = Math.cos(angle) * 6
      const y = Math.sin(angle) * 6
      ellipse(x, y, 3)
    }

    pop()
  }

  rebotarConJugador(jugador) {
    const puntos = [
      { x: jugador.x, y: jugador.y },
      { x: jugador.x, y: jugador.y + 25 },
      { x: jugador.x, y: jugador.y + 50 },
    ]

    for (const punto of puntos) {
      this.rebotePunto(punto.x, punto.y)
    }
  }
  rebotePunto(px, py) {
    const d = dist(this.x, this.y, px, py)

    if (d < this.r + 16) {
      const fuerza = map(d, 0, this.r + 16, 6, 3)
      const angle = Math.atan2(this.y - py, this.x - px)

      if (d < 10) {
        this.vy = -fuerza * 1.5
        const direccionAleatoria = random(-1, 1)
        this.vx = direccionAleatoria * fuerza
      } else {
        this.vx = Math.cos(angle) * fuerza
        this.vy = Math.sin(angle) * fuerza

        const separacion = 2
        this.x += Math.cos(angle) * separacion
        this.y += Math.sin(angle) * separacion
      }

      this.x = constrain(this.x, this.r, width - this.r)
      this.y = constrain(this.y, this.r, height - this.r)
    }
  }
}

class Particula {
  constructor(x, y, color) {
    this.x = x
    this.y = y
    this.vx = Math.random() * 8 - 4
    this.vy = Math.random() * -5 - 1
    this.color = color
    this.vida = 40
    this.vidaMaxima = 40
    this.tamaño = Math.random() * 4 + 2
  }

  actualizar() {
    this.x += this.vx
    this.y += this.vy
    this.vy += 0.15
    this.vida--
    this.vx *= 0.98
  }

  mostrar() {
    const alpha = map(this.vida, 0, this.vidaMaxima, 0, 255)
    fill(this.color[0], this.color[1], this.color[2], alpha)
    ellipse(this.x, this.y, this.tamaño)
  }
}


function reiniciarPosiciones() {
  jugador1.x = 150
  jugador1.y = 380
  jugador1.vy = 0
  jugador2.x = 650
  jugador2.y = 380
  jugador2.vy = 0
  pelota.x = 400
  pelota.y = 430
  pelota.vx = Math.random() * 6 - 3
  pelota.vy = 0
  pelota.trail = []
}

function dibujarFondoDegradado() {
  for (let i = 0; i <= 600; i++) {
    const inter = map(i, 0, 600, 0, 1)
    const c = lerpColor(color(30, 60, 120), color(50, 100, 150), inter)
    stroke(c)
    line(0, i, 800, i)
  }
  noStroke()
}

function mostrarCancha() {
  if (imagenCampo) {
    image(imagenCampo, 0, 0, 800, 600)
  } else {
    for (let i = 0; i < 800; i += 40) {
      fill(0, 128, 0)
      if (Math.floor(i / 40) % 2 === 0) {
        fill(0, 100, 0)
      }
      rect(i, 0, 40, 600)
    }

    stroke(255, 255, 255)
    strokeWeight(3)
    line(400, 0, 400, 600)

    noFill()
    ellipse(400, 300, 120)

    fill(255)
    ellipse(400, 300, 6)

    noStroke()
    fill(255, 215, 255)

    rect(0, 450, 12, 120)
    rect(0, 450, 60, 12)
    rect(0, 558, 60, 12)

    rect(788, 450, 12, 120)
    rect(740, 450, 60, 12)
    rect(740, 558, 60, 12)

    fill(255, 255, 255, 100)
    rect(5, 470, 50, 100)
    rect(745, 470, 50, 100)

    noStroke()
  }
}

function mostrarMarcadorMejorado() {
  fill(255)
  textAlign(CENTER, TOP)
  textSize(24)
  textStyle(BOLD)
  text(`${goles1} - ${goles2}`, 400, 50)
}

function mostrarTiempoMejorado() {
  if (!tiempoInicial) return
  const tiempoTranscurrido = (millis() - tiempoInicial) / 1000
  const minutos = Math.floor(tiempoTranscurrido / 60)
  const segundos = Math.floor(tiempoTranscurrido % 60)
  fill(255)
  textAlign(CENTER, TOP)
  textSize(24)
  textStyle(BOLD)
  text(`${minutos}:${segundos < 10 ? "0" + segundos : segundos}`, 400, 100)
}

function crearParticulas(x, y, color, cantidad = 20) {
  for (let i = 0; i < cantidad; i++) {
    particulas.push(new Particula(x, y, color))
  }
}

function actualizarParticulas() {
  for (let i = particulas.length - 1; i >= 0; i--) {
    particulas[i].actualizar()
    particulas[i].mostrar()

    if (particulas[i].vida <= 0) {
      particulas.splice(i, 1)
    }
  }
}

function verificarGol() {
  if (pelota.x < 45 && pelota.y > 350 && pelota.y < 500) {
    goles2++
    const hechoAleatorio = hechosHistoricos[Math.floor(Math.random() * hechosHistoricos.length)]
    efectoGol = { jugador: 2, tiempo: millis(), hecho: hechoAleatorio }
    crearParticulas(pelota.x, pelota.y, [30, 144, 255], 30)
    reiniciarPosiciones()
  }

  if (pelota.x > 760 && pelota.y > 350 && pelota.y < 500) {
    goles1++
    const hechoAleatorio = hechosHistoricos[Math.floor(Math.random() * hechosHistoricos.length)]
    efectoGol = { jugador: 1, tiempo: millis(), hecho: hechoAleatorio }
    crearParticulas(pelota.x, pelota.y, [255, 69, 0], 30)
    reiniciarPosiciones()
  }
}

function verificarFinJuego() {
  if (!tiempoInicial) return
  const tiempoTranscurrido = (millis() - tiempoInicial) / 1000

  if (tiempoTranscurrido >= duracion || goles1 >= puntajeMaximo || goles2 >= puntajeMaximo) {
    estado = "fin"

    if ((usuario1 || usuario2) && !window.resultadoGuardado) {
      guardarResultadoPartido(goles1, goles2)
      window.resultadoGuardado = true
    }
  }
}

async function guardarResultadoPartido(g1, g2) {
  try {
    // Guardar para Jugador 1 si está logueado
    if (usuario1) {
      const response1 = await fetch("model/save_result.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: usuario1.id,
          goles_favor: g1,
          goles_contra: g2,
        }),
      })
      const data1 = await response1.json()
      if (!data1.success) {
        console.error("Error guardando resultado Jugador 1:", data1.message)
      }
    }

    // Guardar para Jugador 2 si está logueado
    if (usuario2) {
      const response2 = await fetch("model/save_result.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: usuario2.id,
          goles_favor: g2,
          goles_contra: g1,
        }),
      })
      const data2 = await response2.json()
      if (!data2.success) {
        console.error("Error guardando resultado Jugador 2:", data2.message)
      }
    }
  } catch (error) {
    console.error("Error guardando resultados del partido:", error)
  }
}

function mostrarEfectoGol() {
  const tiempoTranscurrido = millis() - efectoGol.tiempo;

  if (tiempoTranscurrido < 3000) {
    const alphaMensaje = map(tiempoTranscurrido, 0, 3000, 255, 0);

    fill(255, 255, 0, alphaMensaje);
    textAlign(CENTER, CENTER);
    textSize(48);
    textStyle(BOLD);

    const mensaje = efectoGol.jugador === 1 ? "¡GOL ROJO!" : "¡GOL AZUL!";
    text(mensaje, 400, 200);

    let alphaBox = 255;
    if (tiempoTranscurrido < 200) {
      alphaBox = map(tiempoTranscurrido, 0, 200, 0, 255);
    } else if (tiempoTranscurrido > 2800) {
      alphaBox = map(tiempoTranscurrido, 2800, 3000, 255, 0);
    }

    fill(0, 0, 0, alphaBox * 0.8);
    rect(100, 520, 600, 120, 15);

    stroke(255, 215, 0, alphaBox);
    strokeWeight(3);
    noFill();
    rect(100, 520, 600, 120, 15);
    noStroke();

    fill(255, 215, 0, alphaBox);
    textSize(24);
    text("📚", 400, 545);

    fill(255, 215, 0, alphaBox);
    textSize(16);
    textStyle(BOLD);
    text("¿SABÍAS QUÉ?", 400, 565);

    fill(255, 255, 255, alphaBox);
    textSize(14);
    textStyle(NORMAL);
    textAlign(CENTER, CENTER);
    text(efectoGol.hecho, 400, 585);
  } else {
    efectoGol = null
  }
}
