// ==========================================
// 1. CARGA DE INTERFAZ Y RENDERIZADO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    renderizarResumenPago();
    inicializarValidacionesCheckout();
});

function obtenerCarrito() {
    const claves = ['cherry_cart', 'carrito'];
    for (const clave of claves) {
        const datos = localStorage.getItem(clave);
        if (!datos) continue;
        try {
            const carrito = JSON.parse(datos);
            if (Array.isArray(carrito)) {
                return carrito;
            }
        } catch (error) {
            console.warn(`No se pudo parsear el carrito de localStorage(${clave})`, error);
        }
    }
    return [];
}

function renderizarResumenPago() {
    const listaResumen = document.getElementById('lista-resumen');
    const totalElement = document.getElementById('total-pago');
    const carrito = obtenerCarrito();

    if (!listaResumen || !totalElement) return;

    listaResumen.innerHTML = '';
    let total = 0;

    if (carrito.length === 0) {
        listaResumen.innerHTML = '<li class="list-group-item text-muted text-center py-4">Tu carrito está vacío</li>';
        totalElement.innerText = "$0";
        return;
    }

    const productosAgrupados = carrito.reduce((acumulador, producto) => {
        const clave = `${producto.title}|${producto.price}|${producto.img}`;
        if (!acumulador[clave]) {
            acumulador[clave] = {...producto, quantity: 0};
        }
        acumulador[clave].quantity += 1;
        return acumulador;
    }, {});

    Object.values(productosAgrupados).forEach((producto) => {
        total += producto.price * producto.quantity;
        listaResumen.innerHTML += `
            <li class="list-group-item d-flex justify-content-between lh-sm border-0 px-0 mb-2">
                <div class="d-flex gap-3">
                    <img src="${producto.img}" width="50" height="50" class="rounded-3 shadow-sm" style="object-fit: cover;">
                    <div>
                        <h6 class="my-0 small fw-bold text-uppercase">${producto.title}</h6>
                        <small class="text-muted">Cantidad: ${producto.quantity}</small>
                    </div>
                </div>
                <span class="fw-bold">$${(producto.price * producto.quantity).toLocaleString()}</span>
            </li>
        `;
    });

    totalElement.innerText = `$${total.toLocaleString()}`;
}

function limpiarCarrito() {
    localStorage.removeItem('cherry_cart');
    localStorage.removeItem('carrito');
}

// ==========================================
// 2. CONTROL INTERACTIVO Y VALIDACIONES REALES
// ==========================================
function inicializarValidacionesCheckout() {
    const form = document.querySelector('.needs-validation') || document.getElementById("checkout-form");
    if (!form) return;

    const metodoTarjeta = document.getElementById("pay-card");
    const cardFieldsContainer = document.getElementById("card-fields-container");

    // Inputs específicos para aplicar máscaras y validaciones extra
    const inputTarjeta = document.getElementById("num-tarjeta");
    const inputExpiracion = document.getElementById("expiracion");
    const inputCvv = document.getElementById("cvv");

    // A. Mostrar u ocultar campos de tarjeta dinámicamente
    document.querySelectorAll('input[name="metodoPago"]').forEach(radio => {
        radio.addEventListener("change", function() {
            if (cardFieldsContainer) {
                if (metodoTarjeta && metodoTarjeta.checked) {
                    cardFieldsContainer.style.display = "flex";
                } else {
                    cardFieldsContainer.style.display = "none";
                    // Limpiar estados de error visuales de la tarjeta si se cambia a otro método
                    if(inputTarjeta) inputTarjeta.classList.remove("is-invalid");
                    if(inputExpiracion) inputExpiracion.classList.remove("is-invalid");
                    if(inputCvv) inputCvv.classList.remove("is-invalid");
                }
            }
        });
    });

    // B. Máscaras de escritura automáticas (Mejoran la experiencia visual del usuario)
    if (inputTarjeta) {
        inputTarjeta.addEventListener("input", function (e) {
            let value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
            let matches = value.match(/\d{4,16}/g);
            let match = (matches && matches[0]) || "";
            let parts = [];
            for (let i = 0, len = match.length; i < len; i += 4) {
                parts.push(match.substring(i, i + 4));
            }
            e.target.value = parts.length > 0 ? parts.join(" ") : value;
        });
    }

    if (inputExpiracion) {
        inputExpiracion.addEventListener("input", function (e) {
            let value = e.target.value.replace(/[^0-9]/g, "");
            if (value.length >= 2) {
                e.target.value = value.substring(0, 2) + "/" + value.substring(2, 4);
            } else {
                e.target.value = value;
            }
        });
    }

    if (inputCvv) {
        inputCvv.addEventListener("input", function (e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, "");
        });
    }

    // C. Escuchador del Submit para evaluar la validez real
    form.addEventListener('submit', function (event) {
        let esValido = form.checkValidity();
        
        // Validación personalizada estricta si el usuario prefiere pagar con Tarjeta
        if (metodoTarjeta && metodoTarjeta.checked) {
            if (inputTarjeta) {
                const numeroLimpio = inputTarjeta.value.replace(/\s/g, '');
                if (numeroLimpio.length < 16) {
                    inputTarjeta.setCustomValidity("Invalido");
                    inputTarjeta.classList.add("is-invalid");
                    esValido = false;
                } else {
                    inputTarjeta.setCustomValidity("");
                    inputTarjeta.classList.remove("is-invalid");
                }
            }

            if (inputExpiracion) {
                const expRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
                if (!expRegex.test(inputExpiracion.value)) {
                    inputExpiracion.setCustomValidity("Invalido");
                    inputExpiracion.classList.add("is-invalid");
                    esValido = false;
                } else {
                    inputExpiracion.setCustomValidity("");
                    inputExpiracion.classList.remove("is-invalid");
                }
            }

            if (inputCvv) {
                if (inputCvv.value.length < 3) {
                    inputCvv.setCustomValidity("Invalido");
                    inputCvv.classList.add("is-invalid");
                    esValido = false;
                } else {
                    inputCvv.setCustomValidity("");
                    inputCvv.classList.remove("is-invalid");
                }
            }
        } else {
            // Si eligen WhatsApp u otro método, no requerir campos de tarjeta obligatoriamente
            if(inputTarjeta) inputTarjeta.setCustomValidity("");
            if(inputExpiracion) inputExpiracion.setCustomValidity("");
            if(inputCvv) inputCvv.setCustomValidity("");
        }

        if (!esValido) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            alert("¡Gracias por tu compra en Cherry! Tu pedido ha sido procesado con éxito.");
            limpiarCarrito();
            window.location.href = "index.html";
        }

        form.classList.add('was-validated');
    }, false);
}