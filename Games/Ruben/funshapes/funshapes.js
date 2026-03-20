// Formas y colores del juego
const formas = ['circulo', 'cuadrado', 'triangulo'];
const colores = [
    { nombre: 'rojo', hex: '#ff6b6b' },
    { nombre: 'azul', hex: '#4ecdc4' },
    { nombre: 'verde', hex: '#26de81' },
    { nombre: 'amarillo', hex: '#feca57' },
    { nombre: 'naranja', hex: '#ff9f43' },
    { nombre: 'rosa', hex: '#fd79a8' }
];

// Variables del juego
let formaObjetivo = null;
let colorObjetivo = null;
let opcionesFormas = [];
let juegoGanado = false;
let clicsHabilitados = true;

// Elementos canvas
const canvasObjetivo = document.getElementById('canvasObjetivo');
const canvasOpciones = [
    document.getElementById('canvasOpcion1'),
    document.getElementById('canvasOpcion2'),
    document.getElementById('canvasOpcion3'),
    document.getElementById('canvasOpcion4')
];
const elementoMensaje = document.getElementById('mensaje');

// Función para obtener contexto de canvas
function obtenerContextoCanvas(canvas) {
    return canvas.getContext('2d');
}

// Función para dibujar formas
function dibujarForma(ctx, forma, color, x, y, size) {
    ctx.fillStyle = color;
    ctx.beginPath();
    
    switch(forma) {
        case 'circulo':
            ctx.arc(x, y, size, 0, Math.PI * 2);
            break;
        case 'cuadrado':
            ctx.rect(x - size, y - size, size * 2, size * 2);
            break;
        case 'triangulo':
            ctx.moveTo(x, y - size);
            ctx.lineTo(x + size, y + size);
            ctx.lineTo(x - size, y + size);
            ctx.closePath();
            break;
    }
    
    ctx.fill();
    
    // Añadir borde para mejor visibilidad
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 3;
    ctx.stroke();
}

function generarNuevaRonda() {
    juegoGanado = false;
    clicsHabilitados = true;
    
    // Seleccionar figura objetivo aleatoria
    formaObjetivo = formas[Math.floor(Math.random() * formas.length)];
    colorObjetivo = colores[Math.floor(Math.random() * colores.length)];
    
    // Dibujar figura objetivo en canvas grande
    const ctxObjetivo = obtenerContextoCanvas(canvasObjetivo);
    ctxObjetivo.clearRect(0, 0, canvasObjetivo.width, canvasObjetivo.height);
    dibujarForma(ctxObjetivo, formaObjetivo, colorObjetivo.hex, canvasObjetivo.width / 2, canvasObjetivo.height / 2, 60);
    
    // Generar opciones para abajo
    opcionesFormas = [];
    const indiceCorrecto = Math.floor(Math.random() * 4);
    
    for (let i = 0; i < 4; i++) {
        let opcionForma, opcionColor;
        
        if (i === indiceCorrecto) {
            // Esta opción es la correcta
            opcionForma = formaObjetivo;
            opcionColor = colorObjetivo;
        } else {
            // Generar opción aleatoria diferente
            do {
                opcionForma = formas[Math.floor(Math.random() * formas.length)];
            } while (opcionForma === formaObjetivo);
            
            do {
                opcionColor = colores[Math.floor(Math.random() * colores.length)];
            } while (opcionColor.nombre === colorObjetivo.nombre);
        }
        
        opcionesFormas.push({ forma: opcionForma, color: opcionColor });
        
        // Dibujar en canvas
        const canvas = canvasOpciones[i];
        const ctx = obtenerContextoCanvas(canvas);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        dibujarForma(ctx, opcionForma, opcionColor.hex, canvas.width / 2, canvas.height / 2, 60);
        
        canvas.onclick = () => manejarClickOpcion(i);
    }
    
    elementoMensaje.textContent = 'Toca la forma igual!';
    elementoMensaje.style.color = '#4ecdc4';
    elementoMensaje.className = 'mensaje';
}

function manejarClickOpcion(indice) {
    const opcionSeleccionada = opcionesFormas[indice];
    const esCorrecto = opcionSeleccionada.forma === formaObjetivo && opcionSeleccionada.color.nombre === colorObjetivo.nombre;
    
    if (esCorrecto) {
        juegoGanado = true;
        clicsHabilitados = false;
        
        // Deshabilitar clics quitando los event listeners
        canvasOpciones.forEach(canvas => {
            canvas.onclick = null;
        });
        elementoMensaje.textContent = '🎉 ENHORABONA! 🎉';
        elementoMensaje.style.color = '#26de81';
        elementoMensaje.className = 'mensaje celebrar-loop';
        
        // Reiniciar automáticamente después de 5 segundos
        setTimeout(generarNuevaRonda, 5000);
    } else {
        elementoMensaje.textContent = 'Ànim, tu pots! 💪';
        elementoMensaje.style.color = '#ff6b6b';
        elementoMensaje.className = 'mensaje temblar';
        
        // Restaurar mensaje después de un momento
        setTimeout(() => {
            if (!juegoGanado) {
                elementoMensaje.textContent = 'Toca la forma igual!';
                elementoMensaje.style.color = '#4ecdc4';
                elementoMensaje.className = 'mensaje';
            }
        }, 1500);
    }
}

// Iniciar juego
generarNuevaRonda();
