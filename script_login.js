function login() {
    const user = document.getElementById("usuario").value;
    const pass = document.getElementById("password").value;
    const mensaje = document.getElementById("mensaje");

    if (user === "cherry" && pass === "1234") {
        mensaje.innerHTML = '<i class="bi bi-check-circle-fill"></i> ¡Acceso concedido!';
        mensaje.className = "mt-3 text-center small fw-bold text-success";
        setTimeout(() => {
            window.location.href = "index.html"; // Redirigir tras éxito
        }, 1500);
    } else {
        mensaje.innerHTML = '<i class="bi bi-exclamation-triangle-fill"></i> Usuario o clave incorrectos';
        mensaje.className = "mt-3 text-center small fw-bold text-danger";
    }
}

function registrar() {
    const nombre = document.getElementById("reg-nombre").value;
    const email = document.getElementById("reg-email").value;
    const pass = document.getElementById("reg-password").value;
    const mensaje = document.getElementById("mensaje-reg");

    if (nombre === "" || email === "" || pass === "") {
        mensaje.innerHTML = '<i class="bi bi-x-circle-fill"></i> Por favor completa todos los campos';
        mensaje.className = "mt-3 text-center small fw-bold text-danger";
    } else {
        mensaje.innerHTML = '<i class="bi bi-check-circle-fill"></i> ¡Cuenta creada con éxito!';
        mensaje.className = "mt-3 text-center small fw-bold text-success";
        
        // Simular guardado y redirigir
        setTimeout(() => {
            window.location.href = "login.html";
        }, 2000);
    }
}