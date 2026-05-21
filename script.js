// 1. VARIABLES GLOBALES (Usamos nombres claros y únicos)
let carrito = JSON.parse(localStorage.getItem("cherry_cart")) || [];

// 2. ACTUALIZAR CONTADOR Y LOCALSTORAGE
function actualizarInterfaz() {
    // Guardar datos
    localStorage.setItem("cherry_cart", JSON.stringify(carrito));
    
    // Actualizar número en el icono
    const badge = document.getElementById('cart-count');
    if (badge) {
        badge.innerText = carrito.length;
    }
    
    // Dibujar productos en el panel lateral
    renderizarCarrito();
}

// 3. FUNCIÓN ÚNICA PARA AGREGAR
function addToCart(producto) {
    // Validar que el precio sea un número (eliminar puntos si vienen como string)
    if (typeof producto.price === 'string') {
        producto.price = parseInt(producto.price.replace(/\./g, ''));
    }

    // Agregar al arreglo
    carrito.push(producto);
    
    // Efecto visual en el badge
    const badge = document.getElementById('cart-count');
    if (badge) {
        badge.classList.add('bounce-effect');
        setTimeout(() => badge.classList.remove('bounce-effect'), 300);
    }

    actualizarInterfaz();

    // Abrir el panel lateral (Offcanvas)
    const cartElement = document.getElementById('offcanvasCart');
    if (cartElement) {
        const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(cartElement);
        bsOffcanvas.show();
    }
}

// 4. MOSTRAR PRODUCTOS EN EL CARRITO LATERAL
function renderizarCarrito() {
    const container = document.getElementById('cart-items-container');
    const totalElement = document.getElementById('cart-total');
    let totalAcumulado = 0;

    if (!container) return;

    if (carrito.length === 0) {
        container.innerHTML = '<p class="text-muted text-center mt-5">Tu carrito está vacío.</p>';
        if (totalElement) totalElement.innerText = '$0';
        return;
    }

    container.innerHTML = '';
    carrito.forEach((item, index) => {
        totalAcumulado += item.price;
        container.innerHTML += `
            <div class="cart-item d-flex align-items-center mb-3 p-2 border-bottom">
                <img src="${item.img}" style="width: 50px; height: 60px; object-fit: cover;" class="rounded me-3">
                <div class="flex-grow-1">
                    <h6 class="mb-0 small fw-bold text-uppercase">${item.title}</h6>
                    <small class="text-danger fw-bold">$${item.price.toLocaleString()}</small>
                </div>
                <button class="btn btn-sm text-muted" onclick="removeItem(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
    });

    if (totalElement) {
        totalElement.innerText = `$${totalAcumulado.toLocaleString()}`;
    }
}

// 5. ELIMINAR PRODUCTOS
function removeItem(index) {
    carrito.splice(index, 1);
    actualizarInterfaz();
}

// 6. FUNCIONES DE INTERFAZ (Filtros, Scroll, Modal)
function openModal(title, price, img) {
    // Guardar producto seleccionado temporalmente para el modal
    window.selectedProduct = { title, price, img };
    document.getElementById("modal-title").innerText = title;
    document.getElementById("modal-price").innerText = "$" + price;
    document.getElementById("modal-img").src = img;
    let modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
}

function addToCartFromModal() {
    if (window.selectedProduct) {
        addToCart(window.selectedProduct);
    }
}

// Filtros de categorías con transiciones Cherry
document.querySelectorAll(".filtros button, .btn-categoria").forEach(btn => {
    btn.addEventListener("click", function() {
        // 1. Alternar la clase activa en los botones
        const activeBtn = document.querySelector(".filtros .active, .btn-categoria.active");
        if (activeBtn) {
            activeBtn.classList.remove("active", "bg-dark", "text-white");
            activeBtn.classList.add("text-dark", "bg-transparent");
        }
        
        this.classList.add("active");
        if (this.classList.contains("btn-categoria")) {
            this.classList.remove("text-dark", "bg-transparent");
            this.classList.add("bg-dark", "text-white");
        }

        // 2. Obtener la categoría (ya sea por texto o por el atributo data-filter)
        let category = this.getAttribute("data-filter") || this.innerText.toLowerCase().trim();
        if (category === "todo") category = "todos"; // Sincroniza variaciones de texto

        // 3. Filtrar los contenedores de los productos
        document.querySelectorAll(".producto-item, .product-card-v2").forEach(card => {
            // Buscamos el contenedor padre real de la columna (sirve para cualquier grid de Bootstrap)
            const itemCol = card.closest('[class*="col-"]');
            if (!itemCol) return;

            // Comprobar si coincide con la clase o el texto interno
            let cardCategory = card.querySelector(".category-text")?.innerText.toLowerCase().trim() || "";
            const matchesCategory = itemCol.classList.contains(category) || cardCategory === category || category === "todos";

            if (matchesCategory) {
                itemCol.style.display = "block";
                setTimeout(() => {
                    itemCol.style.opacity = "1";
                    itemCol.style.transform = "scale(1)";
                }, 10);
            } else {
                itemCol.style.opacity = "0";
                itemCol.style.transform = "scale(0.95)";
                setTimeout(() => {
                    itemCol.style.display = "none";
                }, 300); // Espera que termine la animación CSS
            }
        });
    });
});

// Botón subir al inicio
const btnScroll = document.getElementById("scrollTop");
if (btnScroll) {
    btnScroll.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
}

function scrollTestimonios(val) {
    const container = document.getElementById('testimonios-container');
    container.scrollLeft += val;
}


// Configurar el final del día de hoy para la oferta flash
const finOfertaFlash = new Date();
finOfertaFlash.setHours(23, 59, 59, 999);

function actualizarOfertaFlash() {
    const ahora = new Date().getTime();
    const distancia = finOfertaFlash - ahora;

    if (distancia < 0) {
        // Si la oferta termina, ocultamos la sección completa
        const seccionOferta = document.querySelector(".oferta-banner");
        if (seccionOferta) seccionOferta.style.display = "none";
        return;
    }

    // Cálculos de tiempo
    const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

    // Actualizar los elementos con IDs específicos
    const hElement = document.getElementById("promo-hours");
    const mElement = document.getElementById("promo-minutes");
    const sElement = document.getElementById("promo-seconds");

    if (hElement) hElement.innerText = horas.toString().padStart(2, '0');
    if (mElement) mElement.innerText = minutos.toString().padStart(2, '0');
    if (sElement) sElement.innerText = segundos.toString().padStart(2, '0');
}

// Ejecutar cada segundo
setInterval(actualizarOfertaFlash, 1000);
actualizarOfertaFlash();

function llenarModal(boton) {
    const card = boton.closest('.product-card-v2, .product-card');
    const modal = document.getElementById('quickViewModal');

    if (card && modal) {
        const imagenSrc = card.querySelector('.img-container img')?.getAttribute('src') || '';
        const titulo = card.querySelector('.product-title')?.innerText
            || card.querySelector('h5')?.innerText
            || card.querySelector('h6')?.innerText
            || card.querySelector('.product-info h6')?.innerText
            || 'Producto Cherry';

        const precio = card.querySelector('.current-price')?.innerText
            || card.querySelector('.price-container .fw-bold')?.innerText
            || card.querySelector('p.text-danger')?.innerText
            || card.querySelector('.price')?.innerText
            || '$0';
        const categoria = card.querySelector('.category-text')?.innerText || '';
        const precioAntiguo = card.querySelector('.old-price')?.innerText || '';

        const modalImg = modal.querySelector('#qv-img');
        const modalName = modal.querySelector('#qv-name');
        const modalPriceNew = modal.querySelector('#qv-price-new');
        const modalPriceOld = modal.querySelector('#qv-price-old');
        const modalCat = modal.querySelector('#qv-cat');

        if (modalImg) {
            modalImg.src = imagenSrc;
            modalImg.alt = titulo;
        }
        if (modalName) modalName.innerText = titulo;
        if (modalPriceNew) modalPriceNew.innerText = precio;
        if (modalPriceOld) modalPriceOld.innerText = precioAntiguo;
        if (modalCat) modalCat.innerText = categoria;

        window.selectedQuickProduct = {
            title: titulo,
            price: parseInt(precio.replace(/[^0-9]/g, '')) || 0,
            img: imagenSrc
        };
    }

    const sizeButtons = document.querySelectorAll('.size-btn-modal');
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            sizeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Asegurarse de que todos los botones de vista rápida llenen el modal antes de abrirlo
document.querySelectorAll('.btn-quick-view').forEach(button => {
    button.addEventListener('click', function () {
        llenarModal(this);
    });
});

// Conectar el botón del modal al carrito para todos los IDs usados en las páginas
const modalAddButtons = document.querySelectorAll('#btnModalAgregar, #qv-add-to-cart, #qv-add-btn');
modalAddButtons.forEach((button) => {
    button.addEventListener('click', () => {
        if (window.selectedQuickProduct) {
            addToCart(window.selectedQuickProduct);
            const modalElement = document.getElementById('quickViewModal');
            const bsModal = bootstrap.Modal.getInstance(modalElement);
            if (bsModal) {
                bsModal.hide();
            }
        }
    });
});
