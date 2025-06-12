document.addEventListener('DOMContentLoaded', () => {
    const pokemonInput = document.getElementById('pokemon-input');
    const searchButton = document.getElementById('search-button');
    const pokemonDisplay = document.getElementById('pokemon-display'); // Container für die Pokémon-Anzeige
    const initialPokemonIds = [1, 4, 7]; // IDs der Pokémon, die beim Laden angezeigt werden sollen

    searchButton.addEventListener('click', fetchPokemon);
    pokemonInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            // Verhindert, dass die Seite neu geladen wird, wenn Enter gedrückt wird
            event.preventDefault();
            // Ruft die fetchPokemon-Funktion auf
            fetchPokemon();
        }
    });

    async function fetchPokemon() {
        const pokemonNameOrId = pokemonInput.value.toLowerCase().trim();

        if (!pokemonNameOrId) {
            displayError("Bitte gib einen Pokémon-Namen oder eine ID ein.");
            return;
        }

        pokemonDisplay.innerHTML = '<p class="placeholder-text">Lade Pokémon-Daten...</p>'; // Lade-Nachricht anzeigen

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNameOrId}/`);

            if (!response.ok) {
                if (response.status === 404) {
                    displayError(`Pokémon "${pokemonNameOrId}" wurde nicht gefunden. Bitte überprüfe die Schreibweise.`);
                } else {
                    throw new Error(`Fehler beim Abrufen der Daten: ${response.status} ${response.statusText}`);
                }
                return;
            }

            const data = await response.json();
            displayPokemon(data);

        } catch (error) {
            console.error("Fehler:", error);
            displayError(`Ein unerwarteter Fehler ist aufgetreten. (${error.message})`);
        }
    }

    // Funktion zum Laden und Anzeigen mehrerer Pokémon beim Seitenstart
    async function loadInitialPokemon() {
        pokemonDisplay.innerHTML = ''; // Leert den Container vor dem Laden
        for (const id of initialPokemonIds) {
            await fetchPokemonById(id); // Lädt jedes Pokémon einzeln
        }
    }


    function displayPokemon(pokemon) {
        // Pokémon-Typen extrahieren und HTML für Badges erstellen
        const typesHtml = pokemon.types.map(typeInfo => {
            const typeName = typeInfo.type.name;
            return `<span class="type-badge ${typeName}">${typeName}</span>`;
        }).join('');

        // Daten im pokemon-display-Bereich anzeigen
        pokemonDisplay.innerHTML = `
            <div class="pokemon-card">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                <h2>${pokemon.name}</h2>
                <p>ID: #${pokemon.id}</p>
                <div class="type-badges">
                    ${typesHtml}
                </div>
                <p>Grösse: ${pokemon.height / 10} m</p>
                <p>Gewicht: ${pokemon.weight / 10} kg</p>
            </div>
        `;
    }

    // Funktion zum Abrufen eines Pokémon anhand der ID (für die Startanzeige)
    async function fetchPokemonById(id) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);

            if (!response.ok) {
                console.error(`Fehler beim Abrufen von Pokémon mit ID ${id}: ${response.status} ${response.statusText}`);
                return;
            }

            const data = await response.json();
            displayPokemonCard(data); // Zeigt die Karte an, ohne den Container zu leeren

        } catch (error) {
            console.error(`Fehler beim Abrufen von Pokémon mit ID ${id}:`, error);
        }
    }

    // Funktion zum Anzeigen einer einzelnen Pokémon-Karte (für die Startanzeige)
    function displayPokemonCard(pokemon) {
        const typesHtml = pokemon.types.map(typeInfo => {
            const typeName = typeInfo.type.name;
            return `<span class="type-badge ${typeName}">${typeName}</span>`;
        }).join('');

        pokemonDisplay.innerHTML += `
            <div class="pokemon-card">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                <h2>${pokemon.name}</h2>
                <p>ID: #${pokemon.id}</p>
                <div class="type-badges">
                    ${typesHtml}
                </div>
                <p>Grösse: ${pokemon.height / 10} m</p>
                <p>Gewicht: ${pokemon.weight / 10} kg</p>
            </div>
        `;
    }

    function displayError(message) {
        pokemonDisplay.innerHTML = `<p class="placeholder-text error-message" style="color: red;">${message}</p>`;
    }

    // Lädt die initialen Pokémon beim Laden der Seite
    loadInitialPokemon();
});