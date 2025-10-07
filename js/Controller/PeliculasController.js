// js/controllers/productController.js

// --- 1. Importación de servicios para comunicación con la API ---
import {
  getMovies,
  createMovie,
  updateMovie,
  deleteProduct,
} from "../Service.PeliculasService.js";

import { getMovies } from "../Service/PeliculasService.js";

// Enlaza los eventos de la interfaz una sola vez
function ActivarListeners() {
  listenersActivos = true;

  const tableBody = document.querySelector("#itemsTable tbody");
  const form = document.getElementById("productForm");
  const modalLabel = document.getElementById("itemModalLabel");
  const btnAdd = document.getElementById("btnAdd");


  // --- 6. Botón "Agregar" ---
  btnAdd?.addEventListener("click", () => {
    limpiarFormulario();
    modalLabel.textContent = "Agregar Producto";
    modal.show();
  });

  // --- 7. Submit del formulario (crear/actualizar producto) ---
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    let id = form.productId.value;

    // --- 8. Manejo de imagen ---
    let finalImageUrl = imageUrlHidden?.value || "";
    const file = imageFileInput?.files?.[0];
    if (file) {
      try {
        const data = await uploadImageToFolder(file, "products");
        finalImageUrl = data.url || "";
      } catch (err) {
        console.error("Error subiendo imagen:", err);
        alert("No se pudo subir la imagen. Intenta nuevamente.");
        return;
      }
    }

    // --- 9. Construcción del payload ---
    const payload = {
      nombre: form.productName.value.trim(),
      precio: Number(form.productPrice.value),
      descripcion: form.productDescription.value.trim(),
      stock: Number(form.productStock.value),
      fechaIngreso: form.productDate.value,
      categoriaId: Number(form.productCategory.value),
      usuarioId: 2,
      imagen_url: finalImageUrl || null,
    };

    // --- 10. Crear o actualizar producto ---
    try {
      if (id) {
        await updateMovie(id, payload);
      } else {
        await createMovie(payload);
      }
      modal.hide();
      await cargarProductos();
    } catch (err) {
      console.error("Error guardando:", err);
      alert("Ocurrió un error al guardar el producto.");
    }
  });

  // Guarda referencias en un objeto asociado a la función
  ActivarListeners._refs = { tableBody, form, modal, modalLabel, imageFileInput, imageUrlHidden, imagePreview };
}

// --- 11. Cargar productos con paginación ---
async function cargarProductos() {
  const { tableBody } = ActivarListeners._refs || {};
  if (!tableBody) return; // si aún no hay tabla, no hace nada

  try {
    // Solicitud al backend de la página y tamaño actuales
    const data = await getMovies(currentPage, currentSize);

    // Se asume respuesta paginada: { content, number, totalPages, totalElements }
    const items = data?.content ?? [];
    const pageNumber = data?.number ?? currentPage;
    const totalPages = data?.totalPages ?? 1;

    // Limpieza de tabla y renderizado de la paginación
    tableBody.innerHTML = "";
    renderPagination(pageNumber, totalPages);

    // --- 12. Renderizado de filas ---
    items.forEach((item) => {
      const tr = document.createElement("tr");

      // ID del producto
      const tdId = document.createElement("td");
      tdId.textContent = item.id;
      tr.appendChild(tdId);

      // Imagen (si existe se muestra, si no aparece “Sin imagen”)
      const tdImg = document.createElement("td");
      if (item.imagen_url) {
        const img = document.createElement("img");
        img.className = "thumb";
        img.alt = "img";
        img.src = item.imagen_url;
        tdImg.appendChild(img);
      } else {
        const span = document.createElement("span");
        span.className = "text-muted";
        span.textContent = "Sin imagen";
        tdImg.appendChild(span);
      }
      tr.appendChild(tdImg);

      // Nombre del producto (con fallback por compatibilidad)
      const tdNombre = document.createElement("td");
      tdNombre.textContent = item.nombre ?? item.nombreProducto ?? "Producto";
      tr.appendChild(tdNombre);

      // Descripción
      const tdDesc = document.createElement("td");
      tdDesc.textContent = item.descripcion ?? "";
      tr.appendChild(tdDesc);

      // Stock disponible
      const tdStock = document.createElement("td");
      tdStock.textContent = item.stock ?? 0;
      tr.appendChild(tdStock);

      // Fecha de ingreso (compatibilidad con distintos nombres de campo)
      const tdFecha = document.createElement("td");
      tdFecha.textContent = item.fechaIngreso ?? item.createdAt ?? item.fecha ?? "";
      tr.appendChild(tdFecha);

      // Precio (con formato numérico de 2 decimales)
      const tdPrecio = document.createElement("td");
      const precioNum = Number(item.precio ?? item.precioUnitario ?? 0);
      tdPrecio.textContent = `$${precioNum.toFixed(2)}`;
      tr.appendChild(tdPrecio);

      // Columna de botones de acción
      const tdBtns = document.createElement("td");
      tdBtns.className = "text-nowrap";





// --- 14. Rellenar formulario ---
function setFormulario(item) {
  // Obtiene referencias a los elementos del formulario y modal desde ActivarListeners
  const { form, modal, modalLabel, imageUrlHidden, imagePreview, imageFileInput } = ActivarListeners._refs || {};
  if (!form) return; // si no existe el formulario, termina la ejecución

  // Asigna valores básicos del producto a los campos del formulario
  form.productId.value = item.id;
  form.productName.value = item.nombre ?? item.nombreProducto ?? ""; // usa nombre alternativo si existe
  form.productPrice.value = item.precio ?? item.precioUnitario ?? 0;
  form.productStock.value = item.stock ?? 0;
  form.productDescription.value = item.descripcion ?? "";
  form.productCategory.value = (item.categoriaId ?? item.idCategoria ?? "") || "";

  // Formatea fecha en formato YYYY-MM-DD
  form.productDate.value = (item.fechaIngreso ?? item.createdAt ?? item.fecha ?? "").toString().slice(0, 10);

  // Manejo de la imagen del producto
  if (imageUrlHidden) imageUrlHidden.value = item.imagen_url || item.imagenUrl || item.imageUrl || "";
  if (imagePreview) imagePreview.src = imageUrlHidden?.value || ""; // muestra preview si existe
  if (imageFileInput) imageFileInput.value = ""; // limpia campo file

  // Actualiza título del modal y lo muestra
  modalLabel.textContent = "Editar Producto";
  modal.show(); 
}
}
