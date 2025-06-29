const omadaURL = "/login"; // Omada modificará esta URL automáticamente

// Modifica las funciones de redirección para incluir parámetros de Omada
function redirectToOmada(code) {
    const urlParams = new URLSearchParams(window.location.search);
    const userurl = urlParams.get('userurl') || urlParams.get('url') || '';
    const mac = urlParams.get('mac') || '';
    const ap = urlParams.get('ap') || '';
    
    let redirectUrl = `${omadaURL}?`;
    if (userurl) redirectUrl += `userurl=${encodeURIComponent(userurl)}&`;
    if (mac) redirectUrl += `mac=${encodeURIComponent(mac)}&`;
    if (ap) redirectUrl += `ap=${encodeURIComponent(ap)}&`;
    redirectUrl += `voucher=${encodeURIComponent(code)}`;
    
    window.location.href = redirectUrl;
}
