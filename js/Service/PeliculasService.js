// js/services/Movies.js
const API_URL = "localhost//:8080";
 
export async function getProducts(page = 0, size = 10) {
  const res = await fetch(`${API_URL}/getAllMovies`, {
    credentials: "include",
  });
  return res.json();
}
 
export async function createMovie(data) {
  await fetch(`${API_URL}/newMovie`, {
    credentials: "include",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
 
export async function updateMovie(id, data) {
  await fetch(`${API_URL}/updateMovie/${id}`, {
    credentials: "include",
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
 
export async function deleteMovie(id) {
  await fetch(`${API_URL}/deleteMovie/${id}`, {
    credentials: "include",
    method: "DELETE",
  });
}
 