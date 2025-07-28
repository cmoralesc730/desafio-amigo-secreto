// Lista para almacenar los nombres de los amigos
let amigos = [];

// Función para agregar un amigo a la lista
function agregarAmigo() {
    let input = document.getElementById("amigo"); // Captura el campo de entrada
    let nombre = input.value.trim(); // Elimina espacios en blanco
    
    // Validar que el campo no esté vacío
    if (nombre === "") {
        alert("Por favor, inserte un nombre.");
        return;
    }

    // Verificar que solo contenga letras (sin números ni símbolos)
    if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombre)) {
        alert("El nombre solo puede contener letras y espacios.");
        input.focus();
        return;
    }

    amigos.push(nombre); // Agregar el nombre al array
    input.value = ""; // Limpiar el campo de entrada
    actualizarLista(); // Actualizar la lista visualmente
}

// Función para actualizar la lista de amigos en la interfaz
function actualizarLista() {
    let lista = document.getElementById("listaAmigos"); // Seleccionar el contenedor de la lista
    lista.innerHTML = ""; // Limpiar la lista antes de actualizar
    
    // Recorrer el array y crear elementos <li> para cada amigo
    amigos.forEach(amigo => {
        let li = document.createElement("li");
        li.textContent = amigo;
        lista.appendChild(li);
    });
}

// Función para sortear un amigo aleatoriamente
function sortearAmigo() {
    // Validar que haya amigos en la lista
    if (amigos.length === 0) {
        alert("No hay amigos para sortear.");
        return;
    }

    // Generar un índice aleatorio dentro del rango del array
    let indiceAleatorio = Math.floor(Math.random() * amigos.length);
    let amigoSorteado = amigos[indiceAleatorio]; // Obtener el nombre sorteado
    
    // Mostrar el resultado en la interfaz
    let resultado = document.getElementById("resultado");
    resultado.innerHTML = `<li>El amigo sorteado es: <strong>${amigoSorteado}</strong></li>`;
}