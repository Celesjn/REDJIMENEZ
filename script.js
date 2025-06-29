let scanner;
let controllerUrl = '';
let clientMac = '';
let apMac = '';
let originalUrl = '';

// Crear partículas animadas
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Función centralizada para procesar la autenticación
function processAuthentication(voucherCode) {
    if (!voucherCode) {
        alert("Por favor, ingresa o escanea un código válido.");
        return;
    }

    // Si no se capturó la URL del controlador, la autenticación no puede proceder.
    if (!controllerUrl) {
        alert("Error: No se pudo determinar la dirección del controlador. Asegúrate de estar conectado a la red Wi-Fi designada.");
        return;
    }

    // Construir la URL de redirección final con todos los parámetros requeridos por Omada
    const finalAuthUrl = `${controllerUrl}?voucher=${encodeURIComponent(voucherCode)}&client_mac=${encodeURIComponent(clientMac)}&ap_mac=${encodeURIComponent(apMac)}&original_url=${encodeURIComponent(originalUrl)}`;

    // Redirigir al usuario al portal de Omada para que procese la autenticación
    window.location.href = finalAuthUrl;
}

// Manejo del formulario - Redirige al portal de Omada
document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const codigo = document.getElementById("codigo").value.trim();
    processAuthentication(codigo);
});

// Funciones del modal
function abrirModalCodigo() {
    document.getElementById("modalCodigo").style.display = "block";
}

function cerrarModalCodigo() {
    document.getElementById("modalCodigo").style.display = "none";
}

// Funciones del scanner QR
function iniciarEscaneo() {
    document.getElementById("visorQR").style.display = "block";
    scanner = new Html5Qrcode("reader");
    scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText, decodedResult) => {
            scanner.stop().then(() => {
                document.getElementById("visorQR").style.display = "none";
                // Enviar el código del QR a la función de autenticación
                processAuthentication(decodedText);
            });
        },
        (errorMessage) => {
            // No se muestra error en cada fotograma fallido para una mejor UX
        }
    ).catch(err => {
        console.error("Error al iniciar el escáner QR:", err);
        alert("No se pudo iniciar el escáner. Asegúrate de otorgar permiso para usar la cámara.");
    });
}

function detenerEscaneo() {
    if (scanner && scanner.isScanning) {
        scanner.stop().then(() => {
            document.getElementById("visorQR").style.display = "none";
        }).catch(err => {
            console.error("Error al detener el escáner:", err);
            // Asegurarse de que el visor se oculte incluso si hay un error
            document.getElementById("visorQR").style.display = "none";
        });
    } else {
        document.getElementById("visorQR").style.display = "none";
    }
}

// Al cargar la página, capturar los parámetros enviados por el controlador Omada
window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);

    // Omada envía estos parámetros a la URL del portal externo
    const omadaControllerUrl = urlParams.get('controller_url');
    const omadaClientMac = urlParams.get('client_mac');
    const omadaApMac = urlParams.get('ap_mac');
    const omadaOriginalUrl = urlParams.get('original_url'); // URL a la que el usuario intentaba acceder

    if (omadaControllerUrl && omadaClientMac && omadaApMac) {
        // Si los parámetros existen en la URL, los guardamos en variables globales y en sessionStorage
        controllerUrl = omadaControllerUrl;
        clientMac = omadaClientMac;
        apMac = omadaApMac;
        originalUrl = omadaOriginalUrl;

        sessionStorage.setItem('omadaControllerUrl', controllerUrl);
        sessionStorage.setItem('omadaClientMac', clientMac);
        sessionStorage.setItem('omadaApMac', apMac);
        sessionStorage.setItem('omadaOriginalUrl', originalUrl);
    } else {
        // Si no, intentamos recuperarlos desde sessionStorage (útil si la página se recarga)
        controllerUrl = sessionStorage.getItem('omadaControllerUrl');
        clientMac = sessionStorage.getItem('omadaClientMac');
        apMac = sessionStorage.getItem('omadaApMac');
        originalUrl = sessionStorage.getItem('omadaOriginalUrl');
    }
    
    // Inicializar efectos visuales
    createParticles();
});

// Cerrar modales al hacer clic fuera del contenido
window.onclick = function(event) {
    const modalCodigo = document.getElementById("modalCodigo");
    const modalQR = document.getElementById("visorQR");
    if (event.target == modalCodigo) {
        cerrarModalCodigo();
    }
    if (event.target == modalQR) {
        detenerEscaneo();
    }
}
