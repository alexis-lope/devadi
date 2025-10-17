// === VARIABLES GLOBALES ===
let jugador1, jugador2, pelota
let goles1 = 0,
  goles2 = 0
let tiempoInicial
let pausado = false
const duracion = 90
let estado = "menu" // "menu", "instrucciones", "jugando", "pausa", "fin", "confirmacion"
let particulas = []
let efectoGol = null
const puntajeMaximo = 5
let animacionTitulo = 0
let menuSeleccion = 0
let confirmacionSeleccion = 0 // Variable para controlar selección en confirmación
let imagenCampo // Agregando variable para la imagen del campo
const coloresFondo = {
  cesped1: [0, 128, 0],
  cesped2: [0, 100, 0],
  lineas: [255, 255, 255],
  porteria: [255, 215, 255],
  area: [255, 255, 255, 100],
}

// === CONSTANTES DE P5.JS ===
const CENTER = "center"
const LEFT = "left"
const RIGHT = "right"
const TOP = "top"
const BOTTOM = "bottom"
const BOLD = "bold"
const NORMAL = "normal"

// === VARIABLES GLOBALES DE P5.JS ===
let key = ""
let keyCode = 0

// === CÓDIGOS DE TECLAS ===
const UP_ARROW = 38
const DOWN_ARROW = 40
const LEFT_ARROW = 37
const RIGHT_ARROW = 39
const ESCAPE = 27

// === CONFIGURACIÓN INICIAL ===
function setup() {
  const canvas = createCanvas(800, 600)
  canvas.parent("gameContainer")
  imagenCampo = loadImage(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2.jpg-mL2NgEz0Og7hiWN1JuAIWWu288Xt7S.jpeg",
  )
  inicializarJuego()
}

function inicializarJuego() {
  jugador1 = new Jugador(150, [255, 69, 0], "a", "d", "w", "r", "ROJO")
  jugador2 = new Jugador(650, [30, 144, 255], LEFT_ARROW, RIGHT_ARROW, UP_ARROW, 76, "AZUL")
  pelota = new Pelota()
  pelota.y = 430
  particulas = []
  efectoGol = null
  goles1 = goles2 = 0
  resetearPosicionesJugadores()
}

function resetearPosicionesJugadores() {
  jugador1.x = 150
  jugador1.y = 380
  jugador1.vy = 0
  jugador2.x = 650
  jugador2.y = 380
  jugador2.vy = 0
}

// === FUNCIÓN PRINCIPAL DE DIBUJO ===
function draw() {
  dibujarFondoDegradado()

  switch (estado) {
    case "menu":
      mostrarMenu()
      break
    case "instrucciones":
      mostrarInstrucciones()
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

// === FUNCIONES DE PANTALLAS ===
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

  const opciones = ["🎮 JUGAR", "📋 INSTRUCCIONES"]

  textAlign(CENTER, CENTER)
  textSize(24)

  for (let i = 0; i < opciones.length; i++) {
    if (i === menuSeleccion) {
      fill(255, 255, 0)
      rect(300, 280 + i * 50, 200, 40, 10)
      fill(0)
    } else {
      fill(255)
    }
    text(opciones[i], 400, 300 + i * 50)
  }

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
    "🔵 JUGADOR AZUL: ←/→ mover, ↑ saltar, L patear",
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
    text("GANÓ EL JUGADOR ROJO", 400, 250)
  } else if (goles2 > goles1) {
    fill(30, 144, 255)
    text("GANÓ EL JUGADOR AZUL", 400, 250)
  } else {
    fill(255)
    text("EMPATE", 400, 250)
  }

  textSize(14)
  fill(200)
  text("Presiona ESPACIO para jugar de nuevo", 400, 300)
  text("Presiona ESC para volver al Menú", 400, 320)
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
  // Mostrar el juego de fondo con transparencia
  mostrarCancha()
  jugador1.mostrar()
  jugador2.mostrar()
  pelota.mostrar()
  mostrarMarcadorMejorado()
  mostrarTiempoMejorado()
  mostrarBotonSalir()

  // Overlay oscuro
  fill(0, 0, 0, 150)
  rect(0, 0, 800, 600)

  // Ventana de confirmación
  fill(255, 255, 255)
  rect(250, 200, 300, 200, 20)

  fill(0)
  textAlign(CENTER, CENTER)
  textSize(20)
  textStyle(BOLD)
  text("¿Estás seguro de", 400, 250)
  text("volver al Menú?", 400, 275)

  // Botón SÍ
  fill(255, 0, 0)
  rect(280, 320, 80, 40, 10)
  fill(255)
  textSize(16)
  text("SÍ", 320, 340)

  // Botón NO
  fill(0, 150, 0)
  rect(440, 320, 80, 40, 10)
  fill(255)
  text("NO", 480, 340)

  // Instrucciones
  fill(100)
  textSize(12)
  text("Usa ← → para seleccionar, ESPACIO para confirmar", 400, 380)
}

// === FUNCIONES DE INTERFAZ ===
function mostrarCancha() {
  if (imagenCampo) {
    image(imagenCampo, 0, 0, 800, 600)
  } else {
    // Fallback al campo original si la imagen no carga
    for (let i = 0; i < 800; i += 40) {
      fill(coloresFondo.cesped1[0], coloresFondo.cesped1[1], coloresFondo.cesped1[2])
      if (Math.floor(i / 40) % 2 === 0) {
        fill(coloresFondo.cesped2[0], coloresFondo.cesped2[1], coloresFondo.cesped2[2])
      }
      rect(i, 0, 40, 600)
    }

    stroke(coloresFondo.lineas[0], coloresFondo.lineas[1], coloresFondo.lineas[2])
    strokeWeight(3)
    line(400, 0, 400, 600)

    noFill()
    ellipse(400, 300, 120)

    fill(255)
    ellipse(400, 300, 6)

    noStroke()
    fill(coloresFondo.porteria[0], coloresFondo.porteria[1], coloresFondo.porteria[2])

    // Porterías ajustadas para canvas de 800x600
    rect(0, 450, 12, 120)
    rect(0, 450, 60, 12)
    rect(0, 558, 60, 12)

    rect(788, 450, 12, 120)
    rect(740, 450, 60, 12)
    rect(740, 558, 60, 12)

    fill(coloresFondo.area[0], coloresFondo.area[1], coloresFondo.area[2], coloresFondo.area[3])
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
  const tiempoTranscurrido = (millis() - tiempoInicial) / 1000
  const minutos = Math.floor(tiempoTranscurrido / 60)
  const segundos = Math.floor(tiempoTranscurrido % 60)
  fill(255)
  textAlign(CENTER, TOP)
  textSize(24)
  textStyle(BOLD)
  text(`${minutos}:${segundos < 10 ? "0" + segundos : segundos}`, 400, 100)
}

// === SISTEMA DE PARTÍCULAS ===
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

// === LÓGICA DE JUEGO ===
function verificarGol() {
  // Portería izquierda (más centrada verticalmente)
  if (pelota.x < 45 && pelota.y > 350 && pelota.y < 500) {
    goles2++
    efectoGol = { jugador: 2, tiempo: millis() }
    crearParticulas(pelota.x, pelota.y, [30, 144, 255], 30)
    reiniciarPosiciones()
  }

  // Portería derecha (más centrada verticalmente)
  if (pelota.x > 760 && pelota.y > 350 && pelota.y < 500) {
    goles1++
    efectoGol = { jugador: 1, tiempo: millis() }
    crearParticulas(pelota.x, pelota.y, [255, 69, 0], 30)
    reiniciarPosiciones()
  }
}

function verificarFinJuego() {
  const tiempoTranscurrido = (millis() - tiempoInicial) / 1000

  if (tiempoTranscurrido >= duracion || goles1 >= puntajeMaximo || goles2 >= puntajeMaximo) {
    estado = "fin"
  }
}

function mostrarEfectoGol() {
  if (millis() - efectoGol.tiempo < 2000) {
    const alpha = map(millis() - efectoGol.tiempo, 0, 2000, 255, 0)

    fill(255, 255, 0, alpha)
    textAlign(CENTER, CENTER)
    textSize(48)
    textStyle(BOLD)

    const mensaje = efectoGol.jugador === 1 ? "¡GOL ROJO!" : "¡GOL AZUL!"
    text(mensaje, 400, 300)
  } else {
    efectoGol = null
  }
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

// === CONTROLES ===
function keyPressed() {
  key = event.key
  keyCode = event.keyCode

  switch (estado) {
    case "menu":
      if (keyCode === UP_ARROW) {
        menuSeleccion = (menuSeleccion - 1 + 2) % 2
      } else if (keyCode === DOWN_ARROW) {
        menuSeleccion = (menuSeleccion + 1) % 2
      } else if (key === " ") {
        switch (menuSeleccion) {
          case 0:
            estado = "jugando"
            tiempoInicial = millis()
            inicializarJuego()
            break
          case 1:
            estado = "instrucciones"
            break
        }
      }
      break

    case "instrucciones":
      if (keyCode === ESCAPE) {
        estado = "menu"
      }
      break

    case "jugando":
      if (key === "p" || key === "P") {
        pausado = !pausado
        estado = pausado ? "pausa" : "jugando"
      } else if (keyCode === ESCAPE) {
        estado = "confirmacion"
        confirmacionSeleccion = 1 // Empezar en "NO"
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
        confirmacionSeleccion = 1 // Empezar en "NO"
      }
      break

    case "confirmacion":
      if (keyCode === LEFT_ARROW) {
        confirmacionSeleccion = 0 // SÍ
      } else if (keyCode === RIGHT_ARROW) {
        confirmacionSeleccion = 1 // NO
      } else if (key === " ") {
        if (confirmacionSeleccion === 0) {
          // SÍ - volver al menú
          estado = "menu"
          pausado = false
        } else {
          // NO - volver al juego
          estado = "jugando"
        }
      } else if (keyCode === ESCAPE) {
        // ESC también vuelve al juego
        estado = "jugando"
      }
      break

    case "fin":
      if (key === " ") {
        estado = "jugando"
        tiempoInicial = millis()
        inicializarJuego()
      } else if (keyCode === ESCAPE) {
        estado = "menu"
      }
      break
  }
}

function keyReleased() {
  key = event.key
  keyCode = event.keyCode

  if (estado === "jugando" && !pausado) {
    jugador1.tecla(key, keyCode, false)
    jugador2.tecla(key, keyCode, false)
  }
}

function mousePressed() {
  const mouseX = event.clientX - document.getElementById("gameContainer").getBoundingClientRect().left
  const mouseY = event.clientY - document.getElementById("gameContainer").getBoundingClientRect().top

  switch (estado) {
    case "jugando":
      // Botón SALIR (680, 20, 100, 30)
      if (mouseX >= 680 && mouseX <= 780 && mouseY >= 20 && mouseY <= 50) {
        estado = "confirmacion"
        confirmacionSeleccion = 1 // Empezar en "NO"
      }
      break

    case "confirmacion":
      // Botón SÍ (280, 320, 80, 40)
      if (mouseX >= 280 && mouseX <= 360 && mouseY >= 320 && mouseY <= 360) {
        estado = "menu"
        pausado = false
      }
      // Botón NO (440, 320, 80, 40)
      else if (mouseX >= 440 && mouseX <= 520 && mouseY >= 320 && mouseY <= 360) {
        estado = "jugando"
      }
      break
  }
}

function mouseMoved() {
  const mouseX = event.clientX - document.getElementById("gameContainer").getBoundingClientRect().left
  const mouseY = event.clientY - document.getElementById("gameContainer").getBoundingClientRect().top

  let cursor = "default"

  if (estado === "jugando") {
    // Botón SALIR
    if (mouseX >= 680 && mouseX <= 780 && mouseY >= 20 && mouseY <= 50) {
      cursor = "pointer"
    }
  } else if (estado === "confirmacion") {
    // Botones SÍ y NO
    if (
      (mouseX >= 280 && mouseX <= 360 && mouseY >= 320 && mouseY <= 360) ||
      (mouseX >= 440 && mouseX <= 520 && mouseY >= 320 && mouseY <= 360)
    ) {
      cursor = "pointer"
    }
  }

  document.getElementById("gameContainer").style.cursor = cursor
}

// === CLASES ===
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
    this.velocidad = 3.75
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

    fill(0, 0, 0, 50)
    ellipse(0, this.altura + 8, this.radioCabeza * 2, 8)

    fill(this.color[0], this.color[1], this.color[2])
    ellipse(0, 0, this.radioCabeza * 2)

    fill(255)
    ellipse(-6, -4, 5)
    ellipse(6, -4, 5)
    fill(0)
    ellipse(-6, -4, 2)
    ellipse(6, -4, 2)

    fill(this.color[0], this.color[1], this.color[2])
    rect(-12, 20, 24, 32, 6)

    stroke(this.color[0] - 50, this.color[1] - 50, this.color[2] - 50)
    strokeWeight(4)
    const brazoOffset = Math.sin(this.animacion) * 3
    line(-12, 28, -20, 36 + brazoOffset)
    line(12, 28, 20, 36 - brazoOffset)

    strokeWeight(6)
    if (this.pateando) {
      if (this.nombre === "AZUL") {
        line(0, 48, -20, 36)
        line(0, 48, 4, 70)
      } else {
        line(0, 48, 20, 36)
        line(0, 48, -4, 70)
      }
    } else {
      const piernaOffset = this.izquierda || this.derecha ? Math.sin(this.animacion * 2) * 2 : 0
      line(-6, 48, -6, 70 + piernaOffset)
      line(6, 48, 6, 70 - piernaOffset)
    }

    noStroke()
    pop()

    fill(255)
    textAlign(CENTER, BOTTOM)
    textSize(10)
    text(this.nombre, this.x, this.y - 25)
  }

  patear() {
    const pieX = this.pateando ? this.x + 20 : this.x
    const pieY = this.y + 48 // Cambiado de 36 a 48 para que coincida con los pies
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
    if (typeof this.teclas.izq === "string") {
      if (k === this.teclas.izq) this.izquierda = presionada
      if (k === this.teclas.der) this.derecha = presionada
      if (k === this.teclas.salto && !this.saltando && presionada) {
        this.vy = -this.fuerzaSalto
        this.saltando = true
      }
      if (k === this.teclas.patear && presionada) this.patear()
    } else {
      if (kCode === this.teclas.izq) this.izquierda = presionada
      if (kCode === this.teclas.der) this.derecha = presionada
      if (kCode === this.teclas.salto && !this.saltando && presionada) {
        this.vy = -this.fuerzaSalto
        this.saltando = true
      }
      if (kCode === this.teclas.patear && presionada) this.patear()
    }
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
    this.vy += 0.5
    this.rotacion += this.vx * 0.1

    if (this.y > 500 - this.r) {
      this.y = 500 - this.r
      this.vy *= -0.7
      crearParticulas(this.x, this.y + this.r, [139, 69, 19], 4)
    }

    if (this.x < this.r || this.x > 800 - this.r) {
      this.vx *= -0.8
      this.x = constrain(this.x, this.r, 800 - this.r)
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
    const d = dist(this.x, this.y, px, py);

    if (d < this.r + 16) {
        const fuerza = map(d, 0, this.r + 16, 6, 3);
        const angle = Math.atan2(this.y - py, this.x - px);

        if (d < 10) {
            this.vy = -fuerza * 1.5;
            const direccionAleatoria = random(-1, 1);
            this.vx = direccionAleatoria * fuerza;

            // No reposicionamos en rebote aleatorio
        } else {
            this.vx = Math.cos(angle) * fuerza;
            this.vy = Math.sin(angle) * fuerza;

            // Reposicionamiento suave para evitar múltiples colisiones
            const separacion = 2; // solo 2 píxeles
            this.x += Math.cos(angle) * separacion;
            this.y += Math.sin(angle) * separacion;
        }

        // Verificación: evitar que la pelota se salga del canvas
        this.x = constrain(this.x, this.r, width - this.r);
        this.y = constrain(this.y, this.r, height - this.r);
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

// Función para reiniciar posiciones después de gol
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

// Estas funciones serán sobrescritas por p5.js cuando se cargue
function createCanvas(width, height) {
  return window.p5.createCanvas ? window.p5.createCanvas(width, height) : null
}

function push() {
  if (window.p5.push) window.p5.push()
}

function pop() {
  if (window.p5.pop) window.p5.pop()
}

function translate(x, y) {
  if (window.p5.translate) window.p5.translate(x, y)
}

function rotate(angle) {
  if (window.p5.rotate) window.p5.rotate(angle)
}

function sin(value) {
  return Math.sin(value)
}

function fill(...args) {
  if (window.p5.fill) window.p5.fill(...args)
}

function textAlign(horizontal, vertical) {
  if (window.p5.textAlign) window.p5.textAlign(horizontal, vertical)
}

function textSize(size) {
  if (window.p5.textSize) window.p5.textSize(size)
}

function textStyle(style) {
  if (window.p5.textStyle) window.p5.textStyle(style)
}

function text(content, x, y) {
  if (window.p5.text) window.p5.text(content, x, y)
}

function rect(x, y, width, height, radius) {
  if (window.p5.rect) window.p5.rect(x, y, width, height, radius)
}

function stroke(...args) {
  if (window.p5.stroke) window.p5.stroke(...args)
}

function strokeWeight(weight) {
  if (window.p5.strokeWeight) window.p5.strokeWeight(weight)
}

function line(x1, y1, x2, y2) {
  if (window.p5.line) window.p5.line(x1, y1, x2, y2)
}

function noFill() {
  if (window.p5.noFill) window.p5.noFill()
}

function ellipse(x, y, diameter) {
  if (window.p5.ellipse) window.p5.ellipse(x, y, diameter)
}

function noStroke() {
  if (window.p5.noStroke) window.p5.noStroke()
}

function millis() {
  return window.p5.millis ? window.p5.millis() : Date.now()
}

function map(value, start1, stop1, start2, stop2) {
  return window.p5.map
    ? window.p5.map(value, start1, stop1, start2, stop2)
    : start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1))
}

function lerpColor(color1, color2, amount) {
  return window.p5.lerpColor ? window.p5.lerpColor(color1, color2, amount) : color1
}

function color(r, g, b) {
  return window.p5.color ? window.p5.color(r, g, b) : { r, g, b }
}

function constrain(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function dist(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

function loadImage(url) {
  if (window.p5 && window.p5.loadImage) {
    return window.p5.loadImage(url)
  }
  // Fallback para navegadores sin p5.js
  const img = new Image()
  img.src = url
  return img
}

function image(img, x, y, width, height) {
  if (window.p5 && window.p5.image) {
    window.p5.image(img, x, y, width, height)
  }
}

document.addEventListener("keydown", (event) => {
  key = event.key
  keyCode = event.keyCode
  window.p5.keyPressed()
})

document.addEventListener("keyup", (event) => {
  key = event.key
  keyCode = event.keyCode
  window.p5.keyReleased()
})

document.addEventListener("mousedown", (event) => {
  if (window.p5 && window.p5.mousePressed) {
    window.p5.mousePressed()
  }
})

document.addEventListener("mousemove", (event) => {
  if (window.p5 && window.p5.mouseMoved) {
    window.p5.mouseMoved()
  }
  
})
// Registro
document.getElementById("formRegistro").addEventListener("submit", async (e) => {
  e.preventDefault();
  let datos = new FormData();
  datos.append("nombre", document.getElementById("regNombre").value);
  datos.append("email", document.getElementById("regEmail").value);
  datos.append("contrasena", document.getElementById("regPass").value);

  let res = await fetch("registro.php", { method: "POST", body: datos });
  let txt = await res.text();
  alert(txt);
});

// Login
document.getElementById("formLogin").addEventListener("submit", async (e) => {
  e.preventDefault();
  let datos = new FormData();
  datos.append("email", document.getElementById("logEmail").value);
  datos.append("contrasena", document.getElementById("logPass").value);

  let res = await fetch("login.php", { method: "POST", body: datos });
  let txt = await res.text();
  alert(txt);

  // Podrías guardar el usuario logueado en localStorage
  if (txt.includes("Login exitoso")) {
    localStorage.setItem("usuario", txt);
  }
})
