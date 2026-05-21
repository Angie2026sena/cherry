document.addEventListener("DOMContentLoaded", () => {
    // 1. LÓGICA DEL CONTADOR
    const targetDate = new Date().getTime() + (3 * 24 * 60 * 60 * 1000); // 3 días desde ahora

    function updateTimer() {
        const now = new Date().getTime();
        const diff = targetDate - now;

        if (diff < 0) return;

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = d.toString().padStart(2, '0');
        document.getElementById("hours").innerText = h.toString().padStart(2, '0');
        document.getElementById("minutes").innerText = m.toString().padStart(2, '0');
        document.getElementById("seconds").innerText = s.toString().padStart(2, '0');
    }

    setInterval(updateTimer, 1000);
    updateTimer();

    // 2. FILTRADO DE PRODUCTOS
    window.filterProducts = (category) => {
        const products = document.querySelectorAll('.product-item');
        const buttons = document.querySelectorAll('.btn-filter');

        // Actualizar estado de los botones
        buttons.forEach(btn => {
            btn.classList.remove('active');
            if(btn.innerText.toLowerCase() === category) btn.classList.add('active');
            if(category === 'todos' && btn.innerText === 'Todos') btn.classList.add('active');
        });

        products.forEach(product => {
            product.style.display = 'none';
            if (category === 'todos' || product.getAttribute('data-category') === category) {
                product.style.display = 'block';
                product.classList.add('animate__animated', 'animate__fadeIn');
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    let carrito = [];
    
    // 1. Seleccionar tus botones con la clase exacta
    const botonesAgregar = document.querySelectorAll('.btn-agregar');
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotal = document.getElementById('cart-total');

    // 2. Configurar el evento de clic
    botonesAgregar.forEach((boton) => {
        boton.addEventListener('click', (e) => {
            // Buscamos el contenedor principal de la tarjeta de producto
            const card = e.target.closest('.product-card'); 
            
            // Extraemos los datos basándonos en tu diseño de Cherry
            const producto = {
                nombre: card.querySelector('h6').innerText,
                // Limpiamos el precio para quedarnos solo con el número del precio nuevo
                precio: parseInt(card.querySelector('span.fw-bold').innerText.replace(/[^0-9]/g, '')),
                imagen: card.querySelector('img').src
            };

            agregarAlCarrito(producto);
        });
    });

    function agregarAlCarrito(prod) {
        carrito.push(prod);
        actualizarInterfaz();
        
        // Efecto visual: Abrir el carrito automáticamente
        const offcanvasElement = document.getElementById('offcanvasCart');
        const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasElement);
        offcanvas.show();
    }

    function actualizarInterfaz() {
        // Actualizar el número del icono flotante
        cartCount.innerText = carrito.length;

        if (carrito.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center text-muted mt-5">Tu carrito está vacío.</p>';
            cartTotal.innerText = "$0";
        } else {
            cartItemsContainer.innerHTML = '';
            let total = 0;
            
            carrito.forEach((item, index) => {
                total += item.precio;
                cartItemsContainer.innerHTML += `
                    <div class="cart-item d-flex align-items-center mb-3 pb-3 border-bottom">
                        <img src="${item.imagen}" style="width: 50px; height: 70px; object-fit: cover; border-radius: 8px;">
                        <div class="ms-3 flex-grow-1">
                            <h6 class="mb-0 small fw-bold">${item.nombre}</h6>
                            <small class="text-danger fw-bold">$${item.precio.toLocaleString()}</small>
                        </div>
                        <button class="btn btn-sm text-muted" onclick="eliminarDelCarrito(${index})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                `;
            });
            cartTotal.innerText = `$${total.toLocaleString()}`;
        }
    }

    // Función para eliminar productos
    window.eliminarDelCarrito = (index) => {
        carrito.splice(index, 1);
        actualizarInterfaz();
    };
});

document.addEventListener("DOMContentLoaded", () => {
    // Seleccionamos todos los botones de vista rápida
    const qvButtons = document.querySelectorAll('.overlay-btns button');
    
    qvButtons.forEach(btn => {
        btn.onclick = function() {
            const card = this.closest('.product-card');
            
            // Extraer datos de la card
            const img = card.querySelector('img').src;
            const name = card.querySelector('h6').innerText;
            const cat = card.querySelector('small').innerText;
            const pNew = card.querySelector('span.fw-bold').innerText;
            const pOld = card.querySelector('span.text-muted').innerText;

            // Inyectar datos en el Modal
            document.getElementById('qv-img').src = img;
            document.getElementById('qv-name').innerText = name;
            document.getElementById('qv-cat').innerText = cat;
            document.getElementById('qv-price-new').innerText = pNew;
            document.getElementById('qv-price-old').innerText = pOld;

            // Hacer que el botón del modal también agregue al carrito
            document.getElementById('qv-add-btn').onclick = () => {
                card.querySelector('.btn-agregar').click(); // Simula clic en el botón original
                bootstrap.Modal.getInstance(document.getElementById('quickViewModal')).hide();
            };

            // Mostrar Modal
            const myModal = new bootstrap.Modal(document.getElementById('quickViewModal'));
            myModal.show();
        };
    });

    // Estilo visual para selección de tallas
    const sizeBtns = document.querySelectorAll('.size-btn');
    sizeBtns.forEach(btn => {
        btn.onclick = function() {
            sizeBtns.forEach(b => b.classList.remove('bg-dark', 'text-white'));
            this.classList.add('bg-dark', 'text-white');
        };
    });
});