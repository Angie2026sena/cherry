
// ============================================================
// CART-PAGES.JS  –  Se carga DESPUÉS de tu script principal
// Solo activo en páginas distintas al index
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

    // ── 1. LEER el carrito que ya guardó el index en localStorage ──
    // No redeclaramos "carrito", usamos la que ya existe en el scope global
    // Si por alguna razón no existe, la inicializamos sin pisar la principal
    if (typeof carrito === 'undefined') {
        window.carrito = JSON.parse(localStorage.getItem("cherry_cart")) || [];
    }

    // ── 2. SINCRONIZAR badge al cargar la página ──────────────────
    const badge = document.getElementById('cart-count');
    if (badge) {
        badge.innerText = carrito.length;
    }

    // ── 3. RENDERIZAR el carrito lateral al abrir el offcanvas ────
    const cartElement = document.getElementById('offcanvasCart');
    if (cartElement) {
        cartElement.addEventListener('show.bs.offcanvas', function () {
            renderizarCarrito(); // Reutiliza la función del script principal
        });
    }

    // ── 4. CONECTAR botones "Añadir al carrito" de esta página ────
    //    Detecta la imagen desde la tarjeta igual que tu agregarCarrito()
    document.querySelectorAll('[onclick^="agregarCarrito"]').forEach(btn => {

        btn.addEventListener('click', function (e) {
            e.stopImmediatePropagation(); // Evita doble disparo si hay onclick inline

            // Extraer nombre y precio del onclick original como fallback
            const onclickAttr = this.getAttribute('onclick');
            const match = onclickAttr.match(/agregarCarrito\(['"](.+?)['"]\s*,\s*(\d+)\)/);
            if (!match) return;

            const nombre = match[1].trim();
            const precio = parseInt(match[2]);

            // Buscar la imagen dentro de la misma tarjeta
            const card = this.closest('.product-card');
            let imgSrc = 'imagenes/default.webp'; // fallback
            if (card) {
                const imgEl = card.querySelector('img');
                if (imgEl) imgSrc = imgEl.getAttribute('src');
            }

            // Usar addToCart() del script principal (ya maneja localStorage + UI)
            addToCart({
                title: nombre,
                price: precio,
                img: imgSrc
            });
        });
    });

    // ── 5. ELIMINAR productos (por si el HTML del carrito 
    //    llama removeItem() y el script principal no está en esta página) ──
    if (typeof removeItem === 'undefined') {
        window.removeItem = function (index) {
            carrito.splice(index, 1);
            localStorage.setItem("cherry_cart", JSON.stringify(carrito));
            if (badge) badge.innerText = carrito.length;
            renderizarCarrito();
        };
    }


  // 3. Actualizamos la interfaz
    actualizarInterfaz(); 

    // 4. ABRIR EL CARRITO
    const panel = document.getElementById('side-cart');
    if (panel) {
        panel.classList.add('active');
    }

});
// Función para abrir/cerrar manualmente
function toggleCart() {
    const panel = document.getElementById('side-cart');
    if (panel) {
        panel.classList.toggle('active');
    }
}
