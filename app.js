const API_BASE = 'https://05lyrrcvi2.execute-api.us-east-1.amazonaws.com/prod';

let amigos = [];

// Agregar amigo y enviarlo a la API
function agregarAmigo() {
    let input = document.getElementById("amigo");
    let nombre = input.value.trim();

    if (nombre === "") {
        alert("Por favor, inserte un nombre.");
        return;
    }

    if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombre)) {
        alert("El nombre solo puede contener letras y espacios.");
        input.focus();
        return;
    }

    const nuevoAmigo = {
        id: crypto.randomUUID(), // Genera un ID único para cada amigo
        nombre: nombre
    };

    // Enviar a la API
    fetch(`${API_BASE}/amigos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoAmigo)
    })
    .then(response => {
        if (!response.ok) throw new Error("Error al guardar el amigo.");
        amigos.push(nombre);
        input.value = "";
        actualizarLista();
    })
    .catch(err => {
        console.error(err);
        alert("Ocurrió un error al guardar el amigo.");
    });
}

// Cargar amigos desde la API
function cargarAmigos() {
    fetch(`${API_BASE}/amigos`)
        .then(response => response.json())
        .then(data => {
            // Si body es string, parseamos a JSON
            amigos = typeof data.body === "string" ? JSON.parse(data.body) : data.body;
            actualizarLista();
        })
        .catch(err => {
            console.error(err);
            alert("Error al cargar la lista de amigos.");
        });
}

// Actualiza la lista visual
function actualizarLista() {
    let lista = document.getElementById("listaAmigos");
    lista.innerHTML = "";
    amigos.forEach(amigo => {
        let li = document.createElement("li");
        li.textContent = amigo;
        lista.appendChild(li);
    });
}

// Sortea amigo usando la API
function sortearAmigo() {
    if (amigos.length === 0) {
        alert("No hay amigos para sortear.");
        return;
    }

    fetch(`${API_BASE}/sorteo`)
        .then(response => response.json())
        .then(data => {
            const nombre = typeof data.body === "string" ? JSON.parse(`"${data.body}"`) : data.body;
            let resultado = document.getElementById("resultado");
            resultado.innerHTML = `<li>El amigo sorteado es: <strong>${nombre}</strong></li>`;
        })
        .catch(err => {
            console.error(err);
            alert("Error al realizar el sorteo.");
        });
}

// Ejecuta al cargar la página
document.addEventListener("DOMContentLoaded", cargarAmigos);