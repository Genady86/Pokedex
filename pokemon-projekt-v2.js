function getTypeBackgroundColor(pokemon) {
    const type = pokemon.types[0].type.name;
    return TYPE_COLORS[type] || '#F5F5F5';
}

function showLoadingSpinner() {
    document.getElementById('loading-spinner').classList.remove('d-none');
}

function hideLoadingSpinner() {
    document.getElementById('loading-spinner').classList.add('d-none');
}

async function fetchPokemonList() {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    const response = await fetch(url);
    return await response.json();
}

async function loadPokemonList() {
    showLoadingSpinner();
    loadMoreButton.disabled = true;

    try {
        const data = await fetchPokemonList();
        await loadPokemonDetails(data.results);
        offset += limit;
        renderPokemonCards();
    } catch (error) {
        console.error('Pokemon could not be loaded:', error);
    }

    hideLoadingSpinner();
    loadMoreButton.disabled = false;
}

async function loadPokemonDetails(pokemonList) {
    for (let i = 0; i < pokemonList.length; i++) {
        const response = await fetch(pokemonList[i].url);
        const pokemon = await response.json();

        allPokemon.push(pokemon);
    }
}

function renderPokemonCards() {
    const container = document.getElementById('pokemon-container');
    container.innerHTML = '';

    for (let i = 0; i < allPokemon.length; i++) {
        container.innerHTML += getPokemonCardTemplate(allPokemon[i]);
    }
}

function getPokemonTypes(pokemon) {
    let pokemonTypes = '';

    for (let i = 0; i < pokemon.types.length; i++) {
        pokemonTypes += pokemon.types[i].type.name + ' ';
    }

    return pokemonTypes;
}

function getPokemonCardTemplate(pokemon) {
    const backgroundColor = getTypeBackgroundColor(pokemon);

    return `
        <li>
            <button
                class="pokemon-card"
                data-id="card"
                style="background-color: ${backgroundColor}"
                aria-label="Open ${pokemon.name}"
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

const loadMoreButton = document.getElementById('load-more-button');

loadMoreButton.addEventListener('click', loadPokemonList);

loadPokemonList();
