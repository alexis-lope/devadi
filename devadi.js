// === VARIABLES GLOBALES ===
let jugador1, jugador2, pelota
let goles1 = 0,
  goles2 = 0
let tiempoInicial
let pausado = false
const duracion = 90
let estado = "menu" // "menu", "instrucciones", "jugando", "pausa", "fin"
let particulas = []
let efectoGol = null
const puntajeMaximo = 5
let animacionTitulo = 0
let menuSeleccion = 0

const coloresFondo = {
  cesped1: [34, 139, 34],
  cesped2: [50, 205, 50],
  lineas: [255, 255, 255],
  porteria: [139, 69, 19],
  area: [255, 255, 255, 30],
}

// === CONFIGURACIÓN INICIAL ===
function setup() {
  createCanvas(windowWidth, windowHeight)
  inicializarJuego()
}

function inicializarJuego() {
  jugador1 = new Jugador(100, [255, 69, 0], "a", "d", "w", "r", "ROJO")
  jugador2 = new Jugador(windowWidth - 100, [30, 144, 255], LEFT_ARROW, RIGHT_ARROW, UP_ARROW, 76, "AZUL")
  pelota = new Pelota()
  particulas = []
  efectoGol = null
  goles1 = goles2 = 0
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
  }

  actualizarParticulas()
  animacionTitulo += 0.05
}

// === FUNCIONES DE PANTALLAS ===
function mostrarMenu() {
  push()
  translate(windowWidth / 2, windowHeight / 3)
  rotate(sin(animacionTitulo) * 0.02)

  fill(0, 0, 0, 100)
  textAlign(CENTER, CENTER)
  textSize(72)
  textStyle(BOLD)
  text("⚽ FÚTBOL 2D ⚽", 3, 3)

  fill(255, 215, 0)
  text("⚽ FÚTBOL 2D ⚽", 0, 0)
  pop()

  const opciones = ["🎮 JUGAR", "📋 INSTRUCCIONES", "⚙️ CONFIGURACIÓN"]

  textAlign(CENTER, CENTER)
  textSize(32)

  for (let i = 0; i < opciones.length; i++) {
    if (i === menuSeleccion) {
      fill(255, 255, 0)
      rect(windowWidth / 2 - 150, windowHeight / 2 + i * 60 - 20, 300, 50, 10)
      fill(0)
    } else {
      fill(255)
    }
    text(opciones[i], windowWidth / 2, windowHeight / 2 + i * 60)
  }

  fill(200)
  textSize(18)
  text("Usa ↑↓ para navegar, ESPACIO para seleccionar", windowWidth / 2, windowHeight - 50)
}

function mostrarInstrucciones() {
  fill(0, 0, 0, 150)
  rect(0, 0, windowWidth, windowHeight)

  fill(255)
  textAlign(CENTER, CENTER)
  textSize(48)
  textStyle(BOLD)
  text("📋 INSTRUCCIONES", windowWidth / 2, 80)

  textSize(24)
  textStyle(NORMAL)
  textAlign(LEFT, TOP)

  const instrucciones = [
    "🎯 OBJETIVO:",
    "   • Marca más goles que tu oponente",
    "   • Primer jugador en llegar a " + puntajeMaximo + " goles gana",
    "",
    "🔴 JUGADOR ROJO (Izquierda):",
    "   • A/D: Mover izquierda/derecha",
    "   • W: Saltar",
    "   • R: Patear pelota",
    "",
    "🔵 JUGADOR AZUL (Derecha):",
    "   • ←/→: Mover izquierda/derecha",
    "   • ↑: Saltar",
    "   • L: Patear pelota",
    "",
    "⚽ CONTROLES GENERALES:",
    "   • P: Pausar/Reanudar juego",
    "   • ESPACIO: Confirmar/Reiniciar",
    "",
    "🏆 CONSEJOS:",
    "   • Salta para alcanzar pelotas altas",
    "   • Patea en el momento justo para más potencia",
    "   • Usa las paredes para rebotes estratégicos",
  ]

  let y = 140
  for (const linea of instrucciones) {
    if (
      linea.startsWith("🎯") ||
      linea.startsWith("🔴") ||
      linea.startsWith("🔵") ||
      linea.startsWith("⚽") ||
      linea.startsWith("🏆")
    ) {
      fill(255, 215, 0)
      textStyle(BOLD)
    } else {
      fill(255)
      textStyle(NORMAL)
    }
    text(linea, 50, y)
    y += 30
  }

  fill(255, 69, 0)
  rect(windowWidth / 2 - 100, windowHeight - 80, 200, 50, 10)
  fill(255)
  textAlign(CENTER, CENTER)
  textSize(24)
  textStyle(BOLD)
  text("VOLVER (ESC)", windowWidth / 2, windowHeight - 55)
}

function modoJuego() {
  mostrarCancha()

  if (!pausado) {
    jugador1.actualizar()
    jugador2.actualizar()
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
  mostrarBarraProgreso()

  if (efectoGol) {
    mostrarEfectoGol()
  }
}

function modoPausa() {
  fill(0, 0, 0, 150)
  rect(0, 0, windowWidth, windowHeight)

  mostrarCancha()
  jugador1.mostrar()
  jugador2.mostrar()
  pelota.mostrar()

  fill(255, 255, 0)
  rect(windowWidth / 2 - 150, windowHeight / 2 - 100, 300, 200, 20)

  fill(0)
  textAlign(CENTER, CENTER)
  textSize(48)
  textStyle(BOLD)
  text("⏸️ PAUSA", windowWidth / 2, windowHeight / 2 - 40)

  textSize(24)
  textStyle(NORMAL)
  text("Presiona P para continuar", windowWidth / 2, windowHeight / 2 + 20)
  text("ESC para volver al menú", windowWidth / 2, windowHeight / 2 + 50)
}

function mostrarPantallaFinal() {
  dibujarFondoDegradado()

  let ganador = ""
  let colorGanador = [255, 255, 255]

  if (goles1 > goles2) {
    ganador = "🔴 JUGADOR ROJO"
    colorGanador = [255, 69, 0]
  } else if (goles2 > goles1) {
    ganador = "🔵 JUGADOR AZUL"
    colorGanador = [30, 144, 255]
  } else {
    ganador = "🤝 EMPATE"
    colorGanador = [255, 215, 0]
  }

  fill(255)
  textAlign(CENTER, CENTER)
  textSize(48)
  textStyle(BOLD)
  text("🏆 ¡FIN DEL PARTIDO! 🏆", windowWidth / 2, windowHeight / 3)

  fill(colorGanador[0], colorGanador[1], colorGanador[2])
  textSize(56)
  text(ganador, windowWidth / 2, windowHeight / 2 - 40)

  fill(255)
  textSize(36)
  text("Marcador Final: " + goles1 + " - " + goles2, windowWidth / 2, windowHeight / 2 + 20)

  textSize(24)
  const tiempoTotal = floor((millis() - tiempoInicial) / 1000)
  text("Tiempo jugado: " + tiempoTotal + " segundos", windowWidth / 2, windowHeight / 2 + 60)

  fill(34, 139, 34)
  rect(windowWidth / 2 - 200, windowHeight - 120, 180, 50, 10)
  fill(255, 69, 0)
  rect(windowWidth / 2 + 20, windowHeight - 120, 180, 50, 10)

  fill(255)
  textSize(20)
  textStyle(BOLD)
  text("JUGAR DE NUEVO", windowWidth / 2 - 110, windowHeight - 95)
  text("MENÚ PRINCIPAL", windowWidth / 2 + 110, windowHeight - 95)

  textSize(16)
  textStyle(NORMAL)
  fill(200)
  text("ESPACIO: Jugar de nuevo | ESC: Menú principal", windowWidth / 2, windowHeight - 30)
}

// === FUNCIONES DE INTERFAZ ===
function mostrarCancha() {
  for (let i = 0; i < windowWidth; i += 40) {
    fill(coloresFondo.cesped1[0], coloresFondo.cesped1[1], coloresFondo.cesped1[2])
    if (floor(i / 40) % 2 === 0) {
      fill(coloresFondo.cesped2[0], coloresFondo.cesped2[1], coloresFondo.cesped2[2])
    }
    rect(i, 0, 40, windowHeight)
  }

  stroke(coloresFondo.lineas[0], coloresFondo.lineas[1], coloresFondo.lineas[2])
  strokeWeight(4)
  line(windowWidth / 2, 0, windowWidth / 2, windowHeight)

  noFill()
  ellipse(windowWidth / 2, windowHeight / 2, 150)

  fill(255)
  ellipse(windowWidth / 2, windowHeight / 2, 8)

  noStroke()
  fill(coloresFondo.porteria[0], coloresFondo.porteria[1], coloresFondo.porteria[2])

  rect(0, windowHeight - 200, 15, 180)
  rect(0, windowHeight - 200, 80, 15)
  rect(0, windowHeight - 35, 80, 15)

  rect(windowWidth - 15, windowHeight - 200, 15, 180)
  rect(windowWidth - 80, windowHeight - 200, 80, 15)
  rect(windowWidth - 80, windowHeight - 35, 80, 15)

  fill(coloresFondo.area[0], coloresFondo.area[1], coloresFondo.area[2], coloresFondo.area[3])
  rect(5, windowHeight - 180, 70, 140)
  rect(windowWidth - 75, windowHeight - 180, 70, 140)

  fill(coloresFondo.cesped1[0] - 20, coloresFondo.cesped1[1] - 20, coloresFondo.cesped1[2] - 20)
  rect(0, windowHeight - 30, windowWidth, 30)

  noStroke()
}

function mostrarMarcadorMejorado() {
  fill(0, 0, 0, 150)
  rect(windowWidth / 2 - 120, 10, 240, 80, 15)

  fill(255)
  textAlign(CENTER, CENTER)
  textSize(48)
  textStyle(BOLD)
  text(goles1 + " - " + goles2, windowWidth / 2, 35)

  textSize(16)
  fill(255, 69, 0)
  text("ROJO", windowWidth / 2 - 60, 65)
  fill(30, 144, 255)
  text("AZUL", windowWidth / 2 + 60, 65)
}

function mostrarTiempoMejorado() {
  const tiempoTranscurrido = floor((millis() - tiempoInicial) / 1000)
  const tiempoRestante = max(0, duracion - tiempoTranscurrido)

  fill(0, 0, 0, 150)
  rect(20, 20, 150, 50, 10)

  if (tiempoRestante <= 10) {
    fill(255, 0, 0)
  } else if (tiempoRestante <= 30) {
    fill(255, 165, 0)
  } else {
    fill(255)
  }

  textAlign(LEFT, CENTER)
  textSize(24)
  textStyle(BOLD)
  text("⏱️ " + tiempoRestante + "s", 30, 45)
}

function mostrarBarraProgreso() {
  let progreso = (millis() - tiempoInicial) / (duracion * 1000)
  progreso = constrain(progreso, 0, 1)

  fill(0, 0, 0, 100)
  rect(windowWidth - 220, 20, 200, 20, 10)

  fill(255, 215, 0)
  rect(windowWidth - 220, 20, 200 * progreso, 20, 10)

  fill(255)
  textAlign(RIGHT, TOP)
  textSize(14)
  text("Progreso del partido", windowWidth - 30, 45)
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
  if (pelota.x < 75 && pelota.y > windowHeight - 180 && pelota.y < windowHeight - 40) {
    goles2++
    efectoGol = { jugador: 2, tiempo: millis() }
    crearParticulas(pelota.x, pelota.y, [30, 144, 255], 30)
    pelota.reset()
  }

  if (pelota.x > windowWidth - 75 && pelota.y > windowHeight - 180 && pelota.y < windowHeight - 40) {
    goles1++
    efectoGol = { jugador: 1, tiempo: millis() }
    crearParticulas(pelota.x, pelota.y, [255, 69, 0], 30)
    pelota.reset()
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
    textSize(64)
    textStyle(BOLD)

    const mensaje = efectoGol.jugador === 1 ? "¡GOL ROJO!" : "¡GOL AZUL!"
    text(mensaje, windowWidth / 2, windowHeight / 2)
  } else {
    efectoGol = null
  }
}

function dibujarFondoDegradado() {
  for (let i = 0; i <= windowHeight; i++) {
    const inter = map(i, 0, windowHeight, 0, 1)
    const c = lerpColor(color(30, 60, 120), color(50, 100, 150), inter)
    stroke(c)
    line(0, i, windowWidth, i)
  }
  noStroke()
}

// === CONTROLES ===
function keyPressed() {
  switch (estado) {
    case "menu":
      if (keyCode === UP_ARROW) {
        menuSeleccion = (menuSeleccion - 1 + 3) % 3
      } else if (keyCode === DOWN_ARROW) {
        menuSeleccion = (menuSeleccion + 1) % 3
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
          case 2:
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
        estado = "menu"
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
        estado = "menu"
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
  if (estado === "jugando" && !pausado) {
    jugador1.tecla(key, keyCode, false)
    jugador2.tecla(key, keyCode, false)
  }
}

// === CLASES ===
class Jugador {
  constructor(x, col, izq, der, salto, patear, nombre) {
    this.x = x
    this.y = windowHeight - 120
    this.vy = 0
    this.color = col
    this.nombre = nombre
    this.radioCabeza = 25
    this.altura = 90
    this.izquierda = false
    this.derecha = false
    this.saltando = false
    this.teclas = { izq, der, salto, patear }
    this.pateando = false
    this.tiempoPateo = 0
    this.velocidad = 6
    this.fuerzaSalto = 14
    this.animacion = 0
  }

  actualizar() {
    if (this.izquierda) this.x -= this.velocidad
    if (this.derecha) this.x += this.velocidad

    this.x = constrain(this.x, 30, windowWidth - 30)

    this.vy += 0.7
    this.y += this.vy

    if (this.y > windowHeight - this.altura) {
      this.y = windowHeight - this.altura
      this.vy = 0
      this.saltando = false
    }

    if (this.pateando && millis() - this.tiempoPateo > 200) {
      this.pateando = false
    }

    this.animacion += 0.1
  }

  mostrar() {
    push()
    translate(this.x, this.y)

    fill(0, 0, 0, 50)
    ellipse(0, this.altura + 10, this.radioCabeza * 2, 10)

    fill(this.color[0], this.color[1], this.color[2])
    ellipse(0, 0, this.radioCabeza * 2)

    fill(255)
    ellipse(-8, -5, 6)
    ellipse(8, -5, 6)
    fill(0)
    ellipse(-8, -5, 3)
    ellipse(8, -5, 3)

    fill(this.color[0], this.color[1], this.color[2])
    rect(-15, 25, 30, 40, 8)

    stroke(this.color[0] - 50, this.color[1] - 50, this.color[2] - 50)
    strokeWeight(6)
    const brazoOffset = sin(this.animacion) * 5
    line(-15, 35, -25, 45 + brazoOffset)
    line(15, 35, 25, 45 - brazoOffset)

    strokeWeight(8)
    if (this.pateando) {
      line(0, 60, 25, 45)
      line(0, 60, -5, 90)
    } else {
      const piernaOffset = this.izquierda || this.derecha ? sin(this.animacion * 2) * 3 : 0
      line(-8, 60, -8, 90 + piernaOffset)
      line(8, 60, 8, 90 - piernaOffset)
    }

    noStroke()
    pop()

    fill(255)
    textAlign(CENTER, BOTTOM)
    textSize(12)
    text(this.nombre, this.x, this.y - 35)
  }

  patear() {
    const pieX = this.pateando ? this.x + 25 : this.x
    const pieY = this.y + 45
    const d = dist(pieX, pieY, pelota.x, pelota.y)

    if (d < 50) {
      const fuerzaX = (pelota.x - this.x) * 0.5
      const fuerzaY = -12

      pelota.vx += fuerzaX
      pelota.vy = fuerzaY

      crearParticulas(pieX, pieY, this.color, 10)
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
    this.r = 20
    this.trail = []
    this.reset()
  }

  reset() {
    this.x = windowWidth / 2
    this.y = windowHeight - 150
    this.vx = random(-4, 4)
    this.vy = 0
    this.trail = []
    this.rotacion = 0
  }

  actualizar() {
    this.trail.push({ x: this.x, y: this.y })
    if (this.trail.length > 8) {
      this.trail.shift()
    }

    this.x += this.vx
    this.y += this.vy
    this.vy += 0.6
    this.rotacion += this.vx * 0.1

    if (this.y > windowHeight - this.r - 30) {
      this.y = windowHeight - this.r - 30
      this.vy *= -0.75
      crearParticulas(this.x, this.y + this.r, [139, 69, 19], 5)
    }

    if (this.x < this.r || this.x > windowWidth - this.r) {
      this.vx *= -0.85
      this.x = constrain(this.x, this.r, windowWidth - this.r)
    }

    this.vx *= 0.995
  }

  mostrar() {
    for (let i = 0; i < this.trail.length; i++) {
      const alpha = map(i, 0, this.trail.length - 1, 0, 100)
      fill(255, 255, 0, alpha)
      const size = map(i, 0, this.trail.length - 1, this.r * 0.5, this.r * 2)
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
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3
      const x = Math.cos(angle) * 8
      const y = Math.sin(angle) * 8
      ellipse(x, y, 4)
    }

    pop()
  }

  rebotarConJugador(jugador) {
    const puntos = [
      { x: jugador.x, y: jugador.y },
      { x: jugador.x, y: jugador.y + 30 },
      { x: jugador.x, y: jugador.y + 60 },
    ]

    for (const punto of puntos) {
      this.rebotePunto(punto.x, punto.y)
    }
  }

  rebotePunto(px, py) {
    const d = dist(this.x, this.y, px, py)
    if (d < this.r + 20) {
      const angle = Math.atan2(this.y - py, this.x - px)
      const fuerza = map(d, 0, this.r + 20, 8, 4)
      this.vx = Math.cos(angle) * fuerza
      this.vy = Math.sin(angle) * fuerza

      this.x = px + Math.cos(angle) * (this.r + 21)
      this.y = py + Math.sin(angle) * (this.r + 21)
    }
  }
}

class Particula {
  constructor(x, y, color) {
    this.x = x
    this.y = y
    this.vx = random(-5, 5)
    this.vy = random(-8, -2)
    this.color = color
    this.vida = 60
    this.vidaMaxima = 60
    this.tamaño = random(3, 8)
  }

  actualizar() {
    this.x += this.vx
    this.y += this.vy
    this.vy += 0.2
    this.vida--
    this.vx *= 0.98
  }

  mostrar() {
    const alpha = map(this.vida, 0, this.vidaMaxima, 0, 255)
    fill(this.color[0], this.color[1], this.color[2], alpha)
    ellipse(this.x, this.y, this.tamaño)
  }
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight)
  if (jugador1) jugador1.x = constrain(jugador1.x, 30, window.innerWidth - 30)
  if (jugador2) jugador2.x = constrain(jugador2.x, 30, window.innerWidth - 30)
}

