// js/Controller/PeliculasController.js

import {
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../Service/PeliculasService";

// Variables globales
let listenersActivos = false;

// Evento pageshow para asegurar recarga completa
window.addEventListener("pageshow", async () => {
  if (!listenersActivos) activarListeners();
  await cargarPeliculas();
});

// Activa listeners solo una vez
function activarListeners() {
  listenersActivos = true;

  const form = document.getElementById("guardarPeliculasBtn").form;
  const btnAdd = document.getElementById("btnAdd");
  const modal = new bootstrap.Modal(document.getElementById("itemModal"));

  btnAdd?.addEventListener("click", () => {
    limpiarFormulario();
    modal.show();
  });

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("modalId").value;

    const payload = {
      titulo: document.getElementById("titulo").value.trim(),
      director: document.getElementById("Director").value.trim(),
      genero: document.getElementById("Genero").value.trim(),
      ano_estreno: Number(document.getElementById("ano_estreno").value),
      duracion_min: Number(document.getElementById("duracion_min").value),
    };

    try {
      if (id) {
        await updateMovie(id, payload);
      } else {
        await createMovie(payload);
      }
      modal.hide();
      await cargarPeliculas();
    } catch (err) {
      console.error("Error al guardar la película:", err);
      alert("Ocurrió un error al guardar la película.");
    }
  });
}

// Carga y renderiza películas en la tabla
async function cargarPeliculas() {
  const tableBody = document.querySelector("#itemsTable tbody");
  if (!tableBody) return;

  try {
    const data = await getMovies();

    tableBody.innerHTML = "";

    data.forEach((pelicula) => {
      const tr = document.createElement("tr");

      const tdId = document.createElement("td");
      tdId.textContent = pelicula.id ?? "N/A";
      tr.appendChild(tdId);

      const tdTitulo = document.createElement("td");
      tdTitulo.textContent = pelicula.titulo ?? "";
      tr.appendChild(tdTitulo);

      const tdDirector = document.createElement("td");
      tdDirector.textContent = pelicula.director ?? "";
      tr.appendChild(tdDirector);

      const tdGenero = document.createElement("td");
      tdGenero.textContent = pelicula.genero ?? "";
      tr.appendChild(tdGenero);

      const tdAnio = document.createElement("td");
      tdAnio.textContent = pelicula.ano_estreno ?? "";
      tr.appendChild(tdAnio);

      const tdDuracion = document.createElement("td");
      tdDuracion.textContent = pelicula.duracion_min + " min" ?? "0 min";
      tr.appendChild(tdDuracion);

      const tdFecha = document.createElement("td");
      tdFecha.textContent = pelicula.fecha_lanzamiento
        ? new Date(pelicula.fecha_lanzamiento).toLocaleDateString()
        : "-";
      tr.appendChild(tdFecha);

      // Botones de acción
      const tdBtns = document.createElement("td");
      tdBtns.className = "text-nowrap";

      const btnEdit = document.createElement("button");
      btnEdit.className = "btn btn-sm btn-outline-secondary me-1";
      btnEdit.textContent = "Editar";
      btnEdit.addEventListener("click", () => setFormulario(pelicula));
      tdBtns.appendChild(btnEdit);

      const btnDel = document.createElement("button");
      btnDel.className = "btn btn-sm btn-outline-danger";
      btnDel.textContent = "Eliminar";
      btnDel.addEventListener("click", () => {
        if (confirm("¿Eliminar esta película?")) {
          eliminarPelicula(pelicula.id);
        }
      });
      tdBtns.appendChild(btnDel);

      tr.appendChild(tdBtns);

      tableBody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error cargando películas:", err);
    tableBody.innerHTML = `<tr><td colspan="8" class="text-danger">No se pudieron cargar las películas.</td></tr>`;
  }
}

// Rellena el formulario con los datos de la película
function setFormulario(pelicula) {
  document.getElementById("modalId").value = pelicula.id ?? "";
  document.getElementById("titulo").value = pelicula.titulo ?? "";
  document.getElementById("Director").value = pelicula.director ?? "";
  document.getElementById("Genero").value = pelicula.genero ?? "";
  document.getElementById("ano_estreno").value = pelicula.ano_estreno ?? "";
  document.getElementById("duracion_min").value = pelicula.duracion_min ?? "";
}

// Limpia el formulario
function limpiarFormulario() {
  document.getElementById("modalId").value = "";
  document.getElementById("titulo").value = "";
  document.getElementById("Director").value = "";
  document.getElementById("Genero").value = "";
  document.getElementById("ano_estreno").value = "";
  document.getElementById("duracion_min").value = "";
}

// Elimina una película por ID
async function eliminarPelicula(id) {
  try {
    await deleteMovie(id);
    await cargarPeliculas();
  } catch (err) {
    console.error("Error eliminando película:", err);
    alert("No se pudo eliminar la película.");
  }
}
