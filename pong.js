let paletaIzquierda, paletaDerecha;
let pelota;
let puntajeIzquierda = 1, puntajeDerecha = 0;
let velocidadPelota;
let tiempoTranscurrido = 0;
let colores = ["rojo", "verde", "azul", "blanco"];
let seleccionColorIzquierda, seleccionColorDerecha;
let menuActivo = true; // Variable para controlar si el menú está activo
let powerUpActivo = false; // Variable para controlar si un power-up está activo
let powerUpDuracion = 5000; // Duración en milisegundos de un power-up
let powerUpTiempoInicio; // Tiempo de inicio de un power-up
let juegoTerminado = false; // Variable para controlar si el juego ha terminado
let velocidadAumentada = false; // variable para controlar la velocidad de la pelota despues del minuto

function setup() {
  createCanvas(800, 600);
  seleccionColorIzquierda = createSelect();
  seleccionColorDerecha = createSelect();
  for (let i = 0; i < colores.length; i++) {
    seleccionColorIzquierda.option(colores[i]);
    seleccionColorDerecha.option(colores[i]);
  }
  seleccionColorIzquierda.position(10, height + 10);
  seleccionColorDerecha.position(width - 100, height + 10);

  // Configurar las paletas con colores predeterminados (se cambiarán al iniciar el juego)
  paletaIzquierda = new Paleta(20, height / 2, color(255, 0, 0));
  paletaDerecha = new Paleta(width - 20, height / 2, color(0, 0, 255));

  pelota = new Pelota(width / 2, height / 2, 15);
  velocidadPelota = createVector(5, 5);
}

function draw() {
  if (menuActivo) {
    // Si el menú está activo, mostrar el menú de selección
    mostrarMenu();
  } else {
    // Si el juego está en curso, mostrar el juego
    if (!juegoTerminado) {
      tiempoTranscurrido += deltaTime;
    }

    background(0);

    // Verificar y aplicar power-ups
    verificarPowerUp();

    // Dibujar paletas
    paletaIzquierda.mostrar();
    paletaDerecha.mostrar();

    // Dibujar pelota
    pelota.mostrar();
    pelota.actualizar();
    pelota.verificarColision(paletaIzquierda);
    pelota.verificarColision(paletaDerecha);

    // Mover paletas
    paletaIzquierda.mover();
    paletaDerecha.mover();

    // Dibujar puntajes y tiempo en medio
    fill(255);
    textSize(32);
    text(puntajeIzquierda, width / 4, height / 2);
    text(puntajeDerecha, 3 * width / 4, height / 2);
    text(floor(tiempoTranscurrido / 1000) + "s", width / 2, height / 2);

    // Verificar puntaje
    if (pelota.isFuera()) {
      if (pelota.x < height) {
        puntajeDerecha++; // Incrementar puntaje del lado derecho
      } else if (pelota.x > height) {
        puntajeIzquierda++; // Incrementar puntaje del lado izquierdo
      }
      pelota.resetear();
    }

    // Verificar fin del juego
    if (puntajeIzquierda >= 9 && puntajeIzquierda - puntajeDerecha >= 2) {
      alert("¡El jugador izquierdo gana!");
      detenerTiempo();
      reiniciarJuego();
    } else if (puntajeDerecha >= 9 && puntajeDerecha - puntajeIzquierda >= 2) {
      alert("¡El jugador derecho gana!");
      detenerTiempo();
      reiniciarJuego();
    }

    // Incrementar velocidad de la pelota cada minuto
        if (!velocidadAumentada && tiempoTranscurrido >= 60000) {
      velocidadPelota.add(-8, -8);
      velocidadAumentada = true;
    }
  }
}

// Nueva implementación de controles
function keyPressed() {
  if (key == 'w' || key == 'W') {
    paletaIzquierda.up = true;
  }
  if (key == 's' || key == 'S') {
    paletaIzquierda.down = true;
  }
  if (keyCode == UP_ARROW) {
    paletaDerecha.up = true;
  }
  if (keyCode == DOWN_ARROW) {
    paletaDerecha.down = true;
  }
}

function keyReleased() {
  // Conseguir un movimiento fluido de las teclas w, s, up y down.
  // Estableciendo que si soltamos w, s, up o down, entonces se detenga.
  // Y para evitar que si hay dos jugadores, el programa congele el movimiento de los jugadores por tocar tantas teclas a la vez.

  if (key == 'w' || key == 'W') {
    paletaIzquierda.up = false;
  }
  if (key == 's' || key == 'S') {
    paletaIzquierda.down = false;
  }
  if (keyCode == UP_ARROW) {
    paletaDerecha.up = false;
  }
  if (keyCode == DOWN_ARROW) {
    paletaDerecha.down = false;
  }
}

function verificarPowerUp() {
  if (powerUpActivo) {
    // Verificar si ha pasado el tiempo del power-up
    if (millis() - powerUpTiempoInicio >= powerUpDuracion) {
      powerUpActivo = false; // Desactivar el power-up
      paletaIzquierda.resetearColor(); // Restablecer el color de la paleta izquierda
    }
  } else {
    // Verificar si se activa un nuevo power-up
    if (pelota.x > width / 2 && !powerUpActivo) {
      activarPowerUp();
    }
  }
}

function activarPowerUp() {
  let colorIzquierda = seleccionColorIzquierda.value();
  // Aplicar el power-up a la paleta izquierda
  switch (colorIzquierda) {
    case "rojo":
      paletaIzquierda.color = color(255, 0, 0, 150); // Reducir la opacidad del color rojo
      break;
    case "verde":
      paletaIzquierda.ancho += 20; // Aumentar el ancho de la paleta verde
      break;
    case "azul":
      paletaIzquierda.alto += 20; // Aumentar la altura de la paleta azul
      break;
    case "blanco":
      paletaIzquierda.color = color(255); // Hacer la paleta blanca completamente visible
      break;
  }

  powerUpActivo = true; // Activar el indicador de power-up activo
  powerUpTiempoInicio = millis(); // Guardar el tiempo de inicio del power-up
}

function mostrarMenu() {
  background(50); // Fondo oscuro para el menú

  fill(255);
  textSize(32);
  text("Selecciona el color de la raqueta izquierda:", width / 4, height / 3);
  text("Selecciona el color de la raqueta derecha:", width / 4, 2 * height / 3);

  // Mostrar selección de colores
  seleccionColorIzquierda.show();
  seleccionColorDerecha.show();

  // Botón para iniciar el juego
  fill(0, 255, 0);
  rect(width / 2 - 100, 2 * height / 3 + 50, 200, 50);
  fill(255);
  textSize(24);
  text("Comenzar Juego", width / 2 - 90, 2 * height / 3 + 85);

  // Verificar clic en el botón
  if (
    mouseX > width / 2 - 100 &&
    mouseX < width / 2 + 100 &&
    mouseY > 2 * height / 3 + 50 &&
    mouseY < 2 * height / 3 + 100
  ) {
    menuActivo = false; // Desactivar el menú al hacer clic en el botón
    reiniciarJuego();
  }
}

function detenerTiempo() {
  juegoTerminado = true; // Indicar que el juego ha terminado
  noLoop();  // Detener el bucle de dibujo
}

function reiniciarJuego() {
  juegoTerminado = false; // Indicar que el juego ha comenzado de nuevo
  tiempoTranscurrido = 0;
  puntajeIzquierda = 0;
  puntajeDerecha = 0;
  pelota.resetear();
  velocidadPelota = createVector(5, 5);

  // Configurar las paletas con los colores seleccionados
  let colorIzquierda = seleccionColorIzquierda.value();
  let colorDerecha = seleccionColorDerecha.value();
  paletaIzquierda.color = color(obtenerColorRGB(colorIzquierda));
  paletaDerecha.color = color(obtenerColorRGB(colorDerecha));

  loop(); // Reiniciar el bucle de dibujo
}

function obtenerColorRGB(nombreColor) {
  switch (nombreColor) {
    case "rojo":
      return [255, 0, 0];
    case "verde":
      return [0, 255, 0];
    case "azul":
      return [0, 0, 255];
    case "blanco":
      return [255, 255, 255];
    default:
      return [0, 0, 0]; // Color predeterminado negro en caso de error
  }
}

class Paleta {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.ancho = 10;
    this.alto = 80;
    this.color = color;
    this.colorOriginal = color; // Guardar el color original para restablecerlo después del power-up
    this.up = false;
    this.down = false;
  }

  mostrar() {
    fill(this.color);
    rectMode(CENTER);
    rect(this.x, this.y, this.ancho, this.alto);
  }

  // Controles
  mover() {
    if (this.up && this.y - this.alto / 2 > 0) {
      this.y -= 5;
    }
    if (this.down && this.y + this.alto / 2 < height) {
      this.y += 5;
    }
  }

  resetearColor() {
    this.color = this.colorOriginal; // Restablecer el color original después del power-up
  }
}

class Pelota {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.resetear();
  }

  mostrar() {
    fill(255);
    ellipse(this.x, this.y, this.r * 2);
  }

  actualizar() {
    this.x += velocidadPelota.x;
    this.y += velocidadPelota.y;

    // Verificar límites
    if (this.y - this.r < 0 || this.y + this.r > height) {
      velocidadPelota.y *= -1;
    }
  }

  verificarColision(paleta) {
    if (
      this.x - this.r < paleta.x + paleta.ancho / 2 &&
      this.x + this.r > paleta.x - paleta.ancho / 2 &&
      this.y - this.r < paleta.y + paleta.alto / 2 &&
      this.y + this.r > paleta.y - paleta.alto / 2
    ) {
      velocidadPelota.x *= -1;
    }
  }

  isFuera() {
    return this.x - this.r < 0 || this.x + this.r > width;
  }

  resetear() {
    this.x = width / 2;
    this.y = height / 2;
  }
}
