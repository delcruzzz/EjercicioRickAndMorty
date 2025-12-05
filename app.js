const API_URI = "https://rickandmortyapi.com/api/character/"; // Quité el '?' del final aquí para manejarlo mejor abajo

// CORRECCIÓN 1: Selectores correctos
// Usamos querySelector para todos para mantener consistencia (o getElementById SIN el #)
const htmlForm = document.querySelector('#search-form');
const htmlInput = document.querySelector("#search-input"); // Variable input -> ID input
const htmlBtn = document.querySelector("#search-btn");     // Variable btn -> ID btn
const resultsArea = document.querySelector(".characters_block"); // Seleccionamos el área de resultados

async function getCharactersByTerm(term) {
    try {
        // CORRECCIÓN 3: URL limpia
        // Si term es 'rick', la URL será: .../character/?name=rick
        const res = await fetch(`${API_URI}?name=${term}`);

        // CORRECCIÓN 2: Usar la variable correcta 'res'
        if (!res.ok) {
            // Es buena práctica limpiar resultados si no hay match
            resultsArea.innerHTML = "<p>No se encontraron personajes</p>";
            throw new Error(`Response status: ${res.status}`);
        }

        const result = await res.json(); // Usamos 'res', no 'response'
        return result;

    } catch (error) {
        console.error("Error fetching data:", error.message);
    }
}

function renderCharacters(characters) {
    // 1. Limpiamos el contenido anterior
    resultsArea.innerHTML = '';

    if (characters.length === 0) {
        // Esto solo ocurriría si la función getCharactersByTerm devuelve un array vacío
        resultsArea.innerHTML = "<p>No hay datos para mostrar.</p>";
        return;
    }

    // 2. Creamos la estructura HTML para cada personaje
    const characterHTML = characters.map(character => {
        return `
            <article class="character-card">
                <img src="${character.image}" alt="${character.name}">
                <div class="info">
                    <h3>${character.name}</h3>
                    <p>Estado: <strong>${character.status}</strong></p>
                    <p>Especie: ${character.species}</p>
                    <p>Origen: ${character.origin.name}</p>
                </div>
            </article>
        `;
    }).join(''); // Unimos todos los strings HTML en uno solo

    // 3. Insertamos el HTML completo en el contenedor
    resultsArea.innerHTML = characterHTML;
}


// Event Listener para manejar la búsqueda
htmlForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const term = htmlInput.value.trim();
    if(!term) return; // No hacer nada si el input está vacío

    // Muestra un mensaje de carga mientras espera la respuesta de la API
    resultsArea.innerHTML = "<p>⌛ Cargando personajes...</p>";

    // Obtenemos los personajes
    const characters = await getCharactersByTerm(term);

    // Llamamos a la función para pintar el HTML
    if (characters) {
        renderCharacters(characters.results);
    }

    // Opcional: limpiar el input
    // htmlInput.value = '';
});