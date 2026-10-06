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

// Pokemon Liste laden
async function fetchPokemonList() {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    const response = await fetch(url);
    return await response.json();
}

// Details der Pokemon laden
async function loadPokemonDetails(pokemonList) {
    for (let i = 0; i < pokemonList.length; i++) {
        const response = await fetch(pokemonList[i].url);
        const pokemon = await response.json();
        allPokemon.push(pokemon);
    }
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
