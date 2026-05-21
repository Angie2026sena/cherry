
document.addEventListener("DOMContentLoaded", () => {

  const productos = document.querySelectorAll(".producto-card");
  const modal = document.getElementById("modalProducto");

  if (!productos.length || !modal) return;

  const modalNombre = document.getElementById("modalNombre");
  const modalPrecio = document.getElementById("modalPrecio");
  const modalDescripcion = document.getElementById("modalDescripcion");
  const modalImagen = document.getElementById("modalImagen");
  const cerrar = document.querySelector(".cerrar");

  productos.forEach(producto => {

    producto.addEventListener("click", (e) => {

      // ❌ evitar activar modal en botón o tallas
      if (e.target.closest(".btn-producto") || e.target.closest(".tallas") || e.target.closest("a")) return;

      // 🔥 EXTRAER DATOS DIRECTO DEL HTML
      const nombre = producto.querySelector("h3")?.textContent || "Producto";
      const precio = producto.querySelector("p")?.textContent || "";
      const img = producto.querySelector("img")?.src || "";
      const descripcion = producto.dataset.descripcion || "Prenda moderna y versátil ideal para cualquier ocasión.";

      // INSERTAR EN MODAL
      modalNombre.textContent = nombre;
      modalPrecio.textContent = precio;
      modalDescripcion.textContent = descripcion;
      modalImagen.src = img;

      modal.style.display = "block";
    });

  });

  cerrar.onclick = () => modal.style.display = "none";

  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };

});