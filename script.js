const omadaURL = "http://https://celesjn.github.io/REDJIMENEZ/";
let scanner;

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

// Manejo del formulario - Redirige al portal de Omada
document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const codigo = document.getElementById("codigo").value.trim();
    if (codigo) {
        // Redirigir al portal de autenticación de Omada con el código
        window.location.href = `${omadaURL}?voucher=${encodeURIComponent(codigo)}`;
    } else {
        alert("Por favor ingresa un código válido");
    }
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
                // Redirigir al portal de Omada con el código del QR
                window.location.href = `${omadaURL}?voucher=${encodeURIComponent(decodedText)}`;
            });
        },
        (errorMessage) => {
            // Silencio por ahora
        }
    );
}

function detenerEscaneo() {
    if (scanner) {
        scanner.stop().then(() => {
            document.getElementById("visorQR").style.display = "none";
        });
    } else {
        document.getElementById("visorQR").style.display = "none";
    }
}

// Detectar si la página fue cargada desde el portal cautivo
window.addEventListener('load', function() {
    // Obtener parámetros de URL para manejar redirecciones del controlador
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('url') || urlParams.get('redirect');
    
    if (redirectUrl) {
        // Almacenar la URL de destino para después de la autenticación
        sessionStorage.setItem('redirectAfterAuth', redirectUrl);
    }
});

// Cerrar modales al hacer clic fuera
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

// Inicializar partículas
createParticles();
