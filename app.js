// 1. Configuración base
const API_URL = "https://05lyrrcvi2.execute-api.us-east-1.amazonaws.com/prod";
const COMMON_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

// 2. Cache de elementos del DOM
const DOM = {
  inputAmigo: document.getElementById("amigo"),
  listaAmigos: document.getElementById("listaAmigos"),
  resultado: document.getElementById("resultado"),
  btnAgregar: document.querySelector(".button-add"),
  btnSortear: document.querySelector(".button-draw")
};

// 3. Función POST - Agregar amigo
async function agregarAmigo() {
  const nombre = DOM.inputAmigo.value.trim();
  
  if (!nombre) {
    alert("Por favor ingresa un nombre");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/amigos`, {
      method: 'POST',
      headers: COMMON_HEADERS,
      body: JSON.stringify({ nombre })
    });

    const data = await response.json();
    
    if (!response.ok) throw new Error(data.error || "Error al agregar");
    
    DOM.inputAmigo.value = ""; // Limpiar input
    await actualizarLista(); // Actualizar lista
  } catch (error) {
    console.error("Error:", error);
    mostrarError(error.message);
  }
}

// 4. Función GET - Listar amigos
async function actualizarLista() {
  DOM.listaAmigos.innerHTML = "<li>Cargando...</li>";

  try {
    const response = await fetch(`${API_URL}/amigos`, {
      headers: COMMON_HEADERS
    });
    
    const amigos = await response.json();
    
    if (!response.ok) throw new Error(amigos.error || "Error al cargar");
    if (!Array.isArray(amigos)) throw new Error("Formato inválido");

    DOM.listaAmigos.innerHTML = ""; // Limpiar lista

    amigos.forEach(amigo => {
      const li = document.createElement("li");
      li.className = "list-item";
      
      // Input editable
      const input = document.createElement("input");
      input.type = "text";
      input.value = amigo.nombre;
      input.className = "editable-nombre";
      
      // Botón Actualizar
      const btnActualizar = document.createElement("button");
      btnActualizar.textContent = "Actualizar";
      btnActualizar.className = "btn-update";
      btnActualizar.onclick = () => actualizarAmigo(amigo.id, input.value);
      
      // Botón Eliminar
      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "Eliminar";
      btnEliminar.className = "btn-delete";
      btnEliminar.onclick = () => eliminarAmigo(amigo.id);
      
      // Ensamblar elementos
      li.append(input, btnActualizar, btnEliminar);
      DOM.listaAmigos.appendChild(li);
    });

  } catch (error) {
    mostrarError(error.message);
  }
}

// 5. Función PUT - Actualizar amigo
async function actualizarAmigo(id, nuevoNombre) {
  try {
    const response = await fetch(`${API_URL}/amigos/${id}`, {
      method: 'PUT',
      headers: COMMON_HEADERS,
      body: JSON.stringify({ nombre: nuevoNombre })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error al actualizar:", error);
    alert(error.message);
  }
}

// 6. Función DELETE - Eliminar amigo
async function eliminarAmigo(id) {
  if (!confirm("¿Eliminar este amigo?")) return;
  
  try {
    const response = await fetch(`${API_URL}/amigos/${id}`, {
      method: 'DELETE',
      headers: COMMON_HEADERS
    });

    if (!response.ok) throw new Error("Error al eliminar");
    await actualizarLista(); // Refrescar lista
    
  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
  }
}

// 7. Función GET - Sortear amigo
async function sortearAmigo() {
  DOM.resultado.innerHTML = "Sorteando...";
  
  try {
    const response = await fetch(`${API_URL}/sorteo`, {
      headers: COMMON_HEADERS
    });
    
    const data = await response.json();
    
    if (!response.ok) throw new Error(data.error || "Error en sorteo");
    
    DOM.resultado.innerHTML = `
      <li class="ganador">
        ¡El ganador es: <strong>${data.nombre}</strong>!
      </li>
    `;
  } catch (error) {
    DOM.resultado.innerHTML = `<li class="error">${error.message}</li>`;
  }
}

// 8. Función para mostrar errores
function mostrarError(mensaje) {
  DOM.listaAmigos.innerHTML = `
    <li class="error">
      ❌ ${mensaje}
      <button onclick="actualizarLista()">Reintentar</button>
    </li>
  `;
}

// 9. Inicialización
document.addEventListener('DOMContentLoaded', () => {
  // Cargar lista inicial
  actualizarLista();
  
  // Event Listeners
  DOM.btnAgregar.addEventListener('click', agregarAmigo);
  DOM.btnSortear.addEventListener('click', sortearAmigo);
  
  // Agregar con Enter
  DOM.inputAmigo.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') agregarAmigo();
  });
});