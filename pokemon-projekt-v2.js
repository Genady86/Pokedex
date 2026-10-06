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

// Laden beenden
function finishLoading() {
    hideLoadingSpinner();
    loadMoreButton.disabled = false;
}

// Evolution Chain laden
async function loadEvolutionChain(pokemon) {
    if (evolutionCache[pokemon.id]) {
        return evolutionCache[pokemon.id];
    }

    const speciesResponse = await fetch(pokemon.species.url);
    const speciesData = await speciesResponse.json();
    const evolutionResponse = await fetch(speciesData.evolution_chain.url);
    const evolutionData = await evolutionResponse.json();

    evolutionCache[pokemon.id] = evolutionData;
    return evolutionData;
}

// Dialog aktualisieren
async function updatePokemonDialog() {
    const pokemon = allPokemon[currentPokemonIndex];
    const evolutionData = await loadEvolutionChain(pokemon);
    const dialog = document.getElementById('pokemon-dialog');

    dialog.innerHTML = getPokemonDialogTemplate(pokemon, evolutionData);
}

// Dialog öffnen
async function openPokemonDialog(pokemonId) {
    currentPokemonIndex = allPokemon.findIndex((pokemon) => pokemon.id == pokemonId);

    await updatePokemonDialog();

    const dialog = document.getElementById('pokemon-dialog');
    dialog.showModal();
    document.body.classList.add('no-scroll');
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
function getPokemonDialogTemplate(pokemon, evolutionData) {
    return `
        <div class="pokemon-dialog-content">
            ${getPokemonDialogInfo(pokemon, evolutionData)}
            ${getPokemonDialogButtons()}
        </div>
    `;
}

// Name, Bild und Werte
function getPokemonDialogInfo(pokemon, evolutionData) {
    return `
        <h2>${pokemon.name}</h2>
        <img
            class="pokemon-dialog-image"
            src="${pokemon.sprites.front_default}"
            alt="${pokemon.name}"
        >
        ${getPokemonStats(pokemon)}
        ${getEvolutionTemplate(evolutionData)}
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

// Evolution anzeigen
function getEvolutionTemplate(evolutionData) {
    return `
        <p>Evolution: ${getEvolutionNames(evolutionData)}</p>
    `;
}

// Namen der Evolutionen holen
function getEvolutionNames(evolutionData) {
    const chain = evolutionData.chain;
    let names = chain.species.name;

    for (let i = 0; i < chain.evolves_to.length; i++) {
        const evolution = chain.evolves_to[i];
        names += ' > ' + evolution.species.name;
        names += getNextEvolutionNames(evolution.evolves_to);
    }

    return names;
}

// Weitere Evolutionen holen
function getNextEvolutionNames(evolutionList) {
    let names = '';

    for (let i = 0; i < evolutionList.length; i++) {
        names += ' > ' + evolutionList[i].species.name;
    }

    return names;
}

// Buttons im Dialog
function getPokemonDialogButtons() {
    return `
        <div class="pokemon-dialog-buttons">
            <button aria-label="Previous Pokemon" onclick="showPreviousPokemon()">←</button>
            <button aria-label="Close Pokemon details" onclick="closePokemonDialog()">Close</button>
            <button aria-label="Next Pokemon" onclick="showNextPokemon()">→</button>
        </div>
    `;
}

// Dialog schließen
function closePokemonDialog() {
    const dialog = document.getElementById('pokemon-dialog');
    dialog.close();
    document.body.classList.remove('no-scroll');
}

// Dialog beim Klick daneben schließen
function closeDialogOnOutside(event) {
    const dialog = document.getElementById('pokemon-dialog');

    if (event.target == dialog) {
        closePokemonDialog();
    }
}

// Nächstes Pokemon anzeigen
async function showNextPokemon() {
    if (currentPokemonIndex < allPokemon.length - 1) {
        currentPokemonIndex++;
    }

    await updatePokemonDialog();
}

// Vorheriges Pokemon anzeigen
async function showPreviousPokemon() {
    if (currentPokemonIndex > 0) {
        currentPokemonIndex--;
    }

    await updatePokemonDialog();
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
    finishLoading();
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
            ${getPokemonCardButton(pokemon, backgroundColor)}
        </li>
    `;
}

// Button der Pokemon Karte
function getPokemonCardButton(pokemon, backgroundColor) {
    return `
        <button class="pokemon-card" data-id="card"
            style="background-color: ${backgroundColor}"
            aria-label="Open ${pokemon.name}"
            onclick="openPokemonDialog(${pokemon.id})">
            ${getPokemonCardContent(pokemon)}
        </button>
    `;
}

// Inhalt der Pokemon Karte
function getPokemonCardContent(pokemon) {
    return `
        <h2>${pokemon.name}</h2>
        <p>#${pokemon.id}</p>
        <p>${getPokemonTypes(pokemon)}</p>
        ${getPokemonCardImage(pokemon)}
    `;
}

// Bild der Pokemon Karte
function getPokemonCardImage(pokemon) {
    return `
        <img
            src="${pokemon.sprites.front_default}"
            alt="${pokemon.name}"
            data-id="card-image"
        >
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
