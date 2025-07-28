const API_URL = "https://05lyrrcvi2.execute-api.us-east-1.amazonaws.com/prod";

// Cache de elementos del DOM
const DOM = {
    inputAmigo: document.getElementById("amigo"),
    listaAmigos: document.getElementById("listaAmigos"),
    resultado: document.getElementById("resultado")
};

// Estado de la aplicación
const state = {
    cargando: false,
    error: null
};

// Mostrar estado de carga
function mostrarCarga(cargando) {
    state.cargando = cargando;
    if (cargando) {
        DOM.listaAmigos.innerHTML = '<li class="cargando">Cargando...</li>';
    }
}

// Mostrar error
function mostrarError(mensaje) {
    state.error = mensaje;
    if (mensaje) {
        DOM.resultado.innerHTML = `<li class="error">Error: ${mensaje}</li>`;
    }
}

// Formatear fecha
function formatearFecha(fechaISO) {
    if (!fechaISO) return '';
    const opciones = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(fechaISO).toLocaleDateString('es-ES', opciones);
}

// Validar nombre en el cliente
function validarNombre(nombre) {
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
        return "El nombre no puede estar vacío";
    }
    
    if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombre.trim())) {
        return "El nombre solo puede contener letras y espacios";
    }
    
    return null;
}

// Agregar amigo
async function agregarAmigo() {
    const nombre = DOM.inputAmigo.value.trim();
    const errorValidacion = validarNombre(nombre);
    
    if (errorValidacion) {
        mostrarError(errorValidacion);
        return;
    }

    try {
        mostrarCarga(true);
        
        const response = await fetch(`${API_URL}/amigos`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ nombre })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || "Error al agregar amigo");
        }

        DOM.inputAmigo.value = "";
        mostrarError(null);
        await actualizarLista();
    } catch (error) {
        console.error("Error en agregarAmigo:", error);
        mostrarError(error.message);
    } finally {
        mostrarCarga(false);
    }
}

// Actualizar lista de amigos
async function actualizarLista() {
    try {
        mostrarCarga(true);
        
        const response = await fetch(`${API_URL}/amigos`, {
            headers: { 'Accept': 'application/json' }
        });
        
        if (!response.ok) {
            throw new Error("Error al cargar amigos");
        }
        
        const amigos = await response.json();
        
        if (!amigos || amigos.length === 0) {
            DOM.listaAmigos.innerHTML = '<li class="vacio">No hay amigos registrados</li>';
            return;
        }

        DOM.listaAmigos.innerHTML = "";
        
        amigos.forEach(amigo => {
            const li = document.createElement("li");
            li.className = "list-item";
            
            const divInfo = document.createElement("div");
            divInfo.className = "amigo-info";
            
            const input = document.createElement("input");
            input.type = "text";
            input.value = amigo.nombre;
            input.className = "editable-nombre";
            input.dataset.id = amigo.id;
            
            const fechaSpan = document.createElement("span");
            fechaSpan.className = "fecha-creacion";
            fechaSpan.textContent = formatearFecha(amigo.fecha_creacion);
            
            divInfo.appendChild(input);
            divInfo.appendChild(fechaSpan);
            
            const divBotones = document.createElement("div");
            divBotones.className = "amigo-botones";
            
            const updateBtn = document.createElement("button");
            updateBtn.textContent = "Actualizar";
            updateBtn.className = "btn-update";
            updateBtn.onclick = () => actualizarAmigo(amigo.id, input.value);
            
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Eliminar";
            deleteBtn.className = "btn-delete";
            deleteBtn.onclick = () => eliminarAmigo(amigo.id);
            
            divBotones.appendChild(updateBtn);
            divBotones.appendChild(deleteBtn);
            
            li.appendChild(divInfo);
            li.appendChild(divBotones);
            DOM.listaAmigos.appendChild(li);
        });
    } catch (error) {
        console.error("Error en actualizarLista:", error);
        DOM.listaAmigos.innerHTML = `<li class="error">Error: ${error.message}</li>`;
    } finally {
        mostrarCarga(false);
    }
}

// Actualizar amigo
async function actualizarAmigo(id, nuevoNombre) {
    const errorValidacion = validarNombre(nuevoNombre);
    
    if (errorValidacion) {
        mostrarError(errorValidacion);
        return;
    }

    try {
        mostrarCarga(true);
        
        const response = await fetch(`${API_URL}/amigos/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ nombre: nuevoNombre.trim() })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || "Error al actualizar amigo");
        }

        mostrarError(null);
        await actualizarLista();
    } catch (error) {
        console.error("Error en actualizarAmigo:", error);
        mostrarError(error.message);
    } finally {
        mostrarCarga(false);
    }
}

// Eliminar amigo
async function eliminarAmigo(id) {
    if (!confirm("¿Estás seguro de eliminar este amigo?")) return;
    
    try {
        mostrarCarga(true);
        
        const response = await fetch(`${API_URL}/amigos/${id}`, {
            method: 'DELETE',
            headers: { 'Accept': 'application/json' }
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || "Error al eliminar amigo");
        }

        mostrarError(null);
        await actualizarLista();
    } catch (error) {
        console.error("Error en eliminarAmigo:", error);
        mostrarError(error.message);
    } finally {
        mostrarCarga(false);
    }
}

// Sortear amigo
async function sortearAmigo() {
    try {
        mostrarCarga(true);
        DOM.resultado.innerHTML = "";
        
        const response = await fetch(`${API_URL}/sorteo`, {
            headers: { 'Accept': 'application/json' }
        });
        
        const data = await response.json();
        
        if (response.status === 404) {
            DOM.resultado.innerHTML = `<li class="aviso">${data.error}</li>`;
            return;
        }

        if (!response.ok) {
            throw new Error(data.error || "Error en el sorteo");
        }

        DOM.resultado.innerHTML = `
            <li class="ganador">
                <div>¡El amigo sorteado es:</div>
                <strong>${data.ganador.nombre}</strong>
                <div class="fecha-sorteo">Sorteado el ${formatearFecha(new Date().toISOString())}</div>
            </li>
        `;
    } catch (error) {
        console.error("Error en sortearAmigo:", error);
        DOM.resultado.innerHTML = `<li class="error">Error: ${error.message}</li>`;
    } finally {
        mostrarCarga(false);
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Configurar event listeners
    DOM.inputAmigo.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') agregarAmigo();
    });
    
    // Cargar lista inicial
    actualizarLista();
});