let index = 0;
let slides = [];
let bannerSlideIndex = 0;
let bannerSlides = [];
let bannerDots = [];
let bannerContainer = null;
let bannerStartX = 0;
let bannerCurrentTranslate = 0;
let bannerPrevTranslate = 0;
let bannerIsDragging = false;
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

/* ================== INICIO ================== */
window.addEventListener("load", () => {
  slides = document.querySelectorAll("#slider img");

  if (slides.length > 0) {
    showSlide(0);
  }

  renderCarrito();

  let usuarioGuardado = localStorage.getItem("usuario");
  if (usuarioGuardado) {
    mostrarUsuario(usuarioGuardado);
  }

  cargarFavoritos();

  bannerSlides = document.querySelectorAll('.slide');
  bannerDots = document.querySelectorAll('.dot');
  bannerContainer = document.querySelector('.slides');

  if (bannerSlides.length > 0 && bannerDots.length > 0 && bannerContainer) {
    showBannerSlides(0);
    setInterval(() => moveBannerSlide(1), 5000);
  }

  const slider = document.querySelector('.slider');
  if (slider) {
    slider.addEventListener('pointerdown', bannerPointerDown);
    slider.addEventListener('pointermove', bannerPointerMove);
    slider.addEventListener('pointerup', bannerPointerUp);
    slider.addEventListener('pointerleave', bannerPointerUp);
    slider.addEventListener('pointercancel', bannerPointerUp);
  }
});

/* ================== MENU ================== */
function toggleMenu() {
  document.getElementById("menu").classList.toggle("show");
}

function toggleLogin() {
  let container = document.getElementById("login-form-container");
  if (container) {
    container.classList.toggle("activo");
  }
}

function toggleRegister() {
  let container = document.getElementById("register-form-container");
  if (container) {
    container.classList.toggle("activo");
  }
}

function toggleCarrito() {
  document.getElementById("carrito-desplegable").classList.toggle("activo");
  return false;
}

/* ================== SLIDER ================== */
function showSlide(i) {
  slides.forEach(img => (img.style.display = "none"));
  index = (i + slides.length) % slides.length;
  slides[index].style.display = "block";
}

function moveSlide(step) {
  showSlide(index + step);
}

setInterval(() => {
  if (slides.length > 0) {
    moveSlide(1);
  }
}, 4000);

/* ================== CARRUSEL DE BANNERS ================== */
function showBannerSlides(n) {
  if (!bannerContainer || bannerSlides.length === 0) return;

  if (n >= bannerSlides.length) bannerSlideIndex = 0;
  if (n < 0) bannerSlideIndex = bannerSlides.length - 1;

  bannerDots.forEach(dot => dot.classList.remove('active'));
  if (bannerDots[bannerSlideIndex]) {
    bannerDots[bannerSlideIndex].classList.add('active');
  }

  bannerPrevTranslate = -bannerSlideIndex * bannerContainer.offsetWidth;
  bannerCurrentTranslate = bannerPrevTranslate;
  bannerContainer.style.transform = `translateX(${bannerPrevTranslate}px)`;
}

function moveBannerSlide(n) {
  bannerSlideIndex += n;
  showBannerSlides(bannerSlideIndex);
}

function currentBannerSlide(n) {
  bannerSlideIndex = n;
  showBannerSlides(bannerSlideIndex);
}

function bannerPointerDown(event) {
  bannerIsDragging = true;
  bannerStartX = event.clientX;
  bannerContainer.style.transition = 'none';
}

function bannerPointerMove(event) {
  if (!bannerIsDragging || !bannerContainer) return;
  const deltaX = event.clientX - bannerStartX;
  bannerContainer.style.transform = `translateX(${bannerPrevTranslate + deltaX}px)`;
}

function bannerPointerUp(event) {
  if (!bannerIsDragging || !bannerContainer) return;
  bannerIsDragging = false;
  const deltaX = event.clientX - bannerStartX;
  bannerContainer.style.transition = 'transform 1.2s ease';

  if (deltaX > 80) {
    moveBannerSlide(-1);
  } else if (deltaX < -80) {
    moveBannerSlide(1);
  } else {
    showBannerSlides(bannerSlideIndex);
  }
}

/* ================== CARRITO ================== */
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function eliminarProducto(indexItem) {
  carrito.splice(indexItem, 1);
  guardarCarrito();
  renderCarrito();
}

function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
  renderCarrito();
}

function renderCarrito() {
  let lista = document.getElementById("lista-carrito");
  let totalElemento = document.getElementById("total");
  let contadorElemento = document.getElementById("contador");

  if (!lista || !totalElemento || !contadorElemento) {
    return;
  }

  lista.innerHTML = "";
  let total = 0;

  carrito.forEach((item, i) => {
    let li = document.createElement("li");

    li.innerHTML = `
      ${item.nombre} - $${item.precio.toLocaleString()}
      <button onclick="eliminarProducto(${i})">❌</button>
    `;

    lista.appendChild(li);
    total += item.precio;
  });

  totalElemento.textContent = total.toLocaleString();
  contadorElemento.textContent = carrito.length;
}

/* ================== PAGOS ================== */
function contraentrega() {
  if (carrito.length === 0) {
    alert("Su pedido se ha registrado para pago contraentrega. Nos pondremos en contactocontigo para coordinar la entrega. ¡Gracias por tu compra! ✅");
    return;
  }

  let mensaje = "Hola, quiero comprar:\n";

  carrito.forEach(item => {
    mensaje += `${item.nombre} - $${item.precio}\n`;
  });

  let numero = "573102519142";
  window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`);
}

function pagarNequi() {
  alert("Nequi: 300 123 4567\n¡Gracias por tu compra! ✅");
}

function pagarPayPal() {
  window.open("https://www.paypal.com");
}

function pagarWeb() {
  if (carrito.length === 0) {
    alert("Carrito vacío");
    return;
  }

  alert("Pago realizado correctamente ✅");
  descargarPDF();
  vaciarCarrito();
}

/* ================== PDF ================== */
function descargarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("RECIBO KEJOMA", 20, 20);

  doc.setFontSize(12);
  let y = 40;
  let total = 0;

  carrito.forEach(item => {
    doc.text(`${item.nombre} - $${item.precio}`, 20, y);
    y += 10;
    total += item.precio;
  });

  doc.text("------------------------", 20, y);
  y += 10;
  doc.text(`TOTAL: $${total}`, 20, y);

  doc.save("recibo-kejoma.pdf");
}

/* ================== BUSCADOR ================== */
function buscarProducto() {
  let input = document.getElementById("buscador").value.toLowerCase();
  let productos = document.querySelectorAll(".producto");

  productos.forEach(p => {
    let texto = p.textContent.toLowerCase();
    p.style.display = texto.includes(input) ? "inline-block" : "none";
  });
}

/* ================== FILTRO ================== */
function filtrar(marca) {
  let secciones = document.querySelectorAll(".marca");

  secciones.forEach(sec => {
    if (marca === "all") {
      sec.style.display = "block";
    } else {
      sec.style.display = sec.classList.contains(marca) ? "block" : "none";
    }
  });
}

/* ================== LOGIN ================== */
function login(event) {
  if (event) {
    event.preventDefault();
  }

  let correoInput = document.getElementById("correo");
  let passwordInput = document.getElementById("password");
  let mensaje = document.getElementById("mensaje-login");

  if (!correoInput || !passwordInput) {
    return;
  }

  let correo = correoInput.value.trim();
  let pass = passwordInput.value.trim();

  if (correo === "" || pass === "") {
    if (mensaje) {
      mensaje.style.color = "red";
      mensaje.textContent = "⚠️ Completa todos los campos";
    } else {
      alert("Completa todos los campos");
    }
    return;
  }

  localStorage.setItem("usuario", correo); // 🔒 NO guardar contraseña

  mostrarUsuario(correo);

  if (mensaje) {
    mensaje.style.color = "green";
    mensaje.textContent = "✅ Sesión iniciada";
  }

  setTimeout(() => {
    let loginContainer = document.getElementById("login-form-container");
    if (loginContainer) {
      toggleLogin();
    } else {
      window.location.href = "index.html";
    }
  }, 1000);
}

function register(event) {
  if (event) {
    event.preventDefault();
  }

  let nombre = document.getElementById("nombre");
  let correo = document.getElementById("correo-registro");
  let telefono = document.getElementById("telefono");
  let direccion = document.getElementById("direccion");
  let fecha = document.getElementById("fecha");
  let genero = document.getElementById("genero");
  let usuario = document.getElementById("usuario-registro");
  let password = document.getElementById("password-registro");
  let passwordConfirm = document.getElementById("password-confirm");
  let mensaje = document.getElementById("mensaje-registro");

  if (!correo || !usuario || !password || !passwordConfirm || !mensaje) {
    return;
  }

  let correoVal = correo.value.trim();
  let usuarioVal = usuario.value.trim();
  let passwordVal = password.value.trim();
  let passwordConfirmVal = passwordConfirm.value.trim();

  if (correoVal === "" || usuarioVal === "" || passwordVal === "" || passwordConfirmVal === "") {
    mensaje.style.color = "red";
    mensaje.textContent = "⚠️ Completa todos los campos";
    return;
  }

  if (passwordVal !== passwordConfirmVal) {
    mensaje.style.color = "red";
    mensaje.textContent = "⚠️ Las contraseñas deben coincidir";
    return;
  }

  if (nombre && nombre.value.trim() === "") {
    mensaje.style.color = "red";
    mensaje.textContent = "⚠️ Completa tu nombre";
    return;
  }

  if (telefono && telefono.value.trim() === "") {
    mensaje.style.color = "red";
    mensaje.textContent = "⚠️ Completa tu teléfono";
    return;
  }

  if (direccion && direccion.value.trim() === "") {
    mensaje.style.color = "red";
    mensaje.textContent = "⚠️ Completa tu dirección";
    return;
  }

  if (fecha && fecha.value === "") {
    mensaje.style.color = "red";
    mensaje.textContent = "⚠️ Selecciona tu fecha";
    return;
  }

  if (genero && genero.value === "") {
    mensaje.style.color = "red";
    mensaje.textContent = "⚠️ Selecciona tu género";
    return;
  }

  localStorage.setItem("usuario", correoVal);
  localStorage.setItem("usuarioNombre", (nombre && nombre.value.trim()) || usuarioVal);

  mensaje.style.color = "green";
  mensaje.textContent = "✅ Registro exitoso";

  setTimeout(() => {
    let registerContainer = document.getElementById("register-form-container");
    if (registerContainer) {
      toggleRegister();
    } else {
      window.location.href = "index.html";
    }
  }, 1200);
}

function mostrarUsuario(nombre) {
  let btn = document.querySelector(".btn-login");
  if (!btn) {
    return;
  }
  btn.innerHTML = `<i class="fas fa-user"></i> ${nombre}`;
  btn.onclick = cerrarSesion;
}

function cerrarSesion() {
  localStorage.removeItem("usuario");

  let btn = document.querySelector(".btn-login");
  if (!btn) {
    alert("Sesión cerrada");
    return;
  }

  btn.innerHTML = `<i class="fas fa-user"></i>`;
  btn.onclick = toggleLogin;

  alert("Sesión cerrada");
}

/* ================== FAVORITOS ================== */
function cargarFavoritos() {
  document.querySelectorAll(".btn-fav").forEach(boton => {
    let nombre = boton.getAttribute("onclick").split("'")[1];

    if (favoritos.includes(nombre)) {
      boton.textContent = "❤️ Guardado";
      boton.style.background = "red";
    }
  });
}

function agregarFavoritoBtn(boton, nombre) {
  if (favoritos.includes(nombre)) {
    favoritos = favoritos.filter(f => f !== nombre);
    boton.textContent = "❤️ Favorito";
    boton.style.background = "#ff4081";
  } else {
    favoritos.push(nombre);
    boton.textContent = "❤️ Guardado";
    boton.style.background = "red";
  }

  localStorage.setItem("favoritos", JSON.stringify(favoritos));
}
let tallaSeleccionada = null;

// Seleccionar talla
function seleccionarTalla(el) {
  let tallas = el.parentElement.querySelectorAll("span");

  tallas.forEach(t => t.classList.remove("active"));

  el.classList.add("active");
  tallaSeleccionada = el.textContent;
}

// Modificar carrito para incluir talla (opcional)
function agregarCarrito(nombre, precio, btn) {
  // Si se necesita seleccionar talla (solo si hay un btn pasado)
  if (btn && !tallaSeleccionada) {
    alert("⚠️ Selecciona una talla primero");
    return;
  }

  let producto = {
    nombre: nombre,
    precio: precio
  };

  // Agregar talla si está seleccionada
  if (tallaSeleccionada) {
    producto.talla = tallaSeleccionada;
  }

  carrito.push(producto);

  guardarCarrito();
  renderCarrito();
  alert("Producto agregado 🛒");
}
function abrirGaleria(imagenes) {
  const modal = document.getElementById("modalGaleria");
  const imgGrande = document.getElementById("imgGrande");
  const miniaturas = document.getElementById("miniaturas");

  modal.style.display = "flex";

  // Imagen principal
  imgGrande.src = imagenes[0];

  // Miniaturas
  miniaturas.innerHTML = "";

  imagenes.forEach(img => {
    const mini = document.createElement("img");
    mini.src = img;

    mini.onclick = () => {
      imgGrande.src = img;
    };

    miniaturas.appendChild(mini);
  });
}

function cerrarGaleria() {
  document.getElementById("modalGaleria").style.display = "none";
}



const productos = document.querySelectorAll(".producto");
const modal = document.getElementById("modalProducto");

const modalNombre = document.getElementById("modalNombre");
const modalPrecio = document.getElementById("modalPrecio");
const modalDescripcion = document.getElementById("modalDescripcion");
const modalImagen = document.getElementById("modalImagen");
const btnComprarModal = document.getElementById("btnComprarModal");

const cerrar = document.querySelector(".cerrar");

let productoActual = {};

productos.forEach(producto => {
  producto.addEventListener("click", (e) => {

    if (e.target.classList.contains("btn-producto") || e.target.closest(".tallas")) return;

    productoActual = {
      nombre: producto.dataset.nombre,
      precio: producto.dataset.precio,
      img: producto.dataset.img,
      descripcion: producto.dataset.descripcion
    };

    modalNombre.textContent = productoActual.nombre;
    modalPrecio.textContent = productoActual.precio;
    modalDescripcion.textContent = productoActual.descripcion;
    modalImagen.src = productoActual.img;

    modal.style.display = "block";
  });
});

// Botón del modal
btnComprarModal.onclick = () => {
  agregarCarrito(productoActual.nombre, parseInt(productoActual.precio.replace(/\D/g,'')));
  modal.style.display = "none";
};

cerrar.onclick = () => modal.style.display = "none";

window.onclick = (e) => {
  if (e.target == modal) modal.style.display = "none";
};
