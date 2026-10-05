// Hintergrundfarbe der Karte
function getTypeBackgroundColor(pokemon) {
    const type = pokemon.types[0].type.name;
    return TYPE_COLORS[type] || '#F5F5F5';
}

// Loading anzeigen
function showLoadingSpinner() {
    document.getElementById('loading-spinner').classList.remove('d-none');
}

// Loading ausblenden
function hideLoadingSpinner() {
    document.getElementById('loading-spinner').classList.add('d-none');
}

// Dialog öffnen
function openPokemonDialog(pokemonId) {
    const pokemonIndex = allPokemon.findIndex((pokemon) => pokemon.id == pokemonId);
    const pokemon = allPokemon[pokemonIndex];

    const dialog = document.getElementById('pokemon-dialog');
    dialog.innerHTML = getPokemonDialogTemplate(pokemon);
    dialog.showModal();
}

// Wert von einem Stat holen
function getPokemonStat(pokemon, statName) {
    for (let i = 0; i < pokemon.stats.length; i++) {
        if (pokemon.stats[i].stat.name == statName) {
            return pokemon.stats[i].base_stat;
        }
    }
}

// HTML für den Dialog
function getPokemonDialogTemplate(pokemon) {
    return `
        <div class="pokemon-dialog-content">
            ${getPokemonDialogInfo(pokemon)}
            ${getPokemonDialogButtons()}
        </div>
    `;
}

// Name, Bild und Werte
function getPokemonDialogInfo(pokemon) {
    return `
        <h2>${pokemon.name}</h2>

        <img
            class="pokemon-dialog-image"
            src="${pokemon.sprites.front_default}"
            alt="${pokemon.name}"
        >

        ${getPokemonStats(pokemon)}
    `;
}

// Pokemon Werte
function getPokemonStats(pokemon) {
    return `
        <p>HP: ${getPokemonStat(pokemon, 'hp')}</p>
        <p>Attack: ${getPokemonStat(pokemon, 'attack')}</p>
        <p>Defense: ${getPokemonStat(pokemon, 'defense')}</p>
    `;
}

// Buttons im Dialog
function getPokemonDialogButtons() {
    return `
        <div class="pokemon-dialog-buttons">
            <button aria-label="Previous Pokemon">←</button>

            <button
                aria-label="Close Pokemon details"
                onclick="closePokemonDialog()"
            >
                Close
            </button>

            <button aria-label="Next Pokemon">→</button>
        </div>
    `;
}

// Dialog schließen
function closePokemonDialog() {
    const dialog = document.getElementById('pokemon-dialog');
    dialog.close();
}

// Pokemon suchen
function searchPokemon() {
    const searchInput = document.getElementById('search-input');
    const searchValue = searchInput.value.toLowerCase();

    if (searchValue.length < 3) {
        return;
    }

    const filteredPokemon = allPokemon.filter((pokemon) => pokemon.name.includes(searchValue));

    renderPokemonCards(filteredPokemon);

    if (filteredPokemon.length == 0) {
        showNotFoundMessage();
    }
}

// Meldung bei keinem Treffer
function showNotFoundMessage() {
    const container = document.getElementById('pokemon-container');
    container.innerHTML = '<li data-id="not-found">No match found.</li>';
}

// Pokemon Liste laden
async function fetchPokemonList() {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    const response = await fetch(url);
    return await response.json();
}

// Pokemon laden und anzeigen
async function loadPokemonList() {
    showLoadingSpinner();
    loadMoreButton.disabled = true;

    try {
        const data = await fetchPokemonList();
        await loadPokemonDetails(data.results);
        offset += limit;
        renderPokemonCards(allPokemon);
    } catch (error) {
        console.error('Pokemon could not be loaded:', error);
    }

    hideLoadingSpinner();
    loadMoreButton.disabled = false;
}

// Details der Pokemon laden
async function loadPokemonDetails(pokemonList) {
    for (let i = 0; i < pokemonList.length; i++) {
        const response = await fetch(pokemonList[i].url);
        const pokemon = await response.json();

        allPokemon.push(pokemon);
    }
}

// Pokemon Karten anzeigen
function renderPokemonCards(pokemonList) {
    const container = document.getElementById('pokemon-container');
    container.innerHTML = '';

    for (let i = 0; i < pokemonList.length; i++) {
        container.innerHTML += getPokemonCardTemplate(pokemonList[i]);
    }
}

// Pokemon Typen holen
function getPokemonTypes(pokemon) {
    let pokemonTypes = '';

    for (let i = 0; i < pokemon.types.length; i++) {
        pokemonTypes += pokemon.types[i].type.name + ' ';
    }

    return pokemonTypes;
}

// HTML für eine Pokemon Karte
function getPokemonCardTemplate(pokemon) {
    const backgroundColor = getTypeBackgroundColor(pokemon);

    return `
        <li>
            <button
                class="pokemon-card"
                data-id="card"
                style="background-color: ${backgroundColor}"
                aria-label="Open ${pokemon.name}"
                onclick="openPokemonDialog(${pokemon.id})"
                >
                <h2>${pokemon.name}</h2>
                <p>#${pokemon.id}</p>
                <p>${getPokemonTypes(pokemon)}</p>

                <img
                    src="${pokemon.sprites.front_default}"
                    alt="${pokemon.name}"
                    data-id="card-image"
                >
            </button>
        </li>
    `;
}

// Search Button
const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', searchPokemon);

// Load More Button
const loadMoreButton = document.getElementById('load-more-button');
loadMoreButton.addEventListener('click', loadPokemonList);

// Erste Pokemon laden
loadPokemonList();
